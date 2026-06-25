const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

/**
 * Scrapes Google Maps using Puppeteer.
 * This is a fallback/alternative to the official Google Places API.
 */
const scrapeGoogleMaps = async ({ keyword, location }) => {
  const query = `${keyword} in ${location}`;
  const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();

  try {
    console.log(`Searching Google Maps for: ${query}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Handle "Accept all" cookies button if it appears
    try {
      const cookieButton = await page.$('button[aria-label*="Accept all"], button[aria-label*="Agree"], button[aria-label*="Accept"]');
      if (cookieButton) {
        await cookieButton.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => null);
      }
    } catch (e) {
      // Ignore if not found or fails
    }

    // Wait for results to appear
    const resultsSelector = '[role="feed"]';
    await page.waitForSelector('div[role="article"]', { timeout: 15000 }).catch(() => null);

    // Scroll the results pane to load more
    await page.evaluate(async (selector) => {
      const feed = document.querySelector(selector) || window;
      
      let lastHeight = feed === window ? document.body.scrollHeight : feed.scrollHeight;
      let scrollAttempts = 0;
      const maxAttempts = 3; 

      while (scrollAttempts < maxAttempts) {
        if (feed === window) {
           window.scrollBy(0, 1000);
        } else {
           feed.scrollBy(0, 1000);
        }
        await new Promise(r => setTimeout(r, 1500));
        
        let newHeight = feed === window ? document.body.scrollHeight : feed.scrollHeight;
        if (newHeight === lastHeight) {
          scrollAttempts++;
        } else {
          lastHeight = newHeight;
          scrollAttempts = 0;
        }
      }
    }, resultsSelector);

    // Extract business data
    const results = [];
    const itemHandles = await page.$$('div[role="article"]');
    
    console.log(`Found ${itemHandles.length} potential leads. Extracting details...`);

    // Limit processing for speed
    const maxToProcess = Math.min(itemHandles.length, 30);

    for (let i = 0; i < maxToProcess; i++) {
      try {
        const item = itemHandles[i];
        
        // 1. Extract basic data from the list view
        const data = await item.evaluate(el => {
          const nameEl = el.querySelector('.qBF1Pd, .fontHeadlineSmall, [role="heading"]');
          const linkEl = el.querySelector('a[href*="/maps/place/"]');
          const ratingEl = el.querySelector('span[aria-label*="stars"], .MW4Y7d');
          
          const textBlocks = Array.from(el.querySelectorAll('.W4Efsd')).map(d => d.innerText);
          const fullText = el.innerText;
          
          // Improved Phone Regex
          const phoneMatch = fullText.match(/(\+?\d[\d\s-]{8,}\d)/);
          
          const websiteBtn = el.querySelector('a[aria-label*="website"], a[href^="http"]:not([href*="google.com"])');
          
          let category = '';
          if (textBlocks.length > 1) {
             const parts = textBlocks[1].split('·');
             category = parts[0]?.trim();
          }

          let rating = null;
          if (ratingEl) {
            const label = ratingEl.getAttribute('aria-label') || ratingEl.innerText;
            const match = label.match(/(\d+\.?\d*)/);
            if (match) rating = parseFloat(match[1]);
          }

          return {
            name: nameEl ? nameEl.innerText.trim() : null,
            mapsLink: linkEl ? linkEl.href : null,
            placeId: linkEl ? (linkEl.href.match(/!1s([^!]+)/) || [null, null])[1] : null,
            phone: phoneMatch ? phoneMatch[0] : null,
            website: websiteBtn ? websiteBtn.href : null,
            category: category,
            address: textBlocks.length > 1 ? textBlocks[1].split('·')[1]?.trim() : null,
            rating: rating
          };
        });

        if (!data.name) continue;

        // 2. Click to get coordinates from URL and extra details
        await item.click();
        await new Promise(r => setTimeout(r, 1200)); 

        const currentUrl = page.url();
        let coordinates = null;
        const coordMatch = currentUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coordMatch) {
            coordinates = {
              lat: parseFloat(coordMatch[1]),
              lon: parseFloat(coordMatch[2])
            };
        }

        const sidebarData = await page.evaluate(() => {
          const phoneEl = document.querySelector('button[data-item-id^="phone:tel:"]');
          const websiteEl = document.querySelector('a[data-item-id="authority"]');
          return {
            phone: phoneEl ? phoneEl.getAttribute('data-item-id').replace('phone:tel:', '').trim() : null,
            website: websiteEl ? websiteEl.href : null
          };
        });
        
        if (sidebarData.phone) data.phone = sidebarData.phone;
        if (sidebarData.website) data.website = sidebarData.website;

        // 3. Fix Phone Number for WhatsApp
        let whatsappNumber = '';
        if (data.phone) {
            let clean = data.phone.replace(/\D/g, '');
            if (clean.startsWith('0')) clean = clean.substring(1);
            if (clean.length === 12 && clean.startsWith('91')) {
                whatsappNumber = clean;
            } else if (clean.length === 10) {
                whatsappNumber = '91' + clean;
            } else {
                whatsappNumber = clean;
            }
        }

        results.push({
          placeId: data.placeId || Math.random().toString(36).substr(2, 9),
          businessName: data.name,
          address: data.address || 'N/A',
          category: data.category || 'Business',
          rating: data.rating,
          mapsLink: data.mapsLink || currentUrl,
          phone: data.phone || '',
          whatsappNumber: whatsappNumber,
          website: data.website || '',
          coordinates: coordinates
        });

      } catch (err) {
        console.error(`Error processing lead ${i}:`, err.message);
      }
    }

    console.log(`Successfully scraped ${results.length} leads with coordinates.`);
    return results;

  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeGoogleMaps };
