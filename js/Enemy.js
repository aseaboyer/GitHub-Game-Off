function Enemy (xStart, yStart) {
    var obj = {},
        xDirection,
        yDirection,
        randomDir = Math.floor (Math.random() * 4);
    
    obj.created = Date.now ();
    
    obj.start = {
        x: xStart,
        y: yStart,
    };
    obj.position = {
        x: xStart,
        y: yStart,
    };
    obj.direction = { x: 0, y: 0 };
    if (randomDir === 1) {
        obj.direction.x = 1;
    } else if (randomDir === 2) {
        obj.direction.x = -1;
    } else if (randomDir === 3) {
        obj.direction.y = 1;
    } else {
        obj.direction.y = -1;
    }
    
    obj.spawning = true;
    obj.history = new Array ();
    obj.update = function (dir) {
        
        // update the history 
        this.history.unshift({
            x: this.position.x,
            y: this.position.y
        });
        
        // move the enemy
        if (this.spawning === false) {
            this.position.x += this.direction.x;
            this.position.y += this.direction.y;
        } else {
            if (this.history.length > 5) {
                this.spawning = false;
            }
        }
    };
    
    return obj;
}