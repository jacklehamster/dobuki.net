var canvas = document.getElementById('canvas');
var overlay = document.getElementById('overlay');
var palette = document.getElementById('palette');
var canvasCtx = canvas.getContext('2d');
var overlayCtx = overlay.getContext('2d');
var paletteCtx = palette.getContext('2d');

var width = 800, height = 600;
canvas.width = width*2;
canvas.height = height*2;
canvas.style.width = width+"px";
canvas.style.height = height+"px";
overlay.width = width*2;
overlay.height = height*2;
overlay.style.width = width+"px";
overlay.style.height = height+"px";
palette.width = 300;
palette.height = 400;
palette.style.width = (palette.width/2)+"px";
palette.style.height = (palette.height/2)+"px";

var paletteData = paletteCtx.getImageData(0,0,palette.width,palette.height);

var hint = false;
var edge = false;//true;
var edge2 = true;
var canvasData;
var scale;
var paletteScale;

var img = new Image();
img.src = "taylor.png";
img.addEventListener("load", function() {
    paletteCtx.drawImage(img,0,0,img.naturalWidth,img.naturalHeight,0,0,palette.width,palette.height);
    scale = Math.min((canvas.width-palette.width)/img.naturalWidth,canvas.height/img.naturalHeight);
    if(hint) {
        canvasCtx.save();
        canvasCtx.globalAlpha = .1;
        canvasCtx.drawImage(img,0,0,img.naturalWidth,img.naturalHeight,palette.width,0,img.naturalWidth*scale,img.naturalHeight*scale);
        canvasCtx.restore();
    }
    if(edge || edge2) {
        paletteScale = 1/(2*scale*img.naturalWidth/palette.width);
        canvasData = canvasCtx.getImageData(palette.width,0,palette.width/paletteScale, palette.height/paletteScale);
        var imgData=paletteCtx.getImageData(0,0,palette.width,palette.height);
        for(var y=0; y<palette.height/(paletteScale*2); y++) {
            for(var x=0; x<palette.width/(paletteScale*2); x++) {
                var px = Math.round(x*paletteScale*2);
                var py = Math.round(y*paletteScale*2);

                var paletteIndex = (px + py*palette.width)*4;
                if(isEdge(imgData, px, py, palette.width)) {
                    var pixelIndex = (x + y*palette.width/paletteScale)*4;
                    if(edge) {
                        canvasData.data[pixelIndex] =
                            canvasData.data[pixelIndex+1] =
                                canvasData.data[pixelIndex+2] = 0;
                        canvasData.data[pixelIndex+3] = 255;
                        canvasData.data[pixelIndex+1] = 255;
                    }
                    if(edge2) {
                        paletteData.data[paletteIndex] =
                            paletteData.data[paletteIndex+1] =
                                paletteData.data[paletteIndex+2] = 0;
                        paletteData.data[paletteIndex+3] = 255;
                    }
                } else {
                    if(edge2) {
                        paletteData.data[paletteIndex] =
                            paletteData.data[paletteIndex+1] =
                                paletteData.data[paletteIndex+2] =
                                    paletteData.data[paletteIndex+3] = 255;
                    }
                }
            }
        }
        canvasCtx.putImageData(canvasData,palette.width,0);
        paletteCtx.putImageData(paletteData,0,0);
    }
});

var brush = new Image();
brush.src = "brush.png";
var backBrush = new Image();
backBrush.src = "backgrush.png";

function swapPixels(imgData, x,y,x1,y1, width) {
    var p = getPixel(imgData, x, y, width);
    var pdest = getPixel(imgData, x1, y1, width);
    setPixel(imgData, x1, y1, width, p);
    setPixel(imgData, x, y, width, pdest);
}

function dist(pixel1, pixel2) {
    var d0 = pixel1[0]-pixel2[0];
    var d1 = pixel1[1]-pixel2[1];
    var d2 = pixel1[2]-pixel2[2];
    return (d0*d0 + d1*d1 + d2*d2);
}

function isEdge(imgData, x, y, width) {
    var pixel = getPixel(imgData, x,y,width);
    var pixel1 = getPixel(imgData, x-1, y, width);
    var pixel2 = getPixel(imgData, x, y-1, width);
    var pixel3 = getPixel(imgData, x+1, y, width);
    var pixel4 = getPixel(imgData, x, y+1, width);
    return dist(pixel, pixel1) + dist(pixel, pixel2) + dist(pixel,pixel3) + dist(pixel,pixel4) > 2000;
}

function setPixel(imgData, x, y, width, pixel) {
    var pixelIndex = (x + y*width)*4;
    //console.log(imgData.data[pixelIndex], pixel);
    imgData.data[pixelIndex][0] = pixel[0];
    imgData.data[pixelIndex][1] = pixel[1];
    imgData.data[pixelIndex][2] = pixel[2];
    imgData.data[pixelIndex][3] = pixel[3];
}

