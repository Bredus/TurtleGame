var config = {
    type: Phaser.AUTO,
    backgroundColor: 0xf8bf43,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: 400,
        height: 300
    },
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }

};

var game = new Phaser.Game(config);

// PARAMETERS

// MANAGEMENT
var gameEnabled = false;
// OBJECTs
var turtles = [];
// INPUT
var keys;
// TEXT
var displayText;
// TIMERS
var tmrStart = [];
var tmrWin = [];
// MISC
var ystart = 250;
var speed = 16;

var _this;

function preload()
{
    this.load.spritesheet('turtle', 'images/turtle.png', {frameWidth: 64, frameHeight: 80 });
    this.load.spritesheet('turtle2', 'images/turtle2.png', {frameWidth: 64, frameHeight: 80 });
}

function create()
{
    //INPUT
    keys = {
        a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        b: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        c: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        ar: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
        br: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        cr: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    };

    turtles[0] = instTurtle(
        'GREEN PLAYER',
        'turtle',
        125,
        [keys.a, keys.b, keys.c],
        this
    )

    turtles[1] = instTurtle(
        'RED PLAYER',
        'turtle2',
        275,
        [keys.ar, keys.br, keys.cr],
        this
    )
    
    displayText = this.add.text(200,150, 'hello', {color:'color.black', boundsAlignH: 'center', boundsAlignV: 'middle'});
    displayText.setOrigin(0.5,0.5);

    // TIMERS
    tmrStart[0] = new Phaser.Time.TimerEvent({ args: ['SET'], delay: 1000, callback: msg, callbackScope: this });
    tmrStart[1] = new Phaser.Time.TimerEvent({ args: ['GO!'], delay: 2000, callback: msg, callbackScope: this });
    tmrStart[2] = new Phaser.Time.TimerEvent({ delay: 2000, callback: enableGame, callbackScope: this });
    tmrStart[3] = new Phaser.Time.TimerEvent({ args: [''], delay: 3000, callback: msg, callbackScope: this });

    _this = this;
    newGame();
}

function update()
{
    if (gameEnabled)
    {

        movement(turtles[0]);
        movement(turtles[1]);
    }
    
}

function newGame()
{
    setupTurtle(turtles[0]);
    setupTurtle(turtles[1]);
    msg('READY');

    for(var i = 0; i < 4; i++)
    {
        _this.time.addEvent(tmrStart[i]);
    }
}

function instTurtle(label, sprite, x, keys, _this)
{
    var turtle = _this.physics.add.sprite(x,225,sprite);
    turtle.label = label;
    turtle.keys = keys;

    setupTurtle(turtle);

    return turtle;
}

function setupTurtle(turtle)
{
    turtle.keydown = false;
    turtle.y = ystart;
    turtle.keynum = 0;
    turtle.framenum = 0;
}

function movement(turtle)
{
    var keydown = turtle.keydown;
    var keynum = turtle.keynum;
    var key = turtle.keys[keynum];
    var frame = turtle.framenum;

    if (key.isDown)
    {
        if (!keydown)
        {
            keydown = true;
            keynum++;
            frame++;

            if (keynum == 3)
                keynum = 0;

            if (frame == 3)
            {
                frame = 0;
                turtle.y -= speed;
            }

            turtle.setFrame(frame);
        }
    }
    else
    {
        keydown = false;
    }

    turtle.keydown = keydown;
    turtle.keynum = keynum;
    turtle.framenum = frame;
    checkWin(turtle);
}

function checkWin(turtle)
{
    if (turtle.y - 32 <= 0)
    {
        gameEnabled = false;

        if (turtles[0].y <= 0 && turtles[1] <= 0)
        {
            msg('DRAW!');
        }
        else
            msg(turtle.label + ' WINS!!!');

        _this.time.delayedCall(3000, msg, ['NEW ROUND'], _this);
        _this.time.delayedCall(4500, newGame, [], _this);
    }
}

function msg(text)
{
    displayText.text = text;
}

function enableGame()
{
    gameEnabled = true;
}

function hello()
{
    console.log('hello');
}
