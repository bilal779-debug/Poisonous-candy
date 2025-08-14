// Define the name of the cache and the version number.
const CACHE_NAME = 'poisonous-candy-cache-v1';

// List of all the files to cache from your GitHub repository.
// Inka istemal `install` event ke dauran hoga.
const urlsToCache = [
  './', // Yeh start_url ko cache karta hai.
  './index.html',
  './Poison candy.js',
  './style.css',
  './coin.png',
  './gem.png',
  './Buttons.mp3',
  './LOOP2.mp3',
  './Logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
];

// 'install' event listener
// Service worker install hone par yeh event fire hota hai.
self.addEventListener('install', event => {
  // Wait until all promises inside `event.waitUntil` are resolved.
  // Hum cache kholte hain aur saari files ko usmein daalte hain.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // 'addAll' function saare URLs ko cache mein dalne ki koshish karta hai.
        return cache.addAll(urlsToCache);
      })
  );
});

// 'fetch' event listener
// Har network request ke liye yeh event fire hota hai.
self.addEventListener('fetch', event => {
  event.respondWith(
    // Cache mein request dhoondho.
    caches.match(event.request)
      .then(response => {
        // Agar cache mein response mil jaye to use wapas kar do.
        if (response) {
          return response;
        }

        // Agar cache mein na mile, to network se fetch karo.
        return fetch(event.request)
          .then(fetchResponse => {
            // Check karo ki response sahi hai ya nahi.
            // Isko cache mein save kar do, lekin original request ko wapas do.
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(error => {
            console.error('Fetching failed:', error);
            // Agar network request bhi fail ho jaye to kuch nahi karna.
          });
      })
  );
});

// 'activate' event listener
// Naya service worker activate hone par yeh event fire hota hai.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  // Purane caches ko delete karo.
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
