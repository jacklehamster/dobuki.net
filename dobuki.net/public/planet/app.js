requirejs.config({
    enforceDefine: true,
    baseUrl: 'scripts/lib',
    paths: {
        jquery: [
            'https://code.jquery.com/jquery-3.2.1.slim.min',
            'lib/jquery-3.2.1.slim.min',
        ],
        threejs: [
            'https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.min',
            'lib/three.min.js',
        ],
        dobuki: [
            'https://jacklehamster.github.io/dok/out/dok',
            'lib/dok.min.js',
        ],
    },
});

define(function() {
    requirejs([
        'main.js',
    ]);
});