function getPixel(imgData, x, y, width) {
    var pixelIndex = (x + y*width)*4;
    return [
        imgData.data[pixelIndex],
        imgData.data[pixelIndex+1],
        imgData.data[pixelIndex+2],
        imgData.data[pixelIndex+3]
    ];
}

var touching = false;

var paintSize = 30;
var point = {
    x:0, y:0, down: false,
};
addEventListener("mousedown",onMouse);
addEventListener("mouseup", onMouse);

function rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b).toString(16);
}

var color = "black";
function collectColor(e) {
    if(e.buttons && e.pageX < palette.width/2 && e.pageY < palette.height/2) {
        var x = e.pageX*2;
        var y = e.pageY*2;
        var p = paletteCtx.getImageData(x, y, 1, 1).data;
        color = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    }
}

function onMouse(e) {
    if(touching) return;
    if(collectColor(e)) return;
    point.down = e.type==="mousedown";
    point.x = e.pageX*2;
    point.y = e.pageY*2;
    return;
    if(point.down) {
        canvasCtx.fillStyle = color;
        canvasCtx.beginPath();
        canvasCtx.arc(point.x, point.y, paintSize/3, 0, 2*Math.PI);
        canvasCtx.fill();
    }
}

addEventListener("mousemove", function(e) {
    if(touching) return;
    if(collectColor(e)) return;
//    if(point.down) {
        drawFrom(point.x, point.y, e.pageX*2, e.pageY*2, paintSize, !point.down);
        point.x = e.pageX*2;
        point.y = e.pageY*2;
  //  }
});

var both = false;//true;//false;//false;// true;
var randomness = 0;
function drawFrom(x,y,x1,y1, paintSize, erase) {
/*    var num = Math.max(1,x1-x, y1-y);
    for(var i=0; i<=num; i++) {
        var px = x*i/num + x1*(num-i)/num;
        var py = y*i/num + y1*(num-i)/num;
//        canvasCtx.drawImage(backBrush,px,py);
    }
    for(var i=0; i<=num; i++) {
        var px = x*i/num + x1*(num-i)/num;
        var py = y*i/num + y1*(num-i)/num;
        canvasCtx.drawImage(brush,px,py);
    }
(/

    /*
    var paletteScale = 1/(2*scale*img.naturalWidth/palette.width);
    var dataWidth = palette.width/paletteScale;
    canvasData = canvasCtx.getImageData(palette.width,0,dataWidth, palette.height/paletteScale);
    var dx = x1-x;
    var dy = y1-y;
    var dist = Math.sqrt(dx*dx + dy*dy);
    var size = Math.min(paintSize, paintSize * 10 / dist);
    for(var i=0; i<100; i++) {
        swapPixels(canvasData,
            Math.round(x1+size*(Math.random()-.5)*randomness),
            Math.round(y1+size*(Math.random()-.5)*randomness),
            Math.round(x+size*(Math.random()-.5)*randomness),
            Math.round(y+size*(Math.random()-.5)*randomness),
            dataWidth
        );
    }
    canvasCtx.putImageData(canvasData,palette.width,0);
    //console.log("HERE");



    return;*/
/*
    cells.forEach(function(cell) {
        var dx = x1 - cell.x;
        var dy = y1 - cell.y;
        var dist = (dx*dx + dy*dy);
        if(dist < 10000) {
            cell.x += 100*dx/dist;
            cell.y += 100*dy/dist;
            //console.log(cell);
        }
    });


    return;*/
    canvasCtx.lineWidth =10;
    canvasCtx.beginPath();
    canvasCtx.moveTo(x, y);
    var dx = x1-x;
    var dy = y1-y;
    var dist = Math.sqrt(dx*dx + dy*dy);
    var size = Math.min(paintSize, paintSize * 20 / dist);
//    for(var i=0; i<1; i++) {
        canvasCtx.lineWidth =10;
        canvasCtx.strokeStyle = !both && erase ? "#CCC0B6" : "black";
        canvasCtx.moveTo(
            x+size*(Math.random()-.5)*randomness,
            y+size*(Math.random()-.5)*randomness
        );
        canvasCtx.lineTo(
            x1+size*(Math.random()-.5)*randomness,
            y1+size*(Math.random()-.5)*randomness
        );
        canvasCtx.stroke();

        if(erase || both) {
            canvasCtx.strokeStyle = "#CCC0B6";
            canvasCtx.lineWidth =10;
            //console.log(Math.atan2(y1-y,x1-x) * 180 / Math.PI);
            canvasCtx.beginPath();
            var angle2 = Math.atan2(y1-y,x1-x)+Math.PI/2;
            var cos = Math.cos(angle2)*5;
            var sin = Math.sin(angle2)*5;
            canvasCtx.moveTo(
                x-cos,
                y-sin
            );
            canvasCtx.lineTo(
                x1-cos,
                y1-sin
            );
            canvasCtx.moveTo(
                x+cos,
                y+sin
            );
            canvasCtx.lineTo(
                x1+cos,
                y1+sin
            );
            canvasCtx.stroke();
        }

/*        canvasCtx.lineTo(
            x+size*(Math.random()-.5)*randomness,
            y+size*(Math.random()-.5)*randomness
        );*/
//    }
//    canvasCtx.stroke();
}

