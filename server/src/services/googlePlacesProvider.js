const axios = require('axios');

const TEXT_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

/**
 * Searches Google Places for businesses matching a keyword + location query,
 * then fetches details (phone/website) for each result.
 *
 * NOTE on quota/cost: Text Search + one Details call per result is the
 * correct, ToS-compliant pattern, but it is NOT free at scale. Google bills
 * per request. This function caps results per search to keep costs/quota
 * predictable — raise MAX_RESULTS deliberately, with cost in mind.
 */
const MAX_RESULTS = 20;

const buildMapsLink = (placeId, name) => {
  const query = encodeURIComponent(name || '');
  return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${placeId}`;
};

const fetchPlaceDetails = async (placeId, apiKey) => {
  const { data } = await axios.get(DETAILS_URL, {
    params: {
      place_id: placeId,
      fields: 'name,geometry,formatted_phone_number,international_phone_number,website,formatted_address,rating,types,url',
      key: apiKey,
    },
    timeout: 8000,
  });

  if (data.status !== 'OK') {
    return null;
  }
  return data.result;
};

const searchGooglePlaces = async ({ keyword, location }) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || apiKey === 'your_google_places_api_key_here') {
    const err = new Error(
      'Google Places API key is not configured. Set GOOGLE_PLACES_API_KEY in server/.env, or set LEAD_DATA_PROVIDER=mock to use sample data while developing.'
    );
    err.statusCode = 500;
    throw err;
  }

  const query = `${keyword} in ${location}`;

  const { data: searchData } = await axios.get(TEXT_SEARCH_URL, {
    params: { query, key: apiKey },
    timeout: 8000,
  });

  if (searchData.status === 'ZERO_RESULTS') {
    return [];
  }

  if (searchData.status !== 'OK') {
    const err = new Error(`Google Places search failed: ${searchData.status} ${searchData.error_message || ''}`.trim());
    err.statusCode = 502;
    throw err;
  }

  const candidates = (searchData.results || []).slice(0, MAX_RESULTS);

  // Fetch details in parallel, but don't let one failure kill the whole batch.
  const detailed = await Promise.all(
    candidates.map(async (place) => {
      try {
        const details = await fetchPlaceDetails(place.place_id, apiKey);
        return {
          placeId: place.place_id,
          businessName: details?.name || place.name,
          phone: details?.international_phone_number || details?.formatted_phone_number || '',
          website: details?.website || '',
          address: details?.formatted_address || place.formatted_address || '',
          mapsLink: details?.url || buildMapsLink(place.place_id, place.name),
          rating: details?.rating ?? place.rating ?? null,
          category: (details?.types || place.types || [])[0]?.replace(/_/g, ' ') || '',
          coordinates: details?.geometry?.location ? { lat: details.geometry.location.lat, lon: details.geometry.location.lng } : (place.geometry?.location ? { lat: place.geometry.location.lat, lon: place.geometry.location.lng } : null),
        };
      } catch {
        // If details fail for a single place, still return what we have from search results
        return {
          placeId: place.place_id,
          businessName: place.name,
          phone: '',
          website: '',
          address: place.formatted_address || '',
          mapsLink: buildMapsLink(place.place_id, place.name),
          rating: place.rating ?? null,
          category: (place.types || [])[0]?.replace(/_/g, ' ') || '',
        };
      }
    })
  );

  return detailed;
};

module.exports = { searchGooglePlaces };
