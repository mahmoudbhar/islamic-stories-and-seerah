const CACHE_NAME = 'islamic-stories-v1';
const assetsToCache = [
    './index.html',
    './style.css',
    './app.js',
    './stories.js',
    './manifest.json',
    './mah.png'
];

// تثبيت التطبيق وتخزين الملفات
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
});

// تفعيل الخدمة واستجابة الطلبات بدون إنترنت
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
