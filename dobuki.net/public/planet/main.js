define([
        'threejs',
        'dobuki',
        'jquery',
    ],
function(THREE, DOK, $) {
    window.DOK = DOK;

    const engine = new DOK.Engine({
        canvas: $('canvas')[0],
    });

    var CellType = {
        wall: 1,
        water: 2,
        ground: 3,
        ice: 4,
    };

    function random(x, y, n) {
        var r = Math.PI * ((x*13) ^ y*11 ^ n);
        return r - Math.floor(r)
    }

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        engine.scene.add( cube );


    function getCellType(x,y) {
        x = Math.round(x); y = Math.round(y);
/*        if ( gameData.map.cells[x+"_"+y] !== undefined) {
            return gameData.map.cells[x+"_"+y];
        }
*/
        var hasCell = random(x,y,0)<.6 || random((y/3)|0,(x/3)|0,1) < .1;
        var hasWater = x%10===5 || y%20===10;
        if(!hasCell) {
            return CellType.wall;
        } else if(hasWater) {
            return CellType.water;
        } else {
            return CellType.ground;
        }
    }



    var images = {
        wall: [
            'img/wall.jpg',
        ],
    };
    DOK.SpriteSheet.preLoad(images);

    var spriteRenderer = new DOK.SpriteRenderer();
    engine.scene.add(spriteRenderer.mesh);

    const range = 50;
    var cells = [];
    var collection = new DOK.Collection(
        {
            type: "grid",
            get x() {
                return -Math.floor(range/2 - DOK.Camera.getCamera().position.x/256);
            },
            get y() {
                return -Math.floor(range/2 - DOK.Camera.getCamera().position.z/256);
            },
            width: range,
            height: range,
        },
        function(x,y) {
            cells.length = 0;
            var cellType = getCellType(x,y);
            var objectType = 0;//getDynamicObjectType(x,y);
            var size = 257;
            var cycle = (random(x,y,100)*1000) | 0;
            var timeCycle = cycle+(DOK.Loop.time/100)|0;

            var light = 1;

            if(cellType === CellType.water) {
                cells.push(DOK.SpriteObject.create(
                    x*256,-64-20,y*256,
                    size,size,
                    DOK.Camera.quaternions.groundQuaternionArray,
                    light,
                    DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)
//                    DOK.SpriteSheet.spritesheet.water.getFrame(cycle)
                ));
            } else if(cellType === CellType.ice) {
                cells.push(DOK.SpriteObject.create(
                    x*256,-64,y*256,
                    size,size,
                    DOK.Camera.quaternions.groundQuaternionArray,
                    light*2,
                    DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)
//                    DOK.SpriteSheet.spritesheet.ice.getFrame(cycle)
                ));
            } else if(cellType === CellType.ground) {
                cells.push(DOK.SpriteObject.create(
                    x*256,-64,y*256,
                    size,size,
                    DOK.Camera.quaternions.groundQuaternionArray,
                    light,
                    DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)
//                    DOK.SpriteSheet.spritesheet.floor.getFrame(cycle)
                ));
            } else {
                var shiftDown = 0;

                cells.push(DOK.SpriteObject.create(
                    x * 256, -64 + 128 - shiftDown, y * 256 + 128,
                    size, size,
                    DOK.Camera.quaternions.southQuaternionArray,
                    light,
                    DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)
//                        DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)
                ));
                cells.push(DOK.SpriteObject.create(
                    x * 256, -64 + 128 - shiftDown, y * 256 - 128,
                    size, size,
                    DOK.Camera.quaternions.northQuaternionArray,
                    light,
                    DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)
//                        DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)
                ));
                cells.push(DOK.SpriteObject.create(
                    x * 256 - 128, -64 + 128 - shiftDown, y * 256,
                    size, size,
                    DOK.Camera.quaternions.westQuaternionArray,
                    light,
                    DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)
                ));
                cells.push(DOK.SpriteObject.create(
                    x * 256 + 128, -64 + 128 - shiftDown, y * 256,
                    size, size,
                    DOK.Camera.quaternions.eastQuaternionArray,
                    light,
                    DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)
                ));
                cells.push(DOK.SpriteObject.create(
                    x * 256, -64 + 256 - shiftDown, y * 256,
                    size, size,
                    DOK.Camera.quaternions.groundQuaternionArray,
                    light,
                    DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)
                ));
            }
            window.c = cells;

            return cells;
        }
    );

    DOK.Loop.addLoop(function() {
        collection.forEach(spriteRenderer.display);
        spriteRenderer.updateGraphics();
        window.sr = spriteRenderer;
        window.col = collection;
    });

    DOK.Camera.getCamera().position.z = 5;
});