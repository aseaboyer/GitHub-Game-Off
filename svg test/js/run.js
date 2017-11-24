/*
 * Vars
 */
var game, keys,
    player, und;

/*
 * Key presses
 */
document.body.addEventListener("keydown", function (e) {
    keys.press (e.keyCode);
});
document.body.addEventListener("keyup", function (e) {
    keys.release (e.keyCode);
});
document.getElementById ("toggle-guide").addEventListener ("click", function (e) {
    document.body.classList.toggle ("guide-open");
});

var dbuttons = document.getElementsByClassName ("dbutton");
for (var i = 0; i < dbuttons.length; i++) {
    dbuttons [i].addEventListener("touchstart", function (e) {
        keys.press (e.target.dataset.keyValue);
    });
    dbuttons [i].addEventListener("touchend", function (e) {
        keys.release (e.target.dataset.keyValue);
    });
}

/*
 * INIT Phase
 */
(function () { // INIT
    var c = document.getElementById ("game");
    var turnSpeed = 500;
    game = new Game (c, turnSpeed);
    keys = new Keyring ();
    player = new Player ();
    game.init ();
    player.init ();
    
    //game.loadSVG ("scene.svg");
    
    //Draw ();
    GameLoop ();
})();

/*
 * UPDATE Loop
 */
function GameLoop () {
    window.requestAnimationFrame(GameLoop);
    
    var now = Date.now ();
    game.update ();
    //game.turn.update ();
    
    if (game.turn.newTurn) {
        //console.log (now);
        if (keys.current.pressed) {
            // change player position
            player.move (keys.current);
        }
        
        /// Reset the turn variable
        game.turn.resetNewTurn ();
        
    }
    
    //console.log (keys.current);
};

/*
 * Probably wont use draw since we're using SVG
 */
/*
function Draw () {
    // clear canvas
    game.clearCanvas ();
    
    game.drawBit (player.position.x, player.position.y,
                  game.colors.player, "1");
    
    // enemies
    for (var i = 0; i < game.enemies.length; i++) {
        game.enemies [i].update ();
        
        // Check to see if it's offscreen - use player check
        if (game.enemies [i].position.x >= 0 &&
            game.enemies [i].position.x < game.board.width &&
            game.enemies [i].position.y >= 0 &&
            game.enemies [i].position.y < game.board.height) {
            
            game.drawBit (game.enemies [i].position.x, 
                game.enemies [i].position.y,
                game.colors.enemy, "1");
        } else {
            game.removeEnemy (i);
        }
    }
    
    // check for enemy impacts with player
    for (var i = 0; i < game.enemies.length; i++) {
        if (game.enemies [i].position.x === player.position.x &&
            game.enemies [i].position.y === player.position.y &&
            game.enemies [i].spawning === false) {
                player.changeHealth (-30);
        }
    }
    
    
    // spawn a new enemy - progressively more enemies
    if (game.enemies.length < (game.coinsCollected/2) ||
        game.enemies.length <= 0) {
        game.spawnEnemy ();
    }
}
*/
