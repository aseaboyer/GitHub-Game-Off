function Player () {
    var obj = {},
        now = Date.now ();
    
    obj.data = gameData.bear;
    obj.init = function (x, y) {
        this.position.buildTiles ("bear-tile");
        
        this.position.set (this.position.x, this.position.y);
        
        this.health.set (gameData.bear.startingHealth);
    };
    
    obj.health = {
        current: 0,
        set: function (newVal) {
            this.current = newVal;
            document.body.dataset.playerHealth = this.current;
            
            if (this.curent <= 0) {
                this.curent = 0;
                console.log ("Game Over!");
                game.state.change ("loss");
            }
            
        },
        remove: function () {
            if (this.current > 0) {
                this.set (this.current - 1);
            }
        }
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
                
                // check for rabbits
                var rabbitOnTile = game.rabbits.findRabbitId (this.x, this.y);
                if (rabbitOnTile != null) {
                    //console.log ("Found a rabbit! @ " + rabbitOnTile);
                    game.rabbits.removeRabbitById (rabbitOnTile);
                    game.scorePoints ("rabbit");
                }
                
                // check for whiskey
                /*
                var whiskeyOnTile = game.whiskey.atLocation (this.x, this.y);
                if (whiskeyOnTile) {
                    game.whiskey.removeBottle ();
                }*/
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
    
    return obj;
}