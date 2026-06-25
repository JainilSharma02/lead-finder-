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

  if (provider === 'mock') {
    return { results: await searchMockPlaces({ keyword, location }), provider: 'mock' };
  }

  if (provider === 'osm') {
    return { results: await searchOSMLeads({ keyword, location }), provider: 'osm' };
  }

  if (provider === 'google_scrape') {
    return { results: await scrapeGoogleMaps({ keyword, location }), provider: 'google_scrape' };
  }

  if (provider === 'google') {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey || apiKey === 'your_google_places_api_key_here') {
      console.warn('Google Places API key missing. Falling back to Deep Scrape mode.');
      return { results: await scrapeGoogleMaps({ keyword, location }), provider: 'google_scrape' };
    }
    return { results: await searchGooglePlaces({ keyword, location }), provider: 'google' };
  }

  return { results: await searchGooglePlaces({ keyword, location }), provider: 'google' };
};

module.exports = { searchLeads };
