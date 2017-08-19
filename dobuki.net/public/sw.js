var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '',
    'login.js',
    'registerworker.js',
    'style.css',
    'scripts/main.js',
    'scripts/solveworker.js',
    'scripts/sudoku.js',
    'scripts/sudoku.wasm',
    'scripts/sudokucsolver.js',
    'scripts/sudokusolver.js',
    '//cdn.jsdelivr.net/react/15.5.4/react.min.js',
    '//cdn.jsdelivr.net/react/15.5.4/react-dom.min.js',
    '//code.jquery.com/jquery-3.2.1.min.js',
    '//cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.8.0/js/md5.js',
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache,  {credentials: 'same-origin', redirect: 'follow'});
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                var fetchRequest = event.request.clone();

                fetchResponse = fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );

                if (response.redirected) {
                    return Response.redirect(response.url);
                }

                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetchResponse;
            })
    );
});