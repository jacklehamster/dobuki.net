const CACHE_NAME = 'clientapp-site-cache-v1';
const urlsToCache = [
    '',
    'react.min.js',
    'react-dom.min.js',
    'style.css',
    'translator.js',
    'registersw.js',
    'api.js',
    'data.json',
    'localize.js',
    'jquery-3.2.1.min.js',
    'pickadate.js-3.5.6/lib/compressed/picker.js',
    'pickadate.js-3.5.6/lib/compressed/picker.date.js',
    'pickadate.js-3.5.6/lib/compressed/picker.time.js',
    'pickadate.js-3.5.6/lib/compressed/legacy.js',
    'pickadate.js-3.5.6/lib/compressed/translations/ko_KR.js',
    'pickadate.js-3.5.6/lib/compressed/themes/default.css',
    'pickadate.js-3.5.6/lib/compressed/themes/default.date.css',
    'pickadate.js-3.5.6/lib/compressed/themes/default.time.css',
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});



self.addEventListener('fetch', function(event) {

    const finalPath = event.request.url.match(/http[s]?:\/\/(.*)\/([^/?]+)\/?(\?.*)?/)[2];
    if (finalPath === 'last_service') {
        const id = event.request.url.match(/^http[s]?:\/\/(.*)\/([^/?]+)\/?(\?.*)?$/)[3].match(/id=(\w+)/)[1];
        const set = event.request.url.match(/^http[s]?:\/\/(.*)\/([^/?]+)\/?(\?.*)?$/)[3].match(/set=(\w+)/)[1];

//        localStorage.setItem(`lastService_${id}`, set==='true' ? Date.now() : null);
        return null;
    }


    event.respondWith(
        caches.match(event.request)
            .then(function(cacheResponse) {
                const fetchRequest = event.request.clone();

                fetchResponse = fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            // Cache hit - return response
                            if (cacheResponse) {
                                return cacheResponse;
                            } else {
                                return response;
                            }
                        }

                        const responseToCache = response.clone();

                        return caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                                return response;
                            });
                    }
                ).catch((e) => {
                    return cacheResponse;
                });

                return fetchResponse;
            })
            .catch((e) => {
                return null;
        })
    );
});