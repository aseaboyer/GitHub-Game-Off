function Tile (type, tile) {
    var obj = {};
    
    obj.type = type;
    obj.object = tile;
    obj.state = "inactive";
    obj.changeState = function (newState) {
        this.state = newState;
        this.object.dataset.state = newState;
        /*console.log ("Change State: " + 
            this.type + " (" +
            this.position.x + ", " +
            this.position.y + ") " + 
            newState + ":" + this.state);*/
    }
    obj.position = {
        x: parseInt (tile.getAttribute ("xpos")),
        y: parseInt (tile.getAttribute ("ypos"))
    };
    obj.comparePosition = function (x, y) {
        if (x === this.position.x &&
           y === this.position.y) {
            return true;
        }
        return false;
    };
    
    obj.changeState ("inactive");
    
    return obj;
}
