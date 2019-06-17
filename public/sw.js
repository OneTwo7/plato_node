const staticCacheName = 'plato-static-v1';
let assetsToCache = [...self.serviceWorkerOption.assets, '/'];

if (process.env.NODE_ENV === 'development') {
    assetsToCache = assetsToCache.filter(assetPath => {
        if (assetPath.endsWith('.hot-update.js') || assetPath.endsWith('.hot-update.json')) {
            return false;
        }

        return true;
    });
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll(assetsToCache);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('staff-') && cacheName !== staticCacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    const requestUrl = new URL(request.url);

    if (requestUrl.origin !== location.origin) {
        return;
    }

    if (requestUrl.pathname.startsWith('/api')) {
        return;
    }

    event.respondWith(
        caches.match(request).then(function (response) {
            return response || fetch(request);
        })
    );
});