var players = [
    {
        x: 500, y: 500, dx: 0, dy: 0,
        up: 38, left:37, right:39, down:40, act:32, erase: 16,
        color: "red",
    },
    {
        x: 700, y: 300, dx: 0, dy: 0,
        color: "blue",
        ai: true,
        range: 10,
    },
    {
        x: 400, y: 500, dx: 0, dy: 0,
        color: "green",
        ai: true,
        range: 20,
    },
    {
        x: 800, y: 800, dx: 0, dy: 0,
        color: "pink",
        ai: true,
        range: 30,
    },
    {
        x: 900, y: 400, dx: 0, dy: 0,
        color: "teal",
        ai: true,
        range: 50,
    },
];

var lastAct = 0;
var bounce = .3;
function physics(time) {
    var factor = (time-lastAct) * period / 1000;
    lastAct = time;

    players.forEach(function(player) {
        var nextX = player.x + player.dx * factor;
        var nextY = player.y + player.dy * factor;
//        if(keyboard[player.act]) {
            drawFrom(player.x, player.y, nextX, nextY, paintSize, !keyboard[player.act]);
  //      }
        player.x = nextX;
        player.y = nextY;
    });
}

var size = 30;
function draw() {
    overlayCtx.clearRect(0,0,canvas.width,canvas.height);
    players.forEach(function(player) {
        overlayCtx.fillStyle = player.color;
        overlayCtx.fillRect(player.x-size/2,player.y-size,size,size);
    });
}


var keyboard = {};
function onKey(e) {
    var down = e.type==="keydown";
    if(down && !keyboard[e.keyCode] || !down && keyboard[e.keyCode]) {
        keyboard[e.keyCode] = e.type==="keydown" ? 1 : 0;
        keyInfo.innerText = JSON.stringify(keyboard);
        nextRefresh = 0;
    }
    e.preventDefault();
}

function controls() {
    players.forEach(function(player) {
        if(!player.ai) {
            var speed = keyboard[player.pen] ? 20 : 40;
            var dx = 0, dy = 0;
            if(keyboard[player.left]) {
                dx--;
            }
            if(keyboard[player.right]) {
                dx++;
            }
            if(keyboard[player.up]) {
                dy--;
            }
            if(keyboard[player.down]) {
                dy++;
            }
            player.dx = (player.dx + dx*speed) * .5;
            player.dy = (player.dy + dy*speed) * .5;
        } else {
            if(!player.goal) {
                player.goal = findGoal(player, paletteData, player.pen ? Math.random()*player.range
                    : Math.random()*50);
//                console.log(player.goal);
            }
            if(player.goal) {
                var dx = (player.goal[0] - player.x);
                var dy = (player.goal[1] - player.y);
                var dist = Math.sqrt(dx*dx+dy*dy);
                var d= Math.min(dist, 50);
                if(dist > 0) {
                    var ddx = dx/dist * d;
                    var ddy = dy/dist * d;
//                    if(player.pen) {
                        drawFrom(player.x,player.y,player.x + ddx, player.y + ddy,paintSize, !player.pen);
//                    }
                    player.x += ddx;
                    player.y += ddy;
                } else {
                    player.pen = !player.pen || Math.random()<.9;
                    player.goal = null;
                }
            }
        }
    });
}

var goals = [];
function findGoal(player, paletteData, range) {
    if(!paletteScale) {
        return;
    }
    goals.length = 0;
    for(var i=0; i<50; i++) {
        var angle = Math.random()*Math.PI*2;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var px = Math.round((player.x - palette.width) * paletteScale*2 + cos*range);
        var py = Math.round(player.y * paletteScale*2 + sin*range);


//        var px = Math.round(player.x * paletteScale + 20*(Math.random()-.5));
  //      var py = Math.round(player.y * paletteScale + 20*(Math.random()-.5));

//        console.log(player.x, player.y, paletteScale);

        var pixel = getPixel(
            paletteData,
            px,
            py,
            palette.width
        );
        if(pixel[0]===0) {
            goals.push(
                [px / paletteScale/2 + palette.width, py / paletteScale/2,
                pixel[0]===0]
            );
        }
    }
    if(!goals.length) {
        return null;
    }
    var g = goals[Math.floor(Math.random()*goals.length)];
//    console.log(g);
    if(g[0] && g[1]) return g;
    else return null;
//    console.log(g);
//    return g;
}

