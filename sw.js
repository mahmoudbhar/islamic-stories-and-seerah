const CACHE_NAME = 'islamic-stories-v4';
const assetsToCache = [
    './',
    './index.html',
    './app.js',
    './stories.js',
    './style.css',
    './manifest.json',
    './mah.png'
];

// تثبيت التطبيق وتخزين الملفات الأساسية
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
    self.skipWaiting();
});

// تفعيل الخدمة وحذف الكاش القديم
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

// استراتيجية الجلب: البحث في الكاش أولاً، ثم الإنترنت، مع حفظ أي ملف جديد تلقائياً
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                // تخزين أي ملف جديد يتم جلبه تلقائياً
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                // إذا انقطع الإنترنت ولم يكن الملف مخزناً، يتم عرض الصفحة الرئيسية كبديل
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
