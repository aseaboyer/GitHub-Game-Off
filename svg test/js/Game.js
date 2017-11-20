function Game (gameElement, turnSpeed) {
    var obj = {},
        now = Date.now (),
        scoreGUI = document.getElementById ("score-count");
    
    obj.loadSVG = function (fileName) {
        var request = new XMLHttpRequest();
        request.open("GET", fileName);
        request.setRequestHeader("Content-Type", "image/svg+xml");
        request.addEventListener("load", function(event) {
            var response = event.target.responseText;
            console.log ("response!");
            console.log (response);
            
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
            
        });
        request.send();
    };
    
    obj.sounds = new SoundController ();
    
    obj.paused = false;
    obj.gameElement = gameElement;
    obj.scoreDisplay = document.getElementById ("score-count");
    
    obj.init = function () {
        this.turn.current = 0;
        
        this.rabbits.buildTiles ("rabbit-tile");
        this.whiskey.buildTiles ("whiskey-tile");
        this.hunters.buildTiles ("hunter-tile");
        
        this.rabbits.init (0);
        this.whiskey.init (0);
    };
    obj.update = function () {
        this.turn.update ();
        this.rabbits.update (this.turn.current);
        this.whiskey.update (this.turn.current);
        
        // if the bottle is in play
        if (this.whiskey.bottle !== null) {
            if (player.position.x === this.whiskey.bottle.position.x &&
                player.position.y === this.whiskey.bottle.position.y) {
                // compare bear and bottle positions
                //console.log ("Bear on bottle!");
                this.whiskey.removeBottle (this.turn.current);
            }
        }
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
    
    /*obj.currentScore = {};
    obj.score = 0;
    obj.getScoreValue = function (scoreType) {
        if (scoreType === "rabbit") {
            return 10;
        } else if (scoreType === "hunter") {
            return 100;
        }
        return 0;
    };*/
    
    obj.points = {
        current: 0,
        guiText: scoreGUI,
        pointValues: gameData.points,
        score: function (type, ) {
            // find the value
            var pointObj = null;
            // console.log ("Trying to score pts for: " + type);
            for (var i = 0; i < this.pointValues.length; i++) {
                if (this.pointValues [i].type == type) {
                    pointObj = this.pointValues [i];
                }
            }
            
            // update the value and field
            this.current += pointObj.value;
            this.guiText.innerHTML = this.current
        }
    };
    obj.scorePoints = function (type) {
        // Search through points from the data
        this.points.score (type);
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
        removeAll: function (turnNumber) {
            for (var i = 0; i < this.hunters.length; i++) {
                this.hunters [i].perish ();
                game.scorePoints ("hunter");
            }
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
        findRabbitId: function (x, y) {
            for (var i = 0; i < this.rabbits.length; i++) {
                if (this.rabbits [i].position.x == x &&
                    this.rabbits [i].position.y == y) {
                    return i;
                }
            }
            
            return null;
        },
        removeRabbitById: function (id) {
            this.rabbits [id].perish ("bear");
            this.rabbits.splice (id, 1);
        },
        removeRabbitAt: function (x, y) {
            // RM?
            var tile = this.findTile (x,y);
            if (tile != null) {
                this.removeRabbit (tile);
            }
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
            
            // check if a rabbit exists here already!
            for (var i = 0; i < this.rabbits.length; i++) {
                var pos = this.rabbits [i].position;
                if (pos.x === x && pos.y === y) {
                    validStart = false;
                }
            }
            
            // don't spawn a rabbit on a bear
            if (player.position.x == x &&
               player.position.y == y) {
                validStart = false;
            }
            
            if (validStart) {
                var newRabbit = new Rabbit (x, y);
                return newRabbit;
            }
            
            // invalid - don't create
            return null;
        },
    };
    
    obj.whiskey = {
        data: gameData.whiskey,
        tiles: [],
        bottle: null,
        lastBottle: 0, // turn count
        nextSpawn: 0, // turn count
        init: function (turnNumber) {
            this.scheduleNext (0);
        },
        scheduleNext: function (turnNumber) {
            this.nextSpawn = turnNumber + this.data.frequency;
        },
        removeBottle: function (turn) {
            this.bottle.perish ();
            this.bottle = null;
            this.nextSpawn = turn + this.data.frequency;
            game.hunters.removeAll ();
            console.log ("RAWR!!!")
        },
        buildTiles: function (className) {
             var tiles = document.getElementsByClassName (className);
            //console.log (tiles);
            if (tiles.length > 0) {
                for (var i = 0; i < tiles.length; i++) {
                    var tile = tiles [i];
                    var newTile = new Tile ("whiskey", tile);
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
            if (this.bottle === null &&
                turnNumber >= this.nextSpawn) {
                var newBottle = this.spawn ();
                //console.log (newBottle);
                
                if (newBottle != null) {
                    this.scheduleNext (turnNumber);
                    var startTile = this.findTile (
                        newBottle.position.x,
                        newBottle.position.y
                    );
                    
                    if (startTile !== null) {
                        this.bottle = newBottle;
                        //newBottle.init (startTile);
                    } else {
                        console.log ("Couldn't find the bottle's tile");
                        console.log (newBottle.position);
                    }
                }
            }
        },
        spawn: function () {
            var start = randomInt (0, this.tiles.length);
            var tile = this.tiles [start];
            var x = tile.position.x,
                y = tile.position.y,
                validStart = true;
            
            //console.log (tile);
            
            // don't spawn a bottle on a bear
            if (player.position.x == x &&
               player.position.y == y) {
                validStart = false;
            }
            
            // don't spawn a bottle on a rabbit
            for (var i = 0; i < game.rabbits.length; i++) {
                var rabbit = game.rabbits.rabbits [i];
                console.log (rabbit)
                if (rabbit.position.x == x &&
                    rabbit.position.y ==y) {
                    validStart = false;
                }
            }
            
            if (validStart) {
                var newBottle = new Whiskey (tile);
                return newBottle;
            }
            
            // invalid - don't create
            return null;
        },
    };
    
    return obj;
}