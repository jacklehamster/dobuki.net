define([
        'threejs',
        'dobuki',
        'jquery',
    ],
function(THREE, DOK, $) {

    const engine = new DOK.Engine({
        canvas: $('canvas')[0],
    });


    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    engine.scene.add( cube );

    DOK.Camera.getCamera().position.z = 5;
});