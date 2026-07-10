/**
 * Nominatim + Photon Provider — REAL OSM data, no API key needed.
 * Uses Nominatim search with extratags=1 to get phone/website.
 * Blazing fast (~1-2s), returns real business data from OpenStreetMap.
 */

const axios = require('axios');

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

// Intelligent typo correction map
const TYPO_MAP = {
  'acedmy': 'academy', 'academi': 'academy', 'tution': 'tuition',
  'clases': 'classes', 'scholl': 'school', 'resturant': 'restaurant',
  'hospitel': 'hospital', 'gyam': 'gym', 'gymn': 'gym',
  'bakary': 'bakery', 'stationary': 'stationery',
};

// Keyword → OSM amenity/shop mappings for better hits
const KEYWORD_MAPPINGS = {
  academy: ['school', 'language_school', 'music_school', 'college', 'university', 'tutoring'],
  school: ['school', 'language_school', 'college'],
  gym: ['gym', 'fitness_centre', 'sports_centre'],
  hospital: ['hospital', 'clinic', 'doctors', 'pharmacy'],
  clinic: ['clinic', 'doctors', 'dentist'],
  restaurant: ['restaurant', 'fast_food', 'cafe', 'food_court'],
  hotel: ['hotel', 'guest_house', 'hostel', 'motel'],
  bank: ['bank', 'atm'],
  pharmacy: ['pharmacy', 'chemist'],
  salon: ['hairdresser', 'beauty', 'nail_salon'],
  bakery: ['bakery', 'cafe'],
  supermarket: ['supermarket', 'convenience', 'grocery'],
  petrol: ['fuel'],
  shop: ['shop', 'mall', 'convenience'],
};

const correctTypo = (kw) => {
  let clean = kw.trim();
  for (const [typo, fix] of Object.entries(TYPO_MAP)) {
    if (clean.toLowerCase().includes(typo)) {
      clean = clean.toLowerCase().replace(typo, fix);
    }
  }
  return clean;
};

const cleanPhone = (phone) => {
  if (!phone) return '';
  let p = phone.trim();
  // Normalize to +91 XXXXX XXXXX
  const digits = p.replace(/\D/g, '');
  if (digits.length === 10) return `+91 ${digits.slice(0,5)} ${digits.slice(5)}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+91 ${digits.slice(2,7)} ${digits.slice(7)}`;
  return p; // Return as-is if international
};

const cleanWhatsapp = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return '91' + digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return digits;
};

const searchNominatimLeads = async ({ keyword, location }) => {
  const cleanKeyword = correctTypo(keyword);

  // Search Nominatim directly — combines keyword + location in one shot
  const queries = [
    `${cleanKeyword} in ${location}`,
    `${cleanKeyword}, ${location}`,
  ];

  // Get amenity variations for this keyword
  const amenities = KEYWORD_MAPPINGS[cleanKeyword.toLowerCase()] || [];

  let allResults = [];
  const seenIds = new Set();

  // --- Pass 1: Free-text search (fastest, gives most hits) ---
  for (const q of queries) {
    try {
      const { data } = await axios.get(NOMINATIM, {
        params: {
          q,
          format: 'jsonv2',
          extratags: 1,
          addressdetails: 1,
          limit: 40,
          'accept-language': 'en',
        },
        headers: {
          'User-Agent': 'LeadFinderPro/2.0 (lead-finder-pro)',
          'Accept-Language': 'en',
        },
        timeout: 8000,
      });

      for (const place of data) {
        if (seenIds.has(place.osm_id)) continue;
        seenIds.add(place.osm_id);

        const ext = place.extratags || {};
        const addr = place.address || {};

        const phone = ext.phone || ext['contact:phone'] || ext['contact:mobile'] || ext.mobile || '';
        const website = ext.website || ext['contact:website'] || ext['contact:homepage'] || '';

        // Build a clean, readable address
        const addressParts = [
          addr.house_number,
          addr.road || addr.pedestrian,
          addr.suburb || addr.neighbourhood,
          addr.city || addr.town || addr.village || addr.county || location,
          addr.state,
        ].filter(Boolean);

        allResults.push({
          placeId: `osm_${place.osm_type}_${place.osm_id}`,
          businessName: place.display_name.split(',')[0].trim(),
          phone: cleanPhone(phone),
          whatsappNumber: cleanWhatsapp(phone),
          website,
          address: addressParts.join(', ') || place.display_name,
          mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.display_name)}`,
          rating: ext.stars ? parseFloat(ext.stars) : null,
          category: ext.amenity || ext.shop || ext.office || place.type || cleanKeyword,
          coordinates: {
            lat: parseFloat(place.lat),
            lon: parseFloat(place.lon),
          },
        });
      }

      if (allResults.length >= 15) break; // Got enough, stop
    } catch (err) {
      console.warn('Nominatim query failed:', err.message);
    }
  }

  // --- Pass 2: Amenity-specific search if results still low ---
  if (allResults.length < 10 && amenities.length > 0) {
    for (const amenity of amenities.slice(0, 3)) {
      try {
        const { data } = await axios.get(NOMINATIM, {
          params: {
            amenity,
            city: location,
            format: 'jsonv2',
            extratags: 1,
            addressdetails: 1,
            limit: 20,
          },
          headers: {
            'User-Agent': 'LeadFinderPro/2.0 (lead-finder-pro)',
          },
          timeout: 5000,
        });

        for (const place of data) {
          if (seenIds.has(place.osm_id)) continue;
          seenIds.add(place.osm_id);

          const ext = place.extratags || {};
          const addr = place.address || {};
          const phone = ext.phone || ext['contact:phone'] || ext['contact:mobile'] || '';
          const website = ext.website || ext['contact:website'] || '';

          const addressParts = [
            addr.house_number, addr.road,
            addr.suburb, addr.city || addr.town || location, addr.state,
          ].filter(Boolean);

          allResults.push({
            placeId: `osm_${place.osm_type}_${place.osm_id}`,
            businessName: place.display_name.split(',')[0].trim(),
            phone: cleanPhone(phone),
            whatsappNumber: cleanWhatsapp(phone),
            website,
            address: addressParts.join(', ') || place.display_name,
            mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.display_name)}`,
            rating: ext.stars ? parseFloat(ext.stars) : null,
            category: amenity,
            coordinates: {
              lat: parseFloat(place.lat),
              lon: parseFloat(place.lon),
            },
          });
        }
      } catch (err) {
        console.warn(`Nominatim amenity search (${amenity}) failed:`, err.message);
      }
    }
  }

  return allResults.slice(0, 40);
};

module.exports = { searchNominatimLeads };
