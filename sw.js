const CACHE_NAME = 'islamic-stories-v1';
const assetsToCache = [
  './index.html',
  './style.css',
  './app.js',
  './stories.js',
  './manifest.json',
  './mah.png'
];

// تثبيت الخدمة وحفظ الملفات في الذاكرة المؤقتة
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// جلب الملفات من التخزين المؤقت عند انقطاع الإنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
