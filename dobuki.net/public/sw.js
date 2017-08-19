var CACHE_NAME = 'my-site-cache-v1';

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                var urlsToPrefetch = [
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
                    'https://cdn.jsdelivr.net/react/15.5.4/react.min.js',
                    'https://cdn.jsdelivr.net/react/15.5.4/react-dom.min.js',
                    'https://code.jquery.com/jquery-3.2.1.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.8.0/js/md5.js',
                    'https://fonts.googleapis.com/css?family=Concert+One|Fredoka+One',
                ];
                return cache.addAll(urlsToPrefetch.map(function(urlToPrefetch) {
                    return new Request(urlToPrefetch, {mode: 'cors'});
                }),  {redirect: 'follow'});
            })
            .catch(function(error) {
                console.error('Pre-fetching failed:', error);
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

                // Cache hit - return response
                if (response) {
                    if (response.redirected) {
                        for(var i in response) {
                            console.log(i,response[i]);
                        }
                        return Response.redirect(response.url);
                    }
                    return response;
                }

                return fetchResponse;
            })
    );
});