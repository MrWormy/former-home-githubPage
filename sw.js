self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('applicationCache').then(function(cache) {
            return cache.addAll([
                './',
                './index.html',
                './manifest.webmanifest',
                './apple-touch-icon.png',
                './favicon.ico',
                './public/style.css',
                './public/app.js',
                './public/loading.png',
                './public/icon144.png'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
            return response;
        } else {
            return new Response('Unknown component');
        }
    }));
});
