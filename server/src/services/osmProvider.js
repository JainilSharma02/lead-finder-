const axios = require('axios');

const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * OpenStreetMap Provider using Overpass API with Mirror Rotation.
 */

const searchOSMLeads = async ({ keyword, location }) => {
  let lastError = null;

  // 1. Geocode location first (shared for all mirrors)
  const geoRes = await axios.get(NOMINATIM_URL, {
    params: { q: location, format: 'json', limit: 1 },
    headers: { 'User-Agent': 'LeadFinderPro/1.0' }
  });

  if (!geoRes.data.length) return [];
  const { lat, lon } = geoRes.data[0];

  const escapedKeyword = keyword.replace(/"/g, '');
  const radius = 25000;
  
  // Intelligent Keyword Expansion for better India-specific accuracy
  let tagsQuery = `nwr["name"~"${escapedKeyword}",i](around:${radius},${lat},${lon});nwr["amenity"~"${escapedKeyword}",i](around:${radius},${lat},${lon});`;
  
  if (escapedKeyword.toLowerCase().includes('tuition') || escapedKeyword.toLowerCase().includes('class')) {
    tagsQuery += `nwr["amenity"="school"](around:${radius},${lat},${lon});nwr["amenity"="language_school"](around:${radius},${lat},${lon});nwr["office"="educational_institution"](around:${radius},${lat},${lon});`;
  }
  
  const query = `[out:json][timeout:90];(${tagsQuery});out center;`;

  // 2. Try each mirror until success
  for (const mirrorUrl of OVERPASS_MIRRORS) {
    try {
      const { data: osmData } = await axios.post(mirrorUrl, `data=${encodeURIComponent(query)}`, {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'LeadFinderPro/1.0'
        },
        timeout: 45000 // 45s per mirror
      });

      const elements = osmData.elements || [];
      return elements
        .filter(el => el.tags && el.tags.name)
        .map(el => {
        const tags = el.tags;
        const phone = tags.phone || tags['contact:phone'] || tags['contact:mobile'] || tags.mobile || '';
        // Clean phone for better display - ensure country code if missing
        const cleanPhone = phone.trim().startsWith('+') || phone.trim().startsWith('91') 
          ? phone 
          : phone.length === 10 ? `+91 ${phone}` : phone;

        return {
          placeId: `osm_${el.type}_${el.id}`,
          businessName: tags.name,
          phone: cleanPhone,
          website: tags.website || tags['contact:website'] || '',
          address: tags['addr:full'] || 
                   `${tags['addr:housenumber'] || ''} ${tags['addr:street'] || ''}, ${tags['addr:city'] || location}`.trim(),
          mapsLink: `https://www.openstreetmap.org/${el.type}/${el.id}`,
          rating: tags.rating || null,
          category: tags.amenity || tags.shop || tags.office || tags.education || keyword,
          coordinates: {
            lat: el.lat || (el.center ? el.center.lat : null),
            lon: el.lon || (el.center ? el.center.lon : null)
          }
        };
      })
      .slice(0, 40); // Cap results
    } catch (error) {
      console.warn(`Mirror ${mirrorUrl} failed:`, error.message);
      lastError = error;
      // Try next mirror
    }
  }

  // 3. If we get here, all mirrors failed
  console.error('All OSM Mirrors failed:', lastError?.message);
  throw new Error('All search servers are currently busy. Please try a more specific search or try again in a moment.');
};

module.exports = { searchOSMLeads };
