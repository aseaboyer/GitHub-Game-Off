function SoundController () {
    var obj = {},
        now = Date.now ();
    
    obj.list = gameData.sounds;
    
    obj.on = true;
    obj.toggle = function () {
        this.on = !this.on;
    };
    obj.nextPlay = null;
    obj.findClip = function (soundName) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list [i].name === soundName) {
                return this.list [i];
            }
        }
        return null;
    },
    obj.request = function (soundName) {
        var turn = game.turn.current,
            foundClip = this.findClip (soundName);
        
        if (foundClip != null) {
            foundClip.turn = turn;
            
            if (this.nextPlay === null || turn > this.nextPlay.turn) {
                this.nextPlay = foundClip;
                
            } else {
                // compare priorities before adding
                if (foundClip.priority > this.nextPlay.priority) {
                    this.nextPlay = foundClip;
                }
            }
            
        } else {
            // audio entry not found
            console.log ("Can't find audio: " + soundName);
        }
    };
    
    obj.update = function (turnNumber) {
        if (this.nextPlay != null && this.on) {
            //console.log (this.nextPlay.file);
            var snd = new Audio(this.nextPlay.file);
            snd.play();
        }

        this.nextPlay = null;
    };
    
    return obj;
}