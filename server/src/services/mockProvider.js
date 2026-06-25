// Sample/mock data provider — used when LEAD_DATA_PROVIDER=mock.
// Lets you build and demo the entire app without a Google API key or quota cost.
// Swap to googlePlacesProvider.js for real results; the shape returned is identical.

const FIRST_PARTS = ['Pixel', 'Bright', 'Urban', 'Nimbus', 'Crafted', 'Bluewave', 'Nova', 'Sterling', 'Vivid', 'Northstar'];
const SECOND_PARTS = ['Web', 'Digital', 'Studio', 'Labs', 'Works', 'Designs', 'Solutions', 'Media', 'Tech', 'Creative'];

const randomPhone = () => {
  const n = () => Math.floor(1000000000 + Math.random() * 8999999999).toString();
  return `+91 ${n().slice(0, 10)}`;
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

const searchMockPlaces = async ({ keyword, location }) => {
  await new Promise((r) => setTimeout(r, 600)); // simulate network latency

  const count = 8 + Math.floor(Math.random() * 8); // 8-15 results
  const results = [];

  for (let i = 0; i < count; i++) {
    const first = FIRST_PARTS[Math.floor(Math.random() * FIRST_PARTS.length)];
    const second = SECOND_PARTS[Math.floor(Math.random() * SECOND_PARTS.length)];
    const name = `${first}${second}`;
    const placeId = `mock_${slugify(name)}_${i}_${Date.now()}`;

    results.push({
      placeId,
      businessName: `${name} ${keyword.split(' ')[0]}`,
      phone: randomPhone(),
      website: Math.random() > 0.2 ? `https://www.${slugify(name)}.com` : '',
      address: `${100 + i} ${location} Main Road, ${location}`,
      mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + location)}`,
      rating: Math.round((3 + Math.random() * 2) * 10) / 10,
      category: keyword.toLowerCase(),
    });
  }

  return results;
};

module.exports = { searchMockPlaces };
