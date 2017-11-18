function Player () {
    var obj = {},
        now = Date.now ();
    
    obj.data = gameData.bear;
    obj.init = function (x, y) {
        this.position.buildTiles ("bear-tile");
        
        this.position.set (this.position.x, this.position.y);
    };
    obj.position = {
        x: gameData.bear.startPosition.x,
        y: gameData.bear.startPosition.y,
        tileId: 0,
        set: function (x, y) {
            var foundTile = this.findTile (x,y);
            
            if (foundTile != null) {
                var tile = foundTile;
                // change it's state
                tile.changeState ("active");
                // also update the local info
                this.x = x;
                this.y = y;
                this.tileId = foundTile;

                // clear existing 'highlight'ed places
                for (var i = 0; i < this.tiles.length; i++) {
                    if (this.tiles [i].state === "highlight") {
                        this.tiles [i].changeState ("inactive");
                    }
                }
                // also, 'highlight' potential next places
                for (var i = 0; i < this.tiles.length; i++) {
                
                    // left
                    if (this.tiles [i].comparePosition (x-1,y)) {
                        this.tiles [i].changeState ("highlight");
                    }
                    // right
                    if (this.tiles [i].comparePosition (x+1,y)) {
                        this.tiles [i].changeState ("highlight");
                    }
                
                    // up
                    if (this.tiles [i].comparePosition (x,y+1)) {
                        this.tiles [i].changeState ("highlight");
                    }
                    // down
                    if (this.tiles [i].comparePosition (x,y-1)) {
                        this.tiles [i].changeState ("highlight");
                    }
                
                }
            }
        },
        tiles: [],
        history: [],
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
        buildTiles: function (className) {
            var tiles = document.getElementsByClassName (className);
            if (tiles.length > 0) {
                for (var i = 0; i < tiles.length; i++) {
                    var tile = tiles [i];
                    var newTile = new Tile ("bear", tile);
                    this.tiles.push (newTile);
                }
            }
        }
    };
    
    obj.move = function (dir) {
        var target = {
                x: this.position.x + dir.vector2.x,
                y: this.position.y + dir.vector2.y
            };
        
        // Move the player via position.set
        this.position.set (target.x, target.y);
    };
    
    /*
    
    obj.move = function (dir) {
        var newDir = {x:0, y:0};
        if (dir !== "" || dir !== null) {
            // check for direction and translate to an x/y
            if (dir === "up") {
                newDir.y = -1;
            } else if (dir === "right") {
                newDir.x = 1;
            } else if (dir === "down") {
                newDir.y = 1;
            } else if (dir === "left") {
                newDir.x = -1;
            }
            
            // if the player is on the board...move them
            if (this.position.x + newDir.x >= 0 &&
                this.position.x + newDir.x < game.board.width &&
                this.position.y + newDir.y >= 0 &&
                this.position.y + newDir.y < game.board.height) {
                    // move the player
                    this.position.x += newDir.x;
                    this.position.y += newDir.y;
            }
        }
    };
    
    /*
    obj.healthBar = document.getElementById ("healthBar");
    obj.currentHealth = 100;
    obj.setHealth = function (val) {
        this.currentHealth = val;
        this.healthBar.style.width = this.currentHealth+"%";
    };
    obj.changeHealth = function (val) {
        var newHealth = this.currentHealth + val;
        if (newHealth > 100) { newHealth = 100; }
        if (newHealth < 0) { 
            console.log ("player died");
            game.openKillScreen ();
        } else {
            this.setHealth (newHealth);
        }
    };
    
    obj.setHealth (50);
    */
    
    return obj;
}