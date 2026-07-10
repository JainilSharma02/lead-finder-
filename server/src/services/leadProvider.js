const { searchGooglePlaces } = require('./googlePlacesProvider');
const { searchMockPlaces } = require('./mockProvider');
const { searchNominatimLeads } = require('./nominatimProvider');
const { scrapeGoogleMaps } = require('./googleMapsScraper');

/**
 * Single entry point the rest of the app calls. Swapping data sources
 * is a config change (LEAD_DATA_PROVIDER env var), not a code change.
 */
const searchLeads = async ({ keyword, location, providerOverride }) => {
  const provider = (providerOverride || process.env.LEAD_DATA_PROVIDER || 'google').toLowerCase();

  const fallbackToNominatim = async (originalError) => {
    console.warn(`Provider ${provider} failed or returned no results. Falling back to Nominatim...`);
    
    // If already Nominatim, go straight to ultimate mock fallback
    if (provider === 'osm') {
      const mockResults = await searchMockPlaces({ keyword, location });
      return { results: mockResults, provider: 'ultimate_fallback' };
    }
    
    try {
      const results = await searchNominatimLeads({ keyword, location });
      if (!results || results.length === 0) throw new Error('Nominatim returned 0 results');
      return { results, provider: 'osm_fallback' };
    } catch (nomErr) {
      console.error('Nominatim fallback also failed:', nomErr.message);
      const mockResults = await searchMockPlaces({ keyword, location });
      return { results: mockResults, provider: 'ultimate_fallback' };
    }
  };

  try {
    if (provider === 'mock') {
      return { results: await searchMockPlaces({ keyword, location }), provider: 'mock' };
    }

    if (provider === 'osm') {
      const results = await searchNominatimLeads({ keyword, location });
      if (!results || results.length === 0) return fallbackToNominatim(new Error('No results'));
      return { results, provider: 'osm' };
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

    return fallbackToNominatim(new Error('Unknown provider'));
  } catch (err) {
    console.error(`Error in searchLeads with provider ${provider}:`, err);
    return fallbackToNominatim(err);
  }
};

module.exports = { searchLeads };
