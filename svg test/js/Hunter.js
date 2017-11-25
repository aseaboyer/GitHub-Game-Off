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
    
    obj.update = function () {
        var validShot = game.findHunterTarget (this.position.row);
        //console.log ("Hunter aiming in " + this.position.row + " :: " + validShot);
        if (validShot.found) {
            //console.log (validShot.found + " :: " + this.targetInSight);
            if (!this.targetInSight) {
                // new target aquired
                this.targetInSight = true;
                this.aiming (true);

            } else {
                // shoot target

                this.takeShot (validShot);
            }
            
        } else {
            // cancel previous shot, just in case
            this.targetInSight = false;
            this.aiming (false);
        }
    };
    
    obj.targetInSight = false;
    obj.takeShot = function (validShot) {
        // kill closest thing in column
        game.killHunterTarget (validShot, this.position.row);
        
        // lastly, cancel target in sight
        this.targetInSight = false;
        this.aiming (false);
    };
    
    obj.aiming = function (aiming) {
        if (aiming) {
            this.tile.object.classList.add ("aiming");
        } else {
            this.tile.object.classList.remove ("aiming");
        }
    };
    
    obj.perish = function () {
        this.tile.changeState ("inactive");
    };
    
    tile.changeState ("active");
    
    return obj;
}