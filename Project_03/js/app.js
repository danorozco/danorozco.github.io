// Enemy class for enemies our player must avoid.
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    //Initial Y position is set at random but formula is applied to select the random row.
    //Initial X position is applied to begin at random locations to left of board.
    this.x = (Math.floor(Math.random()*5)*101)-505;
    this.y = ((Math.floor(Math.random()*3)+1)*83)-23;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //Loop to process (position and collision) all enemies previously loaded
    for (var i=0; i<allEnemies.length; i++) {

        //Move enemies
        allEnemies[i].x += 20 * dt;

        //Check for enemies leaving the board then reposition to re-enter.
        if (allEnemies[i].x > 505) {
            allEnemies[i].x = (Math.floor(Math.random()*5)*101)-505;
            allEnemies[i].y = ((Math.floor(Math.random()*3)+1)*83)-23;
        }

        //Check for enemy and position collision.
        //Move player to starting point and remove 1 life if collision occurs.
        if (((player.x >= allEnemies[i].x && player.x <= allEnemies[i].x+80) ||
                (player.x+80 >= allEnemies[i].x && player.x+80 <= allEnemies[i].x+80))
                && player.y >= allEnemies[i].y && player.y <= allEnemies[i].y+83) {
            player.x = 202;
            player.y = 400;
            gameStats.life -= 1;
        }
    }
};


// Render method draws the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// now write your own Player class
// This class requires an update(), render() and
// a handleInput() method.

//the Player class and methods.
//the position is set to home
//active is set to yes.  Active is a flag used to enable/disable certain Player functions.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 400;
    this.active = 'yes';
};

//Player update method
Player.prototype.update = function() {

    //Checks to insure Player stays within board borders.
    //If Player goes beyond borders, Player is moved back to previous loc before move.
    if (this.y < 68 || this.y > 400 || this.x < 0 || this.x > 404) {
        this.x = this.curx;
        this.y = this.cury;
    }

    //Code below blocks Player from moving when encounters a bolder in road.
    if ((this.x >= gameObjectRock.x && this.x <= gameObjectRock.x+10) && 
            (this.y >= gameObjectRock.y && this.y <= gameObjectRock.y+10)) {
        this.x = this.curx;
        this.y = this.cury;
    }
};

//Player render method.  Draw Player on screen.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Player handleInput method.  Determines move based on keyboard event.
Player.prototype.handleInput = function(keyEvent) {
    //records Player position before move is attempted.
    this.curx = this.x;
    this.cury = this.y;

    //if Player is active then Player will move according to key pressed.
    if (this.active == 'yes') {
        if (keyEvent == 'up') {
            this.y = this.y - 83;
        }

        if (keyEvent == 'down') {
            this.y = this.y + 83;
        }

        if (keyEvent == 'left') {
            this.x = this.x - 101;
        }

        if (keyEvent == 'right') {
            this.x = this.x + 101;
        }
    }
};

//This is the Rock class. This places the bolder on the road.
//The initial position is random.
var GameObjectRock = function() {
    this.sprite = 'images/Rock.png';
    this.x = (Math.floor(Math.random()*5)*101);
    this.y = ((Math.floor(Math.random()*3)+1)*83)-25;
    this.active = 'off';
};

//Draws the rock on the screen.
GameObjectRock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Game Prize class creates the various items to collect on the display board.
//Status object determines when item is displayed.
var GameObjectPrize = function() {
    this.prize = [
        {'img-src':'images/Gem Blue.png','val':2,'itemType':'gem','min':1,'max':35,'y-offset':35},
        {'img-src':'images/Gem Green.png','val':3,'itemType':'gem','min':36,'max':60,'y-offset':35},
        {'img-src':'images/Gem Orange.png','val':5,'itemType':'gem','min':61,'max':75,'y-offset':35},
        {'img-src':'images/Heart.png','val':10,'itemType':'special','min':76,'max':85,'y-offset':15},
        {'img-src':'images/Key.png','val':20,'itemType':'key','min':86,'max':90,'y-offset':15},
        {'img-src':'images/Star.png','val':10,'itemType':'special','min':91,'max':100,'y-offset':15}
    ];
    this.active = 'yes';
    this.status = 'off';
    this.x = 201;
    this.y = 133;
};

//The update method will pick an item to display.
//Items have varying probabilities of appearing based on a random number falling between a range.
//When item is selected various attributes are assigned to variables (value, item type).
GameObjectPrize.prototype.update = function() {
    if (this.status == 'off' && this.active == 'yes') {
        this.status = 'on';
        var rndSelectNbr = Math.floor(Math.random()*100+1);
        var imgSelectNbr = 0;
        for (var i=0; i<this.prize.length; i++) {
            if (rndSelectNbr >= this.prize[i]['min'] && rndSelectNbr <= this.prize[i]['max']) {
                imgSelectNbr = i;
            }
        }
        this.sprite = this.prize[imgSelectNbr]['img-src'];
        this.x = (Math.floor(Math.random()*5)*101);
        this.y = ((Math.floor(Math.random()*3)+1)*83)-this.prize[imgSelectNbr]['y-offset'];
        this.val = this.prize[imgSelectNbr]['val'];
        this.itemType = this.prize[imgSelectNbr]['itemType'];
        if ((gameObjectRock.x >= this.x && gameObjectRock.x <= this.x+20) &&
                (gameObjectRock.y >= this.y-10 && gameObjectRock.y <= this.y+20)) {
            this.status = 'off';
        }
        this.activeTimer = Date.now()+5000;
    }

    //Status of item is checked and toggles between between on, sleep, and off based on timer.
    if (this.status == 'on' && this.active == 'yes') {
        if (Date.now()>this.activeTimer) {
            this.status = 'sleep';
            this.x = null;
            this.y = null;
            this.activeTimer = Date.now()+1000;
        } else {
 
            //Collision is checked between player and item.
            //If collision occurs, then item is 'collected', status toggles, and gamestats are updated.
            if ((player.x >= this.x && player.x <= this.x+20) &&
                    (player.y >= this.y && player.y <= this.y+20)) {
                this.status = 'sleep';
                this.x = null;
                this.y = null;
                gameStats.score += this.val;
                switch (this.itemType) {
                    case 'gem':
                        gameStats.gems += 1;
                        break;
                    case 'special':
                        gameStats.special += 1;
                        break;
                    case 'key':
                        gameStats.keys += 1;
                        break;
                }
                this.activeTimer = Date.now()+500;
            }
        }
    }

    if (this.status == 'sleep' && this.active == 'yes' && Date.now()>this.activeTimer) {
        this.status = 'off';
    }
};

//Render method draws the prize items to the screen if status and active conditions are met.
GameObjectPrize.prototype.render = function() {
    if (this.status == 'on' && this.active == 'yes') {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

//Game Stats class.  This stores all the objects related to the game statistics.
var GameStats = function() {
    this.scorex = 5;
    this.scorey = 15;
    this.lifex = 5;
    this.lifey = 40;
    this.countDownx = 251;
    this.countDowny = 15;
    this.gemx = 151;
    this.gemy = 15;
    this.specialx = 351;
    this.specialy = 15;
    this.keyx = 451;
    this.keyy = 15;

    this.countDown = 61;
    this.score = 0;
    this.life = 3;
    this.gems = 0;
    this.special = 0;
    this.keys = 0;
};

//Update method checks if countdown clock or life has met threshold to end game.
//life checks for '-' since the -1 gets converted to '-' for display.
GameStats.prototype.update = function(dt) {
    if (this.countDown < 1 || (this.life < 0 || this.life == '-')) {
        gameMenu.gameOver = 'yes';
    } else {
        this.countDown -= dt;
    }
};

//Render method displays Game Stats in menu.
GameStats.prototype.render = function() {
    ctx.clearRect(0,0,ctx.canvas.width,45);
    ctx.fillStyle = 'Black';
    ctx.font = '15px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + this.score, this.scorex, this.scorey);
    ctx.fillText('Life: ' + this.life, this.lifex, this.lifey);
    ctx.textAlign = 'center';
    ctx.fillText('Gems', this.gemx, this.gemy);
    ctx.fillText(this.gems, this.gemx, this.gemy+20);
    ctx.fillText('Special', this.specialx, this.specialy);
    ctx.fillText(this.special, this.specialx, this.specialy+20);
    ctx.fillText('Keys', this.keyx, this.keyy);
    ctx.fillText(this.keys, this.keyx, this.keyy+20);
    ctx.font = '20px Arial';
    ctx.fillText('Time', this.countDownx, this.countDowny);
    ctx.fillText(Math.floor(this.countDown), this.countDownx, this.countDowny+25);
};

//Game Menu Class. Used for game over screen.
var GameMenu = function() {
    this.gameOver = 'no';
    this.active = 'no';
};

//Update method assigns values to certain objects when game over.
GameMenu.prototype.update = function() {
    if (this.gameOver == 'yes') {
        gameObjectPrize.active = 'no';
        player.active = 'no';
        this.active = 'yes';
        player.x = 202;
        player.y = 400;

        //when life falls below 0, it converts to '-' for display purposes.
        if (gameStats.life < 0) {
            gameStats.life = '-';
        }
    }
};

//Render method to draw Game Over screen/prompts.
GameMenu.prototype.render = function() {
    if (this.gameOver == 'yes') {
        ctx.textAlign = 'center';

        ctx.font = '56px Arial';
        ctx.lineWidth = 5;
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'black';
        ctx.strokeText('Game Over',ctx.canvas.width / 2 , ctx.canvas.height / 2);
        ctx.fillText('Game Over',ctx.canvas.width / 2 , ctx.canvas.height / 2);

        ctx.font = '20px Arial';
        ctx.lineWidth = 4;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.strokeText('Press Enter to Play Again',ctx.canvas.width / 2 , (ctx.canvas.height / 2) + 25);
        ctx.fillText('Press Enter to Play Again',ctx.canvas.width / 2 , (ctx.canvas.height / 2) + 25);
    }

    //Places move instructions on bottom of gameboard.
    ctx.font = '15px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Move player with arrow keys',ctx.canvas.width / 2, 575);
};

//HandleInput method to check for ENTER pressed to restart new game.
GameMenu.prototype.handleInput = function(keyEvent) {
    if (this.active == 'yes') {
        if (keyEvent == 'ENTER') {
            reset();
        }
    }
};

// now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var gameMenu = new GameMenu();

var gameStats = new GameStats();

var gameObjectRock = new GameObjectRock();

var gameObjectPrize = new GameObjectPrize();

var allEnemies = [];

//Creates and places enemies into allEnemies array.
for(var i=0; i<3; i++) {

    var newEnemy = new Enemy();

    allEnemies.push(newEnemy);
}

var player = new Player();

//Reset function runs when game restarts.
function reset() {

    gameStats.life = 3;
    gameStats.countDown = 61;
    gameStats.score = 0;
    gameStats.gems = 0;
    gameStats.special = 0;
    gameStats.keys = 0;

    gameMenu.gameOver = 'no';
    gameMenu.active = 'no';

    player.active = 'yes';

    gameObjectPrize.active = 'yes';

}

// This listens for key presses and sends the keys to your
// Player.handleInput() and gameMenu.handleInput() methods.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'ENTER'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    gameMenu.handleInput(allowedKeys[e.keyCode]);
});