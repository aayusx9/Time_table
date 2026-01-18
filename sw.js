const CACHE_NAME = 'success-monster-v3';
const ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/state.js',
    '/js/modules/onboarding.js',
    '/js/modules/scheduler.js',
    '/js/modules/curriculum.js',
    '/js/modules/ui.js',
    '/js/modules/storage.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});
