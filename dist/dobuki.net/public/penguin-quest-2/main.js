'use strict';

define(['threejs', 'dobuki'], function (THREE, DOK) {

    window.THREE = THREE;
    window.DOK = DOK;

    var engine = new DOK.Engine();

    var eggMove = new THREE.Vector3();
    var lastThrow = 0;

    var forwardVector = new THREE.Vector3(0, 1, 0);
    var moveVector = new THREE.Vector3(0, 0, 0);

    function trigger(obj) {
        DOK.Loop.addLoop(obj.loop.bind(obj));
    }

    var debug = {
        fps: location.search.indexOf("fps") >= 0,
        control: location.search.indexOf("control") >= 0,
        a: 0,
        b: 0,
        c: 0
    };

    document.getElementById("fps").style.display = debug.fps ? "" : "none";

    if (debug.control) {
        //        DOK.addControlBall();
        //      DOK.addControlBox();
    }

    var images = {
        items: ["assets/img/items.png|0,0,32,32", "assets/img/items.png|32,0,32,32", "assets/img/items.png|0,32,32,32", "assets/img/items.png|32,32,32,32", ["assets/img/fish.png|0,0,16,16", "assets/img/fish.png|0,16,16,16"]],
        squid: {
            normal: ["lib/dobuki/images/squid.png|0,0,32,32", "lib/dobuki/images/squid.png|32,0,32,32", "lib/dobuki/images/squid.png|0,32,32,32", "lib/dobuki/images/squid.png|32,32,32,32"],
            shadow: ["lib/dobuki/images/squid.png|0,0,32,32|shadow", "lib/dobuki/images/squid.png|32,0,32,32|shadow", "lib/dobuki/images/squid.png|0,32,32,32|shadow", "lib/dobuki/images/squid.png|32,32,32,32|shadow"]
        },
        //*
        floor: ["assets/img/snow.png|0,0,32,32", "assets/img/snow.png|32,0,32,32", "assets/img/snow.png|0,32,32,32", "assets/img/snow.png|32,32,32,32"],
        ice: ["assets/img/ice.png", "assets/img/ice.png|scale:-1"],
        wall: ["assets/img/ice.png", "assets/img/ice.png|scale:-1"],
        picture_frame: ["assets/img/penguin-quest.jpg"],
        /*/
        floor: [
            "assets/img/ice.png|scale:-1,-1",
            "assets/img/ice.png",
            "assets/img/ice.png|scale:1,-1",
            "assets/img/ice.png|scale:-1,1",
        ],
        wall: [
            "assets/img/snow.png|0,0,32,32",
            "assets/img/snow.png|32,0,32,32",
            "assets/img/snow.png|0,32,32,32",
            "assets/img/snow.png|32,32,32,32",
        ],
        //*/
        water: ["lib/dobuki/images/water.gif"],
        door: ["assets/img/wooddoor.png|cross"],
        bunny: {
            normal: {
                still: {
                    left: ["assets/img/bunny.png|0,0,32,32|scale:-1,1", "assets/img/bunny.png|32,0,32,32|scale:-1,1"],
                    right: ["assets/img/bunny.png|0,0,32,32", "assets/img/bunny.png|32,0,32,32"]
                },
                walk: {
                    left: ["assets/img/bunny.png|0,32,32,32|scale:-1,1", "assets/img/bunny.png|32,32,32,32|scale:-1,1"],
                    right: ["assets/img/bunny.png|0,32,32,32", "assets/img/bunny.png|32,32,32,32"]
                }
            },
            shadow: {
                still: {
                    left: ["assets/img/bunny.png|0,0,32,32|scale:-1,1|shadow", "assets/img/bunny.png|32,0,32,32|scale:-1,1|shadow"],
                    right: ["assets/img/bunny.png|0,0,32,32|shadow", "assets/img/bunny.png|32,0,32,32|shadow"]
                },
                walk: {
                    left: ["assets/img/bunny.png|0,32,32,32|scale:-1,1|shadow", "assets/img/bunny.png|32,32,32,32|scale:-1,1|shadow"],
                    right: ["assets/img/bunny.png|0,32,32,32|shadow", "assets/img/bunny.png|32,32,32,32|shadow"]
                }
            }
        },
        penguin: {
            normal: {
                front: ["assets/img/penguin.png|0,0,32,32", "assets/img/penguin.png|32,0,32,32", "assets/img/penguin.png|0,32,32,32", "assets/img/penguin.png|32,32,32,32"],
                right: ["assets/img/penguin-right.png|0,0,32,32", "assets/img/penguin-right.png|32,0,32,32", "assets/img/penguin-right.png|0,32,32,32", "assets/img/penguin-right.png|32,32,32,32"],
                left: ["assets/img/penguin-right.png|0,0,32,32|scale:-1,1", "assets/img/penguin-right.png|32,0,32,32|scale:-1,1", "assets/img/penguin-right.png|0,32,32,32|scale:-1,1", "assets/img/penguin-right.png|32,32,32,32|scale:-1,1"],
                back: ["assets/img/penguin-up.png|0,0,32,32", "assets/img/penguin-up.png|32,0,32,32", "assets/img/penguin-up.png|0,32,32,32", "assets/img/penguin-up.png|32,32,32,32"]
            },
            shadow: {
                front: ["assets/img/penguin.png|0,0,32,32|shadow", "assets/img/penguin.png|32,0,32,32|shadow", "assets/img/penguin.png|0,32,32,32|shadow", "assets/img/penguin.png|32,32,32,32|shadow"],
                right: ["assets/img/penguin-right.png|0,0,32,32|shadow", "assets/img/penguin-right.png|32,0,32,32|shadow", "assets/img/penguin-right.png|0,32,32,32|shadow", "assets/img/penguin-right.png|32,32,32,32|shadow"],
                left: ["assets/img/penguin-right.png|0,0,32,32|scale:-1,1|shadow", "assets/img/penguin-right.png|32,0,32,32|scale:-1,1|shadow", "assets/img/penguin-right.png|0,32,32,32|scale:-1,1|shadow", "assets/img/penguin-right.png|32,32,32,32|scale:-1,1|shadow"],
                back: ["assets/img/penguin-up.png|0,0,32,32|shadow", "assets/img/penguin-up.png|32,0,32,32|shadow", "assets/img/penguin-up.png|0,32,32,32|shadow", "assets/img/penguin-up.png|32,32,32,32|shadow"]
            },
            swim: {
                front: ["assets/img/penguin-swim.png|0,0,32,32", "assets/img/penguin-swim.png|32,0,32,32"],
                right: ["assets/img/penguin-swim-right.png|0,0,32,32", "assets/img/penguin-swim-right.png|32,0,32,32", "assets/img/penguin-swim-right.png|0,32,32,32", "assets/img/penguin-swim-right.png|32,32,32,32"],
                left: ["assets/img/penguin-swim-right.png|0,0,32,32|scale:-1,1", "assets/img/penguin-swim-right.png|32,0,32,32|scale:-1,1", "assets/img/penguin-swim-right.png|0,32,32,32|scale:-1,1", "assets/img/penguin-swim-right.png|32,32,32,32|scale:-1,1"],
                back: ["assets/img/penguin-swim.png|0,32,32,32", "assets/img/penguin-swim.png|32,32,32,32"]
            },
            slide: {
                front: ["assets/img/slide-up-down.png|0,0,32,32"],
                right: ["assets/img/slide-right.png|0,0,32,32"],
                left: ["assets/img/slide-right.png|0,0,32,32|scale:-1,1"],
                back: ["assets/img/slide-up-down.png|0,32,32,32"]
            }
        },
        bigface: {
            normal: {
                still: ["assets/img/bigface.png|0,0,64,64", "assets/img/bigface.png|64,64,64,64"],
                walk: ["assets/img/bigface.png|0,0,64,64", "assets/img/bigface.png|64,0,64,64", "assets/img/bigface.png|0,0,64,64|scale:-1,1", "assets/img/bigface.png|64,0,64,64|scale:-1,1"]
            },
            shadow: {
                still: ["assets/img/bigface.png|0,0,64,64|shadow", "assets/img/bigface.png|64,64,64,64|shadow"],
                walk: ["assets/img/bigface.png|0,0,64,64|shadow", "assets/img/bigface.png|64,0,64,64|shadow", "assets/img/bigface.png|0,0,64,64|scale:-1,1|shadow", "assets/img/bigface.png|64,0,64,64|scale:-1,1|shadow"]
            }
        },
        elf: {
            normal: {
                still: ["assets/img/elf.png|0,0,64,64", "assets/img/elf.png|64,0,64,64", "assets/img/elf.png|0,64,64,64"]
            },
            shadow: {
                still: ["assets/img/elf.png|0,0,64,64|shadow", "assets/img/elf.png|64,0,64,64|shadow", "assets/img/elf.png|0,64,64,64|shadow"]
            }
        }
    };
    DOK.SpriteSheet.preLoad(images);

    var definedItems = images.items;

    var orientations = ['front', 'right', 'back', 'left'];
    var biOrientations = ['front', 'back'];
    function getOrientation(angle, bi) {
        var orient = bi ? biOrientations : orientations;
        var angleSplit = Math.PI * 2 / orient.length;
        var index = Math.round(angle / angleSplit) % orient.length;
        if (index < 0) {
            index += orient.length;
        }
        return orient[index];
    }

    var spriteRenderer = new DOK.SpriteRenderer();

    var range = 20;

    function random(x, y, n) {
        var r = Math.PI * (x * 13 ^ y * 11 ^ n);
        return r - Math.floor(r);
    }

    var CellType = {
        wall: 1,
        water: 2,
        ground: 3,
        ice: 4
    };

    var ObjectType = {
        none: 0,
        squid: 1,
        picture_frame: 2,
        door: 3,
        item: 4,
        elf: 5
    };

    var gameData = {
        map: {
            cells: {},
            objects: {},
            data: {}
        }
    };

    DOK.Loader.loadFile('map.json', function (result) {
        gameData = JSON.parse(result);
        gameData.map = gameData.map || {};
        gameData.map.cells = gameData.map.cells || {};
        gameData.map.objects = gameData.map.objects || {};
        gameData.map.data = gameData.map.data || {};
    });

    function saveGame(gameData) {
        //        console.log(JSON.stringify(gameData));
        var url = "php/save.php?file=../map.json";
        var request = new XMLHttpRequest();
        var params = JSON.stringify(gameData);
        request.open("POST", url, true);

        request.setRequestHeader("Content-type", "application/json; charset=utf-8");

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                //                alert(request.responseText);
            }
        };
        request.send(params);
    }

    function getCellType(x, y) {
        x = Math.round(x);y = Math.round(y);
        if (gameData.map.cells[x + "_" + y] !== undefined) {
            return gameData.map.cells[x + "_" + y];
        }

        var hasCell = random(x, y, 0) < .6 || random(y / 3 | 0, x / 3 | 0, 1) < .1;
        var hasWater = x % 10 === 5 || y % 20 === 10;
        if (!hasCell) {
            return CellType.wall;
        } else if (hasWater) {
            return CellType.water;
        } else {
            return CellType.ground;
        }
    }

    function setCellType(x, y, value) {
        gameData.map.cells[x + "_" + y] = value;
        saveGame(gameData);
    }

    function getObjectType(x, y) {
        x = Math.round(x);y = Math.round(y);
        if (gameData.map.objects[x + "_" + y] !== undefined) {
            return gameData.map.objects[x + "_" + y];
        }

        var hasCreature = random(x, y, 3) < .05;
        if (hasCreature) {
            return ObjectType.squid;
        } else {
            return ObjectType.none;
        }
    }

    var objectTypeOverlay = {};
    function getDynamicObjectType(x, y) {
        if (objectTypeOverlay[x + "_" + y] !== undefined) {
            return objectTypeOverlay[x + "_" + y];
        }
        return getObjectType(x, y);
    }

    function setDynamicObjectType(x, y, value) {
        objectTypeOverlay[x + "_" + y] = value;
    }

    function setObjectType(x, y, value) {
        if (value === ObjectType.none) {
            setItem(x, y, 0);
        }
        gameData.map.objects[x + "_" + y] = value;
        saveGame(gameData);
    }

    var noData = { message: "", item: 0 };
    function getData(x, y) {
        x = Math.round(x);y = Math.round(y);
        return gameData.map.data[x + "_" + y] || noData;
    }

    function setMessage(x, y, value) {
        gameData.map.data[x + "_" + y] = gameData.map.data[x + "_" + y] || { message: "", item: 0 };
        gameData.map.data[x + "_" + y].message = value;
        saveGame(gameData);
    }

    function setItem(x, y, value) {
        setObjectType(x, y, ObjectType.item);
        gameData.map.data[x + "_" + y] = gameData.map.data[x + "_" + y] || {};
        gameData.map.data[x + "_" + y].item = value;
        saveGame(gameData);
    }

    var answered = 0;
    var dialogState = {};
    var variable;
    var shownText = null;
    function showText(txt) {
        if (shownText !== txt) {
            var show = txt && txt.length;
            var dlg = document.getElementById('dlg');
            if (show && dlg.style.display === 'none') {
                dlg.style.display = '';
            } else if (!show && dlg.style.display !== 'none') {
                dlg.style.display = 'none';
            }
            document.getElementById('msg').innerText = txt;
            shownText = txt;
        }
    }

    function showPrompter(prompter) {
        if (prompter && prompter.length) {
            if (answerbox.style.display === 'none') {
                answerbox.style.display = 'flex';
                variable = prompter.split(":")[0];
                prompter = prompter.split(":")[1];

                var answers = prompter.split("/");
                setAnswer('a1', answers[0]);
                setAnswer('a2', answers[1]);
                setAnswer('a3', answers[2]);
                answer = null;
                answered = 0;

                document.getElementById('a1').style.backgroundColor = '';
                document.getElementById('a2').style.backgroundColor = '';
                document.getElementById('a3').style.backgroundColor = '';
                document.getElementById('a1').style.color = '';
                document.getElementById('a2').style.color = '';
                document.getElementById('a3').style.color = '';
                document.getElementById('a1').style.pointerEvents = '';
                document.getElementById('a2').style.pointerEvents = '';
                document.getElementById('a3').style.pointerEvents = '';
            }
            if (answered && DOK.Loop.time - answered > 500) {
                resetDialog(false);
            }
        } else {
            if (answerbox.style.display !== 'none') {
                answerbox.style.display = 'none';
            }
        }
    }

    function performAction(action) {
        if (action.indexOf("/") >= 0) {
            action.split("/").forEach(performAction);
            return;
        }

        if (action.charAt(0) === '-') {
            removeItem(action.substr(1));
            return;
        } else if (action.charAt(0) === '+') {
            addItem(action.substr(1));
            return;
        }

        var left = action.split(":")[0];
        var forwardCell = getForwardCell();
        var x = forwardCell.x;
        var y = forwardCell.z;
        switch (left) {
            case "bye":
                setDynamicObjectType(x, y, ObjectType.none);
                break;
        }
    }

    function tap(elem) {
        document.getElementById('a1').style.backgroundColor = '';
        document.getElementById('a2').style.backgroundColor = '';
        document.getElementById('a3').style.backgroundColor = '';
        document.getElementById('a1').style.color = '';
        document.getElementById('a2').style.color = '';
        document.getElementById('a3').style.color = '';
        elem.style.backgroundColor = 'blue';
        elem.style.color = 'white';
    }

    function untap(elem) {
        elem.style.backgroundColor = 'green';
        elem.style.color = 'white';
        answered = DOK.Loop.time;
        dialogState[variable] = elem.id.charAt(1);
        //        answer = elem.innerText;
        document.getElementById('a1').style.pointerEvents = 'none';
        document.getElementById('a2').style.pointerEvents = 'none';
        document.getElementById('a3').style.pointerEvents = 'none';
    }

    function getAnswer() {
        if (answered && DOK.Loop.time - answered < 500) {
            return answer;
        }
        return null;
    }

    function setAnswer(id, value) {
        var elem = document.getElementById(id);
        if (!value && elem.style.display !== 'none') {
            elem.style.display = 'none';
        } else if (value) {
            if (elem.style.display === 'none') elem.style.display = '';
            elem.innerText = value;
        }
    }

    function checkCondition(txt) {
        var conditions = txt.split("||");
        if (conditions.length > 1) {
            return conditions.some(checkCondition);
        }

        conditions = txt.split("&&");
        if (conditions.length > 1) {
            return conditions.every(checkCondition);
        }

        if (txt.charAt(0) === '!') {
            return !checkCondition(txt.substr(1));
        }

        var forwardCell = getForwardCell();

        var objLeft = txt.split(".")[0];
        var objRight = txt.split(".")[1];
        switch (objLeft) {
            case "bye":
                return getDynamicObjectType(forwardCell.x, forwardCell.z) === ObjectType.none;
                break;
            case "inventory":
                return inventory[objRight];
                break;
            case "unlocked":
                return unlocked[forwardCell.x + "_" + forwardCell.z];
                break;
            case "var":
                if (objRight.indexOf("=") < 0) {
                    return dialogState[objRight];
                }
                var left = objRight.split("=")[0];
                var right = objRight.split("=")[1];
                if (right.length === 0) {
                    return !dialogState[left];
                }
                return dialogState[left] === right;
                break;
        }
        return false;
    }

    var dialog = null;var dialogTime = 0,
        nullString = "",
        space20 = "                    ",
        prompter = null,
        promptProgress = 0,
        dialogAction = null;

    function setDialog(txt) {
        if (txt) {
            while (txt.indexOf("[?]") >= 0) {
                var condition = txt.split("[?]")[0];
                var rest = txt.split("[?]").slice(1).join("[?]");

                var trueValue = rest.split("[:]")[0];
                var falseValue = rest.split("[:]").slice(1).join("[:]");
                if (checkCondition(condition)) {
                    txt = trueValue;
                } else {
                    txt = falseValue;
                }
            }
            prompter = null;
            dialogAction = null;

            if (txt.indexOf('>') >= 0) {
                dialogAction = txt.split(">")[1];
                txt = txt.split(">")[0];
            }
            if (txt.indexOf('~') >= 0) {
                prompter = txt.split("~")[1];
                txt = txt.split("~")[0];
            }
        }

        dialog = txt ? txt.split("/").join(space20 + "\n") : null;
        dialogTime = DOK.Loop.time;
        promptProgress = 0;
    }

    function getTextFromDialog() {
        var dt = (DOK.Loop.time - dialogTime) / 40 | 0;
        return dialog ? dialog.substr(0, dt) : nullString;
    }

    function getPrompterFromDialog() {
        var dt = (DOK.Loop.time - dialogTime) / 40 | 0;
        return prompter && dialog && dt > dialog.length + 10 ? prompter : nullString;
    }

    function getActionFromDialog() {
        var dt = (DOK.Loop.time - dialogTime) / 40 | 0;
        return dialogAction && dialog && dt > dialog.length + 10 ? dialogAction : nullString;
    }

    DOK.Loop.addLoop(function () {
        showText(getTextFromDialog());
        showPrompter(getPrompterFromDialog());
        performAction(getActionFromDialog());
    });

    var margin = .4;
    function canGo(x, y) {
        x = x / 256;
        y = y / 256;
        return !blocked(x - margin, y - margin) && !blocked(x + margin, y - margin) && !blocked(x - margin, y + margin) && !blocked(x + margin, y + margin);
    }

    var colliders = [ObjectType.elf];

    function blocked(x, y) {
        x = Math.round(x);y = Math.round(y);
        var block = getCellType(x, y) === CellType.wall || colliders.indexOf(getDynamicObjectType(x, y)) >= 0;

        if (block && getDynamicObjectType(x, y) === ObjectType.door) {
            if (!unlocked[x + "_" + y]) {
                if (inventory.key) {
                    removeItem('key');
                    unlocked[x + "_" + y] = DOK.Loop.time;
                }
            }
            return !unlocked[x + "_" + y] || DOK.Loop.time - unlocked[x + "_" + y] < unlockTime;
        } else if (block && colliders.indexOf(getDynamicObjectType(x, y)) >= 0) {
            if (collisionPending) {
                return true;
            }
            //            setDialog("Hello, would you like to pass?|What is the magic word?");
            collisionPending = true;
        }

        return block;
    }

    var collisionPending = false;

    var unlockTime = 400;

    var unlocked = {};

    var overallLight = .7;
    var cells = [];
    var collection = new DOK.Collection({
        type: "grid",
        get x() {
            return -Math.floor(range / 2 - camera.position.x / 256);
        },
        get y() {
            return -Math.floor(range / 2 - camera.position.z / 256);
        },
        width: range,
        height: range
    }, function (x, y) {
        //console.log(x,y);
        cells.length = 0;
        var cellType = getCellType(x, y);
        var objectType = getDynamicObjectType(x, y);
        var size = 257;
        var cycle = random(x, y, 100) * 1000 | 0;
        var timeCycle = cycle + DOK.Loop.time / 100 | 0;

        var forwardCell = getForwardCell();
        var light = overallLight;
        if (forwardCell.x === x && forwardCell.z === y) {
            //                light = .7;
        }

        if (cellType === CellType.water) {
            cells.push(DOK.SpriteObject.create(x * 256, -64 - 20, y * 256, size, size, DOK.Camera.quaternions.groundQuaternionArray, DOK.SpriteSheet.spritesheet.water.getFrame(cycle), light, 0));
        } else if (cellType === CellType.ice) {
            cells.push(DOK.SpriteObject.create(x * 256, -64, y * 256, size, size, DOK.Camera.quaternions.groundQuaternionArray, DOK.SpriteSheet.spritesheet.ice.getFrame(cycle), light * 2, 0));
        } else if (cellType === CellType.ground) {
            cells.push(DOK.SpriteObject.create(x * 256, -64, y * 256, size, size, DOK.Camera.quaternions.groundQuaternionArray, DOK.SpriteSheet.spritesheet.floor.getFrame(cycle), light, 0));
        } else {
            if (!unlocked[x + "_" + y] || DOK.Loop.time - unlocked[x + "_" + y] < unlockTime) {

                var shiftDown = unlocked[x + "_" + y] ? (DOK.Loop.time - unlocked[x + "_" + y]) * 256 / unlockTime : 0;

                cells.push(DOK.SpriteObject.create(x * 256, -64 + 128 - shiftDown, y * 256 + 128, size, size, DOK.Camera.quaternions.southQuaternionArray, light, DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)));
                cells.push(DOK.SpriteObject.create(x * 256, -64 + 128 - shiftDown, y * 256 - 128, size, size, DOK.Camera.quaternions.northQuaternionArray, light, DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)));
                cells.push(DOK.SpriteObject.create(x * 256 - 128, -64 + 128 - shiftDown, y * 256, size, size, DOK.Camera.quaternions.westQuaternionArray, light, DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)));
                cells.push(DOK.SpriteObject.create(x * 256 + 128, -64 + 128 - shiftDown, y * 256, size, size, DOK.Camera.quaternions.eastQuaternionArray, light, DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)));
                cells.push(DOK.SpriteObject.create(x * 256, -64 + 256 - shiftDown, y * 256, size, size, DOK.Camera.quaternions.groundQuaternionArray, light, DOK.SpriteSheet.spritesheet.wall.getFrame(cycle)));
            }
        }

        var overlaySprite = null;
        var sizeX, sizeY;
        var yOffset;

        if (objectType === ObjectType.picture_frame) {
            overlaySprite = DOK.SpriteSheet.spritesheet.picture_frame.getFrame(cycle);
            sizeX = 200;sizeY = 150;
            yOffset = 128;
        } else if (objectType === ObjectType.door) {
            if (!unlocked[x + "_" + y] || DOK.Loop.time - unlocked[x + "_" + y] < unlockTime) {

                var shiftDown = unlocked[x + "_" + y] ? (DOK.Loop.time - unlocked[x + "_" + y]) * 256 / unlockTime : 0;

                overlaySprite = DOK.SpriteSheet.spritesheet.door.getFrame(cycle);
                sizeX = 150;sizeY = 250;
                yOffset = 128 - shiftDown;
            }
        }

        if (overlaySprite) {
            cells.push(DOK.SpriteObject.create(x * 256, -64 + yOffset, y * 256 + 128 + 1, sizeX, sizeY, DOK.Camera.quaternions.southQuaternionArray, overlaySprite, light, 0));
            cells.push(DOK.SpriteObject.create(x * 256, -64 + yOffset, y * 256 - 128 - 1, sizeX, sizeY, DOK.Camera.quaternions.northQuaternionArray, overlaySprite, light, 0));
            cells.push(DOK.SpriteObject.create(x * 256 - 128 - 1, -64 + yOffset, y * 256, sizeX, sizeY, DOK.Camera.quaternions.westQuaternionArray, overlaySprite, light, 0));
            cells.push(DOK.SpriteObject.create(x * 256 + 128 + 1, -64 + yOffset, y * 256, sizeX, sizeY, DOK.Camera.quaternions.eastQuaternionArray, overlaySprite, light, 0));
        }

        if (objectType === ObjectType.squid) {
            cells.push(DOK.SpriteObject.create(x * 256, -64 + 128, y * 256, size, size, null, DOK.SpriteSheet.spritesheet.squid.normal.getFrame(timeCycle), light, 0));
            cells.push(DOK.SpriteObject.create(x * 256, -64 + 1, y * 256, size, size, DOK.Camera.shadowQuatArray(x * 256, y * 256), DOK.SpriteSheet.spritesheet.squid.shadow.getFrame(timeCycle), overallLight, 0));
        } else if (objectType === ObjectType.elf) {
            cells.push(DOK.SpriteObject.create(x * 256, -64 + 128 - 100, y * 256, size / 4, size / 4, null, DOK.SpriteSheet.spritesheet.elf.normal.still.getFrame(timeCycle), light * 2, 0));
            cells.push(DOK.SpriteObject.create(x * 256, -64 + 1, y * 256, size / 4, size / 4, DOK.Camera.shadowQuatArray(x * 256, y * 256), DOK.SpriteSheet.spritesheet.elf.shadow.still.getFrame(timeCycle), overallLight, 0));
        } else if (objectType === ObjectType.item) {
            if (hasItem(x, y)) {
                var item = getData(x, y).item;
                cells.push(DOK.SpriteObject.create(x * 256, -64 + 128 - 100, y * 256, 50, 50, null, DOK.SpriteSheet.spritesheet.items[item].getFrame(timeCycle), light, 0));
            }
        }

        return cells;
    });

    var bunnyOverlay = {
        state: 'still',
        direction: 'left',
        orientation: orientations[0],
        position: new THREE.Vector3(),
        predx: 0, predz: 0,
        cycle: 0,
        moving: false,
        get sprite() {
            return DOK.SpriteObject.create(this.position.x, this.position.y - 35, this.position.z, 30, 30, null, DOK.SpriteSheet.spritesheet.bunny.normal[this.state][this.direction].getFrame(this.cycle), pLight, 0);
        },
        get shadow() {
            return DOK.SpriteObject.create(this.position.x, this.position.y - 40, this.position.z, 30, 30, DOK.Camera.shadowQuatArray(this.position.x, this.position.z), DOK.SpriteSheet.spritesheet.bunny.shadow[this.state][this.direction].getFrame(this.cycle), pLight, 0);
        },
        loop: function loop() {
            moveVector.copy(DOK.Camera.getCameraQuaternionData().forwardMovement);
            moveVector.setLength(-100);
            moveVector.add(penguinOverlay.position);

            var dx = (moveVector.x - this.position.x) * .05;
            var dz = (moveVector.z - this.position.z) * .05;
            var dist = dx * dx + dz * dz;
            if (dist > 100) {
                this.moving = true;
            } else if (dist < .5) {
                this.moving = false;
            }

            if (this.moving) {
                this.position.x += dx;
                this.position.z += dz;
                this.predx = dx;this.predz = dz;
            }
            this.cycle = !this.moving ? DOK.Loop.time / 2000 | 0 : DOK.Loop.time / 100 | 0;
            var orientation = !this.moving ? getOrientation(Math.atan2(this.predx, this.predz) - rotA) : getOrientation(Math.atan2(dx, dz) - rotA);
            this.state = !this.moving ? 'still' : 'walk';
            this.direction = orientation === "front" ? "left" : orientation === "back" ? "right" : orientation;
            ///            return false;
        }
    };
    trigger(bunnyOverlay);

    var bigfaceOverlay = {
        state: 'still',
        position: new THREE.Vector3(),
        predx: 0, predz: 0,
        cycle: 0,
        moving: false,
        get sprite() {
            return DOK.SpriteObject.create(this.position.x, this.position.y - 35, this.position.z, 70, 70, null, DOK.SpriteSheet.spritesheet.bigface.normal[this.state].getFrame(this.cycle), pLight, 0);
        },
        get shadow() {
            return DOK.SpriteObject.create(this.position.x, this.position.y - 40, this.position.z, 70, 70, DOK.Camera.shadowQuatArray(this.position.x, this.position.z), DOK.SpriteSheet.spritesheet.bigface.shadow[this.state].getFrame(this.cycle), pLight, 0);
        },
        loop: function loop() {
            var dx = (bunnyOverlay.position.x + 100 - this.position.x) * .02;
            var dz = (bunnyOverlay.position.z + 100 - this.position.z) * .02;
            var dist = dx * dx + dz * dz;
            if (dist > 10) {
                this.moving = true;
            } else if (dist < .5) {
                this.moving = false;
            }

            if (this.moving) {
                this.position.x += dx;
                this.position.z += dz;
                this.predx = dx;this.predz = dz;
            }
            this.cycle = !this.moving ? DOK.Loop.time / 2000 | 0 : DOK.Loop.time / 100 | 0;
            this.state = !this.moving ? 'still' : 'walk';
            ///            return false;
        }
    };
    trigger(bigfaceOverlay);

    var pLight = 1.8;
    var penguinOverlay = {
        predx: 0, predz: 0,
        orientation: orientations[0],
        position: new THREE.Vector3(),
        cycle: 0,
        get sprite() {
            var act = currentCellType === CellType.water ? 'swim' : currentCellType === CellType.ice ? 'slide' : 'normal';
            return DOK.SpriteObject.create(this.position.x, this.position.y - 35, this.position.z, 30, 30, null, DOK.SpriteSheet.spritesheet.penguin[act][this.orientation].getFrame(this.cycle), pLight, 0);
        },
        get shadow() {
            return currentCellType === CellType.water ? null : DOK.SpriteObject.create(this.position.x, this.position.y - 40, this.position.z, 30, 30, DOK.Camera.shadowQuatArray(this.position.x, this.position.z), DOK.SpriteSheet.spritesheet.penguin.shadow[this.orientation].getFrame(this.cycle), pLight, 0);
        },
        loop: function loop() {
            moveVector.copy(DOK.Camera.getCameraQuaternionData().forwardMovement);
            moveVector.setLength(-80);
            moveVector.add(camera.position);
            //            moveVector.x += debug.a;
            //            moveVector.z += debug.c;

            var dx = (moveVector.x - this.position.x) * .8;
            var dz = (moveVector.z - this.position.z) * .8;
            var dist = dx * dx + dz * dz;
            var s = .01;
            this.cycle = dist < s ? 0 : DOK.Loop.time / 100 | 0;
            var oldX = Math.round(this.position.x / 256);
            var oldZ = Math.round(this.position.z / 256);
            this.position.x += dx;
            this.position.z += dz;
            this.orientation = dist < s ? getOrientation(Math.atan2(this.predx, this.predz) - rotA, true) : getOrientation(Math.atan2(dx, dz) - rotA);
            this.predx = dx;this.predz = dz;
            if (Math.round(this.position.x / 256) !== oldX || Math.round(this.position.z / 256) !== oldZ) {
                cellChanged(Math.round(this.position.x / 256), Math.round(this.position.z / 256));
            }
            ///            return false;
        }
    };
    trigger(penguinOverlay);

    var currentCellType = null;
    function cellChanged(x, y) {
        if (hasItem(x, y)) {
            var item = getData(x, y).item;
            pickItem(x, y);
            //            console.log(x,y,item);
            var itemText = itemsText[item];
            addItem(itemText);
        }
        currentCellType = getCellType(x, y);
    }

    function addItem(item, count) {
        if (count === undefined) {
            count = 1;
        }
        inventory[item] = (inventory[item] || 0) + count;
        updateInventory();
    }

    function removeItem(item, count) {
        if (count === undefined) {
            count = 1;
        }
        if (inventory[item]) {
            inventory[item] -= count;
        }
        if (inventory[item] <= 0) {
            delete inventory[item];
        }
        updateInventory();
    }

    function updateInventory() {
        var inv = document.getElementById('inventory');
        var str = [];
        for (var a in inventory) {
            str.push(a + (inventory[a] > 1 ? ": " + inventory[a] : ""));
        }
        inv.innerText = str.join("<br>\n");
    }

    var inventory = {};

    var itemsText = ["key", "carrot", "ice cream", "candle", "fish"];

    var pickedItems = {};

    function hasItem(x, y) {
        return !pickedItems[x + "_" + y] && getDynamicObjectType(x, y) === ObjectType.item;
    }

    function pickItem(x, y) {
        var item = getData(x, y).item;
        pickedItems[x + "_" + y] = DOK.Loop.time;
        setDialog("+ " + itemsText[item]);
    }

    function initialize() {
        document.body.appendChild(engine.renderer.domElement);
        DOK.Loader.getLoadingBar();
        //        DOK.Loader.setOnLoad(gameLoaded);
        setTimeout(gameLoaded, 1000);
    }

    function gameLoaded() {
        document.body.removeChild(DOK.Loader.getLoadingBar());
        startGame();
    }

    var camera = DOK.Camera.getCamera();
    var mz = 0,
        rot = 0,
        rotA = 0,
        buttonDown = false;
    DOK.Mouse.setOnTouch(function (dx, dy, down) {
        if (dx !== null) {
            rot = THREE.Math.clamp(rot + dx / 200, -10, 10);
        }
        if (dy !== null) {
            mz = THREE.Math.clamp(mz - dy / 2, -50, 20);
        }
        buttonDown = down;
    });

    var forwardCellVector, fcDirty;
    function getForwardCell() {
        if (!forwardCellVector) {
            forwardCellVector = new THREE.Vector3();
            fcDirty = true;
        }
        if (fcDirty) {
            forwardCellVector.copy(DOK.Camera.getCameraQuaternionData().forwardMovement);
            forwardCellVector.setLength(-200);
            forwardCellVector.add(camera.position);
            forwardCellVector.x = Math.round(forwardCellVector.x / 256);
            forwardCellVector.z = Math.round(forwardCellVector.z / 256);
            fcDirty = false;
        }
        return forwardCellVector;
    }

    function onChangeForwardCell() {
        resetDialog(true);

        if (DOK.Loop.time - lastThrow > 1000) {
            var forwardCell = getForwardCell();
            var objType = getObjectType(forwardCell.x, forwardCell.z);
            if (objType === ObjectType.squid) {
                throwEgg(forwardCell.x, forwardCell.z);
            }
        }
    }

    function resetDialog(clearState) {
        var dlg = getData(getForwardCell().x, getForwardCell().z).message;
        setDialog(dlg);
        if (clearState) {
            dialogState = {};
        }
    }

    var creatures = [ObjectType.none, ObjectType.squid, ObjectType.elf];

    var cellTypes = [CellType.ground, CellType.wall, CellType.water, CellType.ice];
    document.addEventListener("keydown", function (e) {
        var forwardCell = getForwardCell();
        switch (e.keyCode) {
            case 32:
                console.log(getCellType(forwardCell.x, forwardCell.z), getObjectType(forwardCell.x, forwardCell.z));
                break;
            case 67:
                var objType = getObjectType(forwardCell.x, forwardCell.z);
                if (creatures.indexOf(objType) >= 0) {
                    objType = creatures[(creatures.indexOf(objType) + 1) % creatures.length];
                } else {
                    objType = ObjectType.none;
                }
                setObjectType(forwardCell.x, forwardCell.z, objType);
                break;
            case 79:
                var objType = getObjectType(forwardCell.x, forwardCell.z);
                setObjectType(forwardCell.x, forwardCell.z, objType === ObjectType.picture_frame ? ObjectType.none : ObjectType.picture_frame);
                break;
            case 49:
                var cellType = getCellType(forwardCell.x, forwardCell.z);
                if (cellTypes.indexOf(cellType) >= 0) {
                    cellType = cellTypes[(cellTypes.indexOf(cellType) + 1) % cellTypes.length];
                } else {
                    cellType = CellType.ground;
                }
                setCellType(forwardCell.x, forwardCell.z, cellType);
                break;
            case 71:
                var objType = getObjectType(forwardCell.x, forwardCell.z);
                setObjectType(forwardCell.x, forwardCell.z, objType === ObjectType.door ? ObjectType.none : ObjectType.door);
                break;
            case 73:
                var objType = getObjectType(forwardCell.x, forwardCell.z);
                if (objType !== ObjectType.item) {
                    setItem(forwardCell.x, forwardCell.z, 0);
                } else {
                    if (pickedItems[forwardCell.x + "_" + forwardCell.z]) {
                        delete pickedItems[forwardCell.x + "_" + forwardCell.z];
                    } else {
                        var item = getData(forwardCell.x, forwardCell.z).item;
                        if (item + 1 < definedItems.length) {
                            setItem(forwardCell.x, forwardCell.z, item + 1);
                        } else {
                            setObjectType(forwardCell.x, forwardCell.z, ObjectType.none);
                        }
                    }
                }
                break;
            case 13:
                var message = getData(forwardCell.x, forwardCell.z).message;
                message = prompt(message.split("/").join("\n/"), message);
                if (message !== null) {
                    setMessage(forwardCell.x, forwardCell.z, message);
                }
                break;
            case 191:
                //  ?
                if (e.shiftKey) {
                    console.log(getCellType(forwardCell.x, forwardCell.z), getObjectType(forwardCell.x, forwardCell.z), getData(forwardCell.x, forwardCell.z));
                }
                break;
        }
    });

    function throwEgg(x, y) {
        egg.visible = true;
        egg.position.copy(penguinOverlay.position);
        egg.position.y = -30;
        eggMove.x = x * 256 - egg.position.x;
        eggMove.z = y * 256 - egg.position.z;
        //        eggMove.copy(DOK.Camera.getCameraQuaternionData().forwardMovement);
        //        eggMove.negate();
        eggMove.setLength(20);
        eggMove.y = 15;
        egg.position.add(eggMove);
        lastThrow = DOK.Loop.time;
    }

    DOK.SpriteRenderer.setIndexProcessor(function (images, count) {
        for (var i = 0; i < count; i++) {
            images[i].zIndex += -Math.abs(images[i].position.y) * 10;
        }
    });

    function processImageIndex(image) {
        image.zIndex -= Math.abs(image.position.y) * 10;
    }

    var geometry = new THREE.SphereGeometry(3, 20, 20, 0, Math.PI * 2, 0, Math.PI * 2);
    //    var material = new THREE.MeshNormalMaterial();
    var material = new THREE.MeshLambertMaterial();
    var egg = new THREE.Mesh(geometry, material);
    egg.position.set(0, -50, 0);
    egg.geometry.scale(3, 3, 3);
    engine.scene.add(egg);
    var light = new THREE.AmbientLight(0xcccccc); // soft white light
    engine.scene.add(light);
    var light2 = new THREE.PointLight(0xffffff, 1, 0, 5);
    light2.position.set(-50, 250, 50);
    engine.scene.add(light2);
    egg.visible = false;

    function startGame() {
        DOK.fps = 45;
        var frame = 0;
        DOK.Loop.addLoop(function () {
            frame++;
            if (debug.fps && frame % 10 === 0) document.getElementById("fps").textContent = DOK.Loop.fps + " fps";
        });
        DOK.Loop.addLoop(function () {
            if (egg.visible) {
                egg.position.add(eggMove);
                eggMove.y -= 2;
            }
            if (DOK.Loop.time - lastThrow > 1000) {
                var forwardCell = getForwardCell();
                var objType = getObjectType(forwardCell.x, forwardCell.z);
                if (objType === ObjectType.squid) {
                    throwEgg(forwardCell.x, forwardCell.z);
                } else {
                    egg.visible = false;
                }
            }
        });

        var lastMoveVector = new THREE.Vector3();
        DOK.Loop.addLoop(function () {
            if (debug.control) return;
            var oldForwardX = getForwardCell().x;
            var oldForwardZ = getForwardCell().z;
            var camera = DOK.Camera.getCamera();
            var mov = DOK.Keyboard.getMove();
            rot = THREE.Math.clamp(rot - mov[0] * .05, -10, 10);
            mz = THREE.Math.clamp(mz - mov[1], -50, 20);
            if (currentCellType === CellType.water) {
                mz *= .75;
            }

            moveVector.copy(DOK.Camera.getCameraQuaternionData().forwardMovement);
            if (Math.abs(mz) > 0) {
                mz *= .9;
            } else {
                mz = 0;
            }
            moveVector.setLength(mz);

            if (currentCellType === CellType.ice) {
                moveVector.add(lastMoveVector);
            } else {
                lastMoveVector.copy(moveVector);
            }

            if (Math.abs(rot) > .01) {
                rotA = (rotA + rot) % (Math.PI * 2);
                rot *= .5;
            }

            camera.quaternion.setFromAxisAngle(forwardVector, rotA);
            var canGoX = canGo(camera.position.x + moveVector.x, camera.position.z);
            var canGoZ = canGo(camera.position.x, camera.position.z + moveVector.z);
            var canGoXZ = canGo(camera.position.x + moveVector.x, camera.position.z + moveVector.z);

            if (canGoX && canGoZ && canGoXZ) {} else if (canGoX) {
                moveVector.z = 0;
            } else if (canGoZ) {
                moveVector.x = 0;
            } else {
                moveVector.x = 0;
                moveVector.z = 0;
            }
            camera.position.add(moveVector);
            fcDirty = true;
            if (getForwardCell().x !== oldForwardX || getForwardCell().z !== oldForwardZ) {
                onChangeForwardCell();
            }
        });

        DOK.Loop.addLoop(function () {
            collection.forEach(spriteRenderer.display);
            spriteRenderer.display(penguinOverlay.sprite);
            spriteRenderer.display(penguinOverlay.shadow);
            spriteRenderer.display(bunnyOverlay.sprite);
            spriteRenderer.display(bunnyOverlay.shadow);
            spriteRenderer.display(bigfaceOverlay.sprite);
            spriteRenderer.display(bigfaceOverlay.shadow);
            spriteRenderer.updateGraphics();
        });
    }

    //    document.addEventListener("DOMContentLoaded",initialize);
    setTimeout(initialize, 100);
    window.col = collection;
});
//# sourceMappingURL=main.js.map