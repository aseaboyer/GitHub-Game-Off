function Hunter (tile) {
    var obj = {},
        xStart = tile.position.x,
        yStart = tile.position.y,
        now = Date.now ();
    
    obj.tile = tile;
    obj.position = {
        x: xStart,
        y: yStart,
        row: xStart // Row is all hunters need
    };
    
    obj.targetInSight = false;
    
    obj.update = function () {
        if (this.targetInSight) {
            // check if it's still in sights
        
        } else {
            // check for a target
            var validShot = game.findHunterTarget (this.position.row);
        }
    };
    
    obj.perish = function () {
        this.tile.changeState ("inactive");
    };
    
    tile.changeState ("active");
    
    return obj;
}