// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    enforceDefine: true,
    baseUrl: 'scripts/lib',
    paths: {
        jquery: [
            'https://code.jquery.com/jquery-3.2.1.slim.min',
            'jquery-3.2.1.slim.min',
        ],
        threejs: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/85/three.min',
        dobuki: 'https://jacklehamster.github.io/dok/out/dok',
        jsgif: 'jsgif/gif',
    },
});

define(function() {
    requirejs([
        'main.js',
    ]);
});
