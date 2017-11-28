function Rabbit (xStart, yStart) {
    var obj = {};
    
    obj.position = {
        x: xStart,
        y: yStart,
        tile: {},
        /*skipTurn: true,
        tileId: {},*/
        next: {
            x: xStart,
            y: yStart,
            tile: {}
            /*tileId: {}*/
        },
        nextTile: 0,
        set: function (tile) {
            /*var oldTile = game.rabbits.findTile (
                this.x,
                this.y
            );*/
            var oldTile = this.tile;
            // reset last tile
            if (oldTile != null) {
                oldTile.changeState ("inactive");
            }
            
            this.x = tile.position.x;
            this.y = tile.position.y;
            this.tile = tile;
            // activate new tile
            tile.changeState ("active");
            
            // highlight next tile
            var nextPos = this.findNext ();
            
            this.nextTile = nextPos;
            this.next.x = nextPos.position.x;
            this.next.y = nextPos.position.y;
            // highligh next place
            nextPos.changeState ("nextTarget");
        },
        findNext: function () {
            var potentialPositions = new Array (),
                validTiles = new Array ();
            
            // up
            potentialPositions.push ({
                x: this.x,
                y: this.y - 1
            });
            // left
            potentialPositions.push ({
                x: this.x - 1,
                y: this.y
            });
            // right
            potentialPositions.push ({
                x: this.x + 1,
                y: this.y
            });
            // down
            potentialPositions.push ({
                x: this.x,
                y: this.y + 1
            });
            
            for (var i = 0; i < potentialPositions.length; i++) {
                // validate those positions
                var tile = game.rabbits.findTile (
                    potentialPositions [i].x,
                    potentialPositions [i].y
                );
                if (tile != null &&
                    player.position.x != potentialPositions.x && 
                    player.position.y != potentialPositions.y ) {
                    validTiles.push (tile);
                }
            }
            
            var start = randomInt (0, validTiles.length-1);
            
            return validTiles [start];
        },
        move: function () {
            this.set (this.nextTile);
        }
    };
    
    obj.dead = false;
    obj.perish = function () {
        // deactivate tile and next tile
        this.position.tile.changeState ("inactive");
        this.position.nextTile.changeState ("inactive");
        this.dead = true;
    };
    
    obj.init = function (tile) {
        this.position.tile = tile;
        this.position.set (tile);
    };
    obj.update = function () {
        if (!this.dead) {
            var skipTurn = Math.random ();
            // 50% chance to skip a turn
            if (skipTurn <= 0.5) {
                // Update rabbit movement
                this.position.move ();
            }
        }
    };
    
    return obj;
}
