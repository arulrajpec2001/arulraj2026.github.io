const CACHE_NAME = 'arulraj-portfolio-v1';

const CACHE_ASSETS = [
    '../index.html',
    '../about.html',
    '../skills.html',
    '../projects.html',
    '../contact.html',
    '../css/style.css',
    '../manifest.json',
    '../offline.html',
    '../assets/images/profile.jpg'
];

// Call Install Event
self.addEventListener('install', e => {
    console.log('Service Worker: Installed');

    e.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                cache.addAll(CACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Call Activate Event
self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Call Fetch Event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request).catch(() => {
            return caches.match(e.request)
                .then(response => {
                    if (response) {
                        return response;
                    } else if (e.request.headers.get('accept').includes('text/html')) {
                        return caches.match('../offline.html');
                    }
                });
        })
    );
});
