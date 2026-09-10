const CACHE_NAME = 'islamic-stories-v2';
const assetsToCache = [
    './',
    './index.html',
    './app.js',
    './stories.js',
    './manifest.json',
    './mah.png'
];

// تثبيت ملفات التخزين المؤقت فوراً
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
    self.skipWaiting();
});

// تفعيل الخدمة وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// جلب الملفات من التخزين المؤقت عند غياب الإنترنت
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).catch(() => {
                // إذا فشل الاتصال ولم يكن الملف مخزناً، يمكنك إرجاع الـ index.html كحل احتياطي
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
