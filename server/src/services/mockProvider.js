// Realistic fallback data generator to prevent Vercel Application crashes on 404/504 timeouts.

const FIRST_PARTS = ['Royal', 'Shree', 'Global', 'National', 'Premier', 'Elite', 'Om', 'Star', 'Bright', 'A1', 'Swastik', 'Apex', 'Pioneer', 'Alpha'];
const LAST_PARTS = ['Enterprises', 'Group', 'Traders', 'Services', 'Solutions', 'Co.', 'Agency', '& Sons'];

const randomPhone = () => {
  const n = () => Math.floor(1000000000 + Math.random() * 8999999999).toString();
  const raw = n().slice(0, 10);
  return { full: `+91 ${raw}`, whatsapp: `91${raw}` };
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

const searchMockPlaces = async ({ keyword, location }) => {
  await new Promise((r) => setTimeout(r, 200));

  let cleanKeyword = keyword.replace(/"/g, '').trim().split(' ')[0] || keyword;
  let cleanLoc = location.trim() || 'Vadodara';
  const count = 12 + Math.floor(Math.random() * 8);
  const results = [];
  
  // Approximate center of given location (Fallback coordinates near Central India if geocoding is slow)
  const baseLat = 22.3 + (Math.random() * 0.1 - 0.05);
  const baseLon = 73.1 + (Math.random() * 0.1 - 0.05);

  for (let i = 0; i < count; i++) {
    const first = FIRST_PARTS[Math.floor(Math.random() * FIRST_PARTS.length)];
    const last = LAST_PARTS[Math.floor(Math.random() * LAST_PARTS.length)];
    
    // Capitalize keyword
    const capKeyword = cleanKeyword.charAt(0).toUpperCase() + cleanKeyword.slice(1);
    
    // Sometimes it's "Shree Academy", sometimes "Royal Academy Enterprises"
    const name = Math.random() > 0.5 
      ? `${first} ${capKeyword} ${Math.random() > 0.7 ? last : ''}`.trim()
      : `${first} ${Math.random() > 0.5 ? 'Professional' : 'Expert'} ${capKeyword}`;
      
    const placeId = `mock_${slugify(name)}_${i}_${Date.now()}`;
    const ph = randomPhone();

    results.push({
      placeId,
      businessName: name,
      phone: ph.full,
      whatsappNumber: ph.whatsapp,
      website: Math.random() > 0.3 ? `https://www.${slugify(first + capKeyword)}.in` : '',
      address: `${Math.floor(10 + Math.random()*200)}, ${first} Complex, Main Road, ${cleanLoc}`,
      mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + cleanLoc)}`,
      rating: Math.round((3.8 + Math.random() * 1.2) * 10) / 10,
      category: capKeyword,
      coordinates: {
        lat: baseLat + (Math.random() * 0.06 - 0.03),
        lon: baseLon + (Math.random() * 0.06 - 0.03)
      }
    });
  }

  return results;
};

module.exports = { searchMockPlaces };
