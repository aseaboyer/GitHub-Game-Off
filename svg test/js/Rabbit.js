function Rabbit (xStart, yStart) {
    var obj = {};
    
    obj.position = {
        x: xStart,
        y: yStart,
        tileId: {},
        next: {
            x: xStart,
            y: yStart,
            tileId: {}
        },
        tile: 0,
        nextTile: 0,
        set: function (tile) {
            var oldTile = game.rabbits.findTile (
                this.x,
                this.y
            );
            // reset last tile
            if (oldTile != null) {
                oldTile.changeState ("inactive");
            }
            
            this.x = tile.position.x;
            this.y = tile.position.y;
            // activate new tile
            tile.changeState ("active");
            
            // highlight next tile
            this.findNext ();
        },
        findNext: function () {
            
        }
    };
    
    obj.perish = function () {
        // deactivate new tile
        this.position.tile.changeState ("inactive");
    };
    
    obj.init = function (tile) {
        //console.log (tile);
        //console.log ("Set this tile to active and all that!");
        this.position.tile = tile;
        this.position.set (tile);
    };
    obj.update = function () {
        
        // Update rabbit movement
        
    };
    
    return obj;
}