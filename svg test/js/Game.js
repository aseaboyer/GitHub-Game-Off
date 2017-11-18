function Game (gameElement, turnSpeed) {
    var obj = {},
        now = Date.now ();
    
    obj.loadSVG = function (fileName) {
        var request = new XMLHttpRequest();
        request.open("GET", fileName);
        request.setRequestHeader("Content-Type", "image/svg+xml");
        request.addEventListener("load", function(event) {
            var response = event.target.responseText;
            console.log ("response!");
            console.log (response);
            /*
            var doc = new DOMParser();
            var xml = doc.parseFromString(response, "image/svg+xml");
            var rect = xml.getElementById("rect3336");
            rect.setAttribute("width", 1000);
            var result = response.slice(0, response.indexOf("<svg"));
            result += xml.documentElement.outerHTML;
            var a = document.createElement("a");
            a.download = "myImage.svg";
            a.href = "data:image/svg+xml," + encodeURIComponent(result);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            */
        });
        request.send();
    };
    
    obj.paused = false;
    obj.gameElement = gameElement;
    obj.scoreDisplay = document.getElementById ("score-count");
    
    obj.init = function () {
        this.turn.current = 0;
        
        this.rabbits.buildTiles ("rabbit-tile");
        this.hunters.buildTiles ("hunter-tile");
        
        this.rabbits.init (0);
    };
    obj.update = function () {
        this.turn.update ();
        this.rabbits.update (this.turn.current);
    };
    
    obj.turn = {
        current: 0,
        speed: turnSpeed,
        last: now,
        newTurn: false,
        update: function () {
            var now = Date.now ();
            //console.log (now >= this.last + this.speed);
            if (now >= this.last + this.speed) {
                this.current++;
                
                this.last = now;
                
                this.newTurn = true;
                
            }/* else {
                this.newTurn = false;
            }*/
            
        },
        resetNewTurn: function () {
            var now = Date.now ();
            this.newTurn = false;
            this.last = now;
        },
        increase: function () {
            this.current++;
            player.move ();
        }
    };
    
    obj.frame = {
        current: 0,
        frequency: 100,
        last: now,
        update: function () {
            this.current++;
            this.last = Date.now ();
        }
    };
    obj.colors = {
        player: "47,181,243",
        hunter: "252,130,195",
        rabbit: "225,200,41",
        whiskey: "0,0,0"
    };
    
    obj.currentScore = {};
    obj.score = 0;
    obj.getScoreValue = function (scoreType) {
        if (scoreType === "rabbit") {
            return 10;
        } else if (scoreType === "hunter") {
            return 100;
        }
        return 0;
    };
    
    obj.hunters = {
        data: gameData.hunters,
        tiles: [],
        hunters: [],
        lastHunter: 0, // turn count
        nextSpawn: 0, // turn count
        init: function (turnNumber) {
            this.scheduleNext (0);
        },
        scheduleNext: function (turnNumber) {
            this.nextSpawn = turnNumber + this.data.frequency;
        },
        buildTiles: function (className) {
             var tiles = document.getElementsByClassName (className);
            //console.log (tiles);
            if (tiles.length > 0) {
                for (var i = 0; i < tiles.length; i++) {
                    var tile = tiles [i];
                    var newTile = new Tile ("hunter", tile);
                    this.tiles.push (newTile);
                }
            }
        },
    };
    
    obj.rabbits = {
        data: gameData.rabbits,
        tiles: [],
        rabbits: [],
        lastRabbit: 0, // turn count
        nextSpawn: 0, // turn count
        init: function (turnNumber) {
            this.scheduleNext (0);
        },
        scheduleNext: function (turnNumber) {
            this.nextSpawn = turnNumber + this.data.frequency;
        },
        buildTiles: function (className) {
             var tiles = document.getElementsByClassName (className);
            //console.log (tiles);
            if (tiles.length > 0) {
                for (var i = 0; i < tiles.length; i++) {
                    var tile = tiles [i];
                    var newTile = new Tile ("rabbit", tile);
                    this.tiles.push (newTile);
                }
            }
        },
        findTile: function (x, y) {
            // iterate over list
            for (var i = 0; i < this.tiles.length; i++) {
                
                // find it
                if (this.tiles [i].comparePosition (x,y)) {
                    return this.tiles [i];
                }
                
            }
            
            return null;
        },
        update: function (turnNumber) {
            //console.log (turnNumber);
            if (turnNumber >= this.nextSpawn &&
               this.rabbits.length < this.data.maxCount) {
                var newRabbit = this.spawn ();
                
                if (newRabbit != null) {
                    this.scheduleNext (turnNumber);
                    var startTile = this.findTile (
                        newRabbit.position.x,
                        newRabbit.position.y
                    );
                    
                    if (startTile !== null) {
                        this.rabbits.push (newRabbit);
                        newRabbit.init (startTile);
                    } else {
                        console.log ("Couldn't find the rabbit's tile");
                        console.log (newRabbit.position);
                    }
                }
            }
        },
        spawn: function () {
            var start = randomInt (0, this.data.startPositions.length-1);
            var x = this.data.startPositions [start].x,
                y = this.data.startPositions [start].y,
                validStart = true;
            
            var newRabbit = new Rabbit (x, y);
            /*
            // should let update handle this, actually
            for (var i = 0; i < this.tiles.length; i++) {
                if (this.tiles [i].comparePosition (x, y)) {
                    this.tiles [i].changeState ("active");
                }
            }
            */
            
            // check if a rabbit exists here already!
            for (var i = 0; i < this.rabbits.length; i++) {
                var pos = this.rabbits [i].position;
                if (pos.x === x && pos.y === y) {
                    validStart = false;
                }
            }
            
            if (validStart) {
                return newRabbit;
            }
            
            // flunked out and didn't create
            return null;
        },
    };
    
    /*
    obj.spawnCoin = function () {
        var x = Math.floor(Math.random() * this.board.width),
            y = Math.floor(Math.random() * this.board.height);
    };
    
    obj.increaseScore = function () {
        this.currentScore++;
        this.scoreDisplay.innerHTML = this.currentScore;
        player.changeHealth (3);
    };
    
    obj.rabbits = new Array ();
    obj.hunters = new Array ();
    obj.spawnRabbit = function (num) {
        var x = Math.floor(Math.random() * this.board.width),
            y = Math.floor(Math.random() * this.board.height);
        this.rabbits.push (new Enemy (x, y));
    };
    obj.removeEnemy = function (num) {
        this.enemies.splice (num, 1);
        //this.spawnEnemy ();
    };
    
    obj.enemies = new Array ();
    obj.lastSpawnedEnemy = 0;
    obj.maxSpawnFrequency = 2000;
    obj.spawnEnemy = function () {
        var x = Math.floor(Math.random() * this.board.width),
            y = Math.floor(Math.random() * this.board.height);
        this.enemies.push (new Enemy (x, y));
        this.lastSpawnedEnemy = Date.now ();
    };
    obj.removeEnemy = function (num) {
        this.enemies.splice (num, 1);
        //this.spawnEnemy ();
    };
    
    document.body.dataset.killScreen = "false";
    obj.killScreen = false;
    obj.openKillScreen = function () {
        document.body.dataset.killScreen = "true";
        this.paused = true;
    };
    
    obj.restart = function () {
        location.reload ();
    };
    */
    return obj;
}