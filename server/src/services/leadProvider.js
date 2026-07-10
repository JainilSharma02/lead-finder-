const { searchGooglePlaces } = require('./googlePlacesProvider');
const { searchMockPlaces } = require('./mockProvider');
const { searchOSMLeads } = require('./osmProvider');
const { scrapeGoogleMaps } = require('./googleMapsScraper');

/**
 * Single entry point the rest of the app calls. Swapping data sources
 * is a config change (LEAD_DATA_PROVIDER env var), not a code change.
 */
const searchLeads = async ({ keyword, location, providerOverride }) => {
  const provider = (providerOverride || process.env.LEAD_DATA_PROVIDER || 'google').toLowerCase();

  const fallbackToOSM = async (originalError) => {
    console.warn(`Provider ${provider} failed or returned no results. Falling back to OSM...`);
    try {
      const results = await searchOSMLeads({ keyword, location });
      return { results, provider: 'osm_fallback' };
    } catch (osmError) {
      console.error('OSM fallback also failed:', osmError.message);
      // Ultimate fallback: don't error out, just return empty array
      return { results: [], provider: 'ultimate_fallback' };
    }
  };

  try {
    if (provider === 'mock') {
      return { results: await searchMockPlaces({ keyword, location }), provider: 'mock' };
    }

    if (provider === 'osm') {
      return { results: await searchOSMLeads({ keyword, location }), provider: 'osm' };
    }

    if (provider === 'google_scrape') {
      const results = await scrapeGoogleMaps({ keyword, location });
      if (!results || results.length === 0) return fallbackToOSM(new Error('No results from scrape'));
      return { results, provider: 'google_scrape' };
    }

    if (provider === 'google') {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      if (!apiKey || apiKey === 'your_google_places_api_key_here') {
        console.warn('Google Places API key missing. Falling back to Deep Scrape mode.');
        const results = await scrapeGoogleMaps({ keyword, location });
        if (!results || results.length === 0) return fallbackToOSM(new Error('No results from scrape'));
        return { results, provider: 'google_scrape' };
      }
      const results = await searchGooglePlaces({ keyword, location });
      if (!results || results.length === 0) return fallbackToOSM(new Error('No results from places'));
      return { results, provider: 'google' };
    }

    return fallbackToOSM(new Error('Unknown provider'));
  } catch (err) {
    console.error(`Error in searchLeads with provider ${provider}:`, err);
    return fallbackToOSM(err);
  }
};

module.exports = { searchLeads };