var gridWidth = Math.ceil(width/10), gridHeight = Math.ceil(height/10);
var cells = new Array(gridWidth * gridHeight).fill(undefined).map(function(u) {
    return {
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
    };
});

var cellSize = 20;
function handleGrid() {
    canvasCtx.clearRect(0,0,canvas.width, canvas.height);
    canvasCtx.fillStyle = "black";
    cells.forEach(function(cell) {
        canvasCtx.fillRect(cell.x-cellSize/2,cell.y-cellSize/2,cellSize,cellSize);
    });
    players.forEach(function(player) {
//        if(keyboard)
    });
}



addEventListener("keydown", onKey);
addEventListener("keyup", onKey);

var nextRefresh = 0, frameRate = 100;
var period = 1000 / frameRate;
function loop(time) {
    if(time > nextRefresh) {
        controls();
        physics(time);
        draw();
        //handleGrid();
        nextRefresh = (Math.floor(time / period) + 1)*period;
    }
    requestAnimationFrame(loop);
}
loop();



/*

var floor = canvas.height;
var numPlayers = 2;
var players = [
    {
        x: 200, y: 0, dx: 0, dy: 0,
        up: 38, left:37, right:39, down:40, act:16,
        color: "red", paintcolor: "pink",
    },
    {
        x: 600, y: 0, dx: 0, dy: 0,
        up: 87, left:65, right:68, down:83, act:32,
        color: "blue", paintcolor: "green",
    },
];

//{"16":0,"37":0,"38":0,"39":0,"40":0,"65":0,"68":0,"83":0,"87":0}
var keyboard = {};
function onKey(e) {
    var down = e.type==="keydown";
    if(down && !keyboard[e.keyCode] || !down && keyboard[e.keyCode]) {
        keyboard[e.keyCode] = e.type==="keydown" ? 1 : 0;
        keyInfo.innerText = JSON.stringify(keyboard);
        nextRefresh = 0;
    }
    e.preventDefault();
}

var walkSpeed = 20;
var jumpSpeed = 80;
function controls() {
    players.forEach(function(player) {
        var dx = 0, dy = 0;
        if(keyboard[player.left]) {
            dx--;
        }
        if(keyboard[player.right]) {
            dx++;
        }
        if(keyboard[player.up] && floor-player.y < 5) {
            dy--;
        }
        player.dx = (player.dx + dx * walkSpeed) * .5;
        player.dy = Math.max(player.dy + dy * jumpSpeed,-80);
        player.gravity = keyboard[player.up] ? gravity : gravity*3;
    });
}


var gravity = 5;
var lastAct = 0;
var bounce = .3;
function physics(time) {
    var factor = (time-lastAct) * period / 1000;
    lastAct = time;

    players.forEach(function(player) {
        if(player.y < floor) {
            player.dy += factor*player.gravity;
        }
        player.x += player.dx*factor;
        player.y += player.dy*factor;
        if(player.y > floor) {
            player.y = floor;
            var amp = Math.abs(player.dy) * bounce;
            player.dy = amp < 5 ? 0 : -amp;
        }
    });

    checkCollision();
}

var collsize = 100;
function checkCollision() {
    var dx = players[0].x - players[1].x;
    var dy = players[0].y - players[1].y;
    var dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < size) {
        players[0].dx += dx / dist * collsize;
        players[0].dy += dy / dist * collsize;
        players[1].dx -= dx / dist * collsize;
        players[1].dy -= dy / dist * collsize;
    }
}

var size = 100;
function draw() {
    overlayCtx.clearRect(0,0,canvas.width,canvas.height);
    players.forEach(function(player) {
        overlayCtx.fillStyle = player.color;
        overlayCtx.fillRect(player.x-size/2,player.y-size,size,size);
    });
}

var paintSize = 30;
function paint() {
    var order = Math.random()<.5 ? players : [players[1], players[0]];

    order.forEach(function(player) {
        if(keyboard[player.act]) {
            canvasCtx.fillStyle = player.paintcolor;
            canvasCtx.beginPath();
            canvasCtx.arc(player.x, player.y-size/2, paintSize, 0, 2*Math.PI);
            canvasCtx.fill();
        }
    });

}

addEventListener("keydown", onKey);
addEventListener("keyup", onKey);

var nextDraw = 0, drawperiod = 20;
var nextRefresh = 0, frameRate = 30, period = 1000 / frameRate;
function loop(time) {
    if(time > nextRefresh) {
        controls();
        physics(time);
        draw();
        nextRefresh = (Math.floor(time / period) + 1)*period;
    }
    if(time > nextDraw) {
        paint();
        nextDraw = (Math.floor(time / drawperiod) + 1)*drawperiod;
    }
    requestAnimationFrame(loop);
}
loop();



*/