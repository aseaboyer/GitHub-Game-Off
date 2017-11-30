function Game (gameElement, turnSpeed) {
    var obj = {},
        now = Date.now (),
        scoreGUI = document.getElementById ("score-count");
    
    obj.state = {
        current: "start",
        change: function (newState) {
            this.current = newState;
            document.body.dataset.gameState = newState;
        }
    };
    
    obj.sounds = new SoundController ();
    
    obj.paused = false;
    obj.gameElement = gameElement;
    obj.scoreDisplay = document.getElementById ("score-count");
    
    obj.killHunterTarget = function (prey, rowNum) {
        if (prey != null && prey.type !== "none") {
            //console.log ("The hunter in row " + rowNum + " shot it's prey!");
            //console.log (prey);
            
            if (prey.type == "player") {
                //console.log ("The player loses a life!");
                player.health.remove ();
                game.sounds.request ("playerShot");
                
            } else if (prey.type == "rabbit") {
                //console.log ("Remove a rabbit!");
                this.rabbits.removeRabbitById (prey.id);
                game.sounds.request ("rabbitShot");
            }
        }
    }
    obj.findHunterTarget = function (rowNum) {
        var returned = {
            found: false,
            type: "none",
            object: null,
            row: -1
        };
        
        // check player
        if (player.position.x === rowNum) {
            returned = {
                found: true,
                type: "player",
                object: player,
                row: player.position.y
            };
        }
        
        // check all rabbits 
        for (var i = 0; i < this.rabbits.rabbits.length; i++) {
            if (this.rabbits.rabbits [i].position.x === rowNum
                && returned.row < this.rabbits.rabbits [i].position.y) {
                returned = {
                    found: true,
                    type: "rabbit",
                    object: this.rabbits.rabbits [i],
                    row: this.rabbits.rabbits [i].position.y,
                    id: i
                };
            }
        }
        
        return returned;
    };
    
    obj.init = function () {
        this.state.change ("start");
        this.turn.init ();
    };
    obj.update = function () {
        if (this.turn.delay) {
            console.log ("Game is delayed.");
            
        } else if (this.state.current == "playing") {
            if (document.body.classList.contains ("bottlePickup")) {
                document.body.classList.remove ("bottlePickup");
            }
            
            this.turn.update ();
            player.update (this.turn.current);
            this.rabbits.update (this.turn.current);
            this.whiskey.update (this.turn.current);
            this.hunters.update (this.turn.current);

            // if the bottle is in play
            if (this.whiskey.bottle !== null) {
                if (player.position.x === this.whiskey.bottle.position.x &&
                    player.position.y === this.whiskey.bottle.position.y) {
                    // compare bear and bottle positions
                    this.sounds.request ("drinkWhiskey");
                    this.whiskey.removeBottle (this.turn.current);
                }
            }

            this.sounds.update (this.turn.current);
        }
    };
    obj.start = function () { this.restart (); };
    obj.restart = function () {
        this.rabbits.buildTiles ("rabbit-tile");
        this.whiskey.buildTiles ("whiskey-tile");
        this.hunters.buildTiles ("hunter-tile");
        
        this.rabbits.init (0);
        this.whiskey.init (0);
        this.hunters.init (0);
        
        player.init ();
        this.points.reset ();
        this.turn.init ();
        
        this.state.change ("playing");
        this.sounds.request ("start");
    };
    
    obj.turn = {
        current: 0,
        speed: turnSpeed,
        last: now,
        newTurn: false,
        init: function () {
            this.current = 0;
            this.last = Date.now ();
        },
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
        },
        delay: false,
        startDelay: function () {
            
        },
        cancelDelay: function () {
            
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
        highScore: {
            value: 0,
            get: function () {
                var hs = localStorage.getItem("whiskeyBearHighScore");
                if (hs !== null) {
                    return hs;
                }
                return 0;
            },
            set: function (score) {
                localStorage.setItem('whiskeyBearHighScore', score);
            },
            save: function (newScore) {
                var highScore = this.get ();
                if (newScore > highScore) {
                    this.set (newScore);
                }
            }
        },
        score: function (type) {
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
            this.guiText.innerHTML = this.current;
        },
        reset: function () {
            this.current = 0;
            this.guiText.innerHTML = this.current;
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
            this.hunters.length = 0;
            this.scheduleNext (0);
        },
        update: function (turnNumber) {
            // update the hunters
            for (var i = 0; i < this.hunters.length; i++) {
                this.hunters [i].update (turnNumber);
            }
            
            // spawn a new hunter if it's time
            if (turnNumber >= this.nextSpawn &&
               this.hunters.length < this.data.maxCount) {
                var newHunter = this.spawn ();
                //console.log (newHunter);
                if (newHunter != null) {
                    this.scheduleNext (turnNumber);
                    this.hunters.push (newHunter);
                    game.sounds.request ("hunterSpawn");
                }
            }
        },
        spawn: function () {
            var start = randomInt (0, this.tiles.length-1);
            var x = this.tiles [start].position.x,
                y = this.tiles [start].position.y,
                validStart = true;
            
            // check if a hunter exists here already!
            for (var i = 0; i < this.hunters.length; i++) {
                var pos = this.hunters [i].position;
                //console.log (pos.row + "===" + y);
                if (pos.row === y) {
                    validStart = false;
                }
            }
            
            if (validStart) {
                var newHunter = new Hunter (this.tiles [start]);
                return newHunter;
            }
            
            // invalid - don't create
            return null;
        },
        removeAll: function (turnNumber) {
            for (var i = 0; i < this.hunters.length; i++) {
                game.scorePoints ("hunter");
                
                this.hunters [i].perish ();
            }
            this.hunters.length = 0;
            this.scheduleNext (turnNumber);
        },
        scheduleNext: function (turnNumber) {
            this.nextSpawn = turnNumber + this.data.frequency;
        },
        buildTiles: function (className) {
             var tiles = document.getElementsByClassName (className);
            this.tiles.length = 0;
            //console.log (tiles);
            if (tiles.length > 0) {
                for (var i = 0; i < tiles.length; i++) {
                    var tile = tiles [i];
                    var newTile = new Tile ("hunter", tile);
                    newTile.changeState ("inactive");
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
            this.rabbits.length = 0;
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
            //console.log ("--- id");
            //console.log (id);
            this.rabbits [id].perish ();
            this.rabbits.splice (id, 1);
        },
        /*removeRabbitAt: function (x, y) {
            // RM?
            var tile = this.findTile (x,y);
            if (tile != null) {
                this.removeRabbit (tile);
            }
        },*/
        buildTiles: function (className) {
             var tiles = document.getElementsByClassName (className);
            this.tiles.length = 0;
            
            //console.log (tiles);
            if (tiles.length > 0) {
                for (var i = 0; i < tiles.length; i++) {
                    var tile = tiles [i];
                    var newTile = new Tile ("rabbit", tile);
                    newTile.changeState ("inactive");
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
            //update the rabbits
            for (var i = 0; i < this.rabbits.length; i++) {
                this.rabbits [i].update ();
            }
            
            // spawn a new rabbit if it's time
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
                        game.sounds.request ("rabbitSpawn");
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
            this.bottle = null;
            this.scheduleNext (0);
        },
        scheduleNext: function (turnNumber) {
            this.nextSpawn = turnNumber + this.data.frequency;
        },
        removeBottle: function (turnNumber) {
            this.bottle.perish ();
            this.bottle = null;
            this.nextSpawn = turnNumber + this.data.frequency;
            game.hunters.removeAll (turnNumber);
            console.log ("RAWR!!!");
            document.body.classList.add ("bottlePickup");
        },
        buildTiles: function (className) {
             var tiles = document.getElementsByClassName (className);
            this.tiles.length = 0;
            
            //console.log (tiles);
            if (tiles.length > 0) {
                for (var i = 0; i < tiles.length; i++) {
                    var tile = tiles [i];
                    var newTile = new Tile ("whiskey", tile);
                    newTile.changeState ("inactive");
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
            var start = randomInt (0, this.tiles.length-1);
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
    
    return obj;
}