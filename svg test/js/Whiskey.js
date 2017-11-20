function Whiskey (tile) {
    var obj = {},
        xStart = tile.position.x,
        yStart = tile.position.y,
        now = Date.now ();
    
    obj.tile = tile;
    obj.position = {
        x: xStart,
        y: yStart
    };
    
    tile.changeState ("active");
    
    obj.perish = function () {
        this.tile.changeState ("inactive");
    };
    
    return obj;
}