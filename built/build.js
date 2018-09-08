class WorldObject {
    constructor(levelModel, hitbox) {
        this.facing = DirEnum.Left;
        this.vx = 0;
        this.vy = 0;
        Object.assign(this, { levelModel, hitbox });
    }
    act() { }
    calculateSprites() { }
    getScreenPosition() {
        return new Point(this.hitbox.x, this.hitbox.y);
    }
}
var DirEnum;
(function (DirEnum) {
    DirEnum[DirEnum["Left"] = 1] = "Left";
    DirEnum[DirEnum["Right"] = 2] = "Right";
})(DirEnum || (DirEnum = {}));
class LevelController {
    constructor(inputManager, heli, levelModel, ctx) {
        Object.assign(this, { inputManager, heli, levelModel, ctx });
    }
    handleInput() {
        if (this.inputManager.KB[Constants.INPUT.Keys.D]) {
            this.levelModel.player.applyImpulse('R');
        }
        else if (this.inputManager.KB[Constants.INPUT.Keys.A]) {
            this.levelModel.player.applyImpulse('L');
        }
        if (this.inputManager.KB[Constants.INPUT.Keys.W]) {
            this.levelModel.player.applyImpulse('U');
        }
        else if (this.inputManager.KB[Constants.INPUT.Keys.S]) {
            this.levelModel.player.applyImpulse('D');
        }
        if (this.inputManager.KP === Constants.INPUT.Keys.Space) {
            this.levelModel.player.toggleWinch();
        }
        if (!this.levelModel.player.alive && this.inputManager.KP === Constants.INPUT.Keys.Escape) {
            this.heli.switchScreen(new MenuScreen(this.ctx, this.heli, this.inputManager));
        }
    }
}
class MenuController {
    constructor(inputManager, heli, ctx) {
        Object.assign(this, { inputManager, heli, ctx });
    }
    handleInput() {
        if (this.inputManager.KP === Constants.INPUT.Keys.Space) {
            this.heli.switchScreen(new LevelScreen(this.ctx, this.heli, this.inputManager));
        }
    }
}
class AssetManager {
    static loadSprites() {
        let files = new Array();
        for (let i = 0; i !== 99; ++i) {
            if (i > 0 && i <= 2) {
                files.push('heli_l_' + i);
            }
            if (i > 0 && i <= 2) {
                files.push('heli_r_' + i);
            }
            if (i > 0 && i <= 3) {
                files.push('help' + i);
            }
            if (i > 0 && i <= 2) {
                files.push('person_fall_' + i);
            }
        }
        files.push(...['person', 'person_hang', 'volcano', 'meteor', 'meteor2', 'helipad', 'arrow_tag', 'debris', 'death', 'saved']);
        // tslint:disable-next-line:no-any
        this.sprites = new Map();
        files.forEach(s => {
            let i = new Image();
            i.crossOrigin = 'anonymous';
            i.src = 'assets/sprites/' + s + '.png';
            this.sprites[s] = i;
        });
    }
    // tslint:disable-next-line:no-any
    static getSprite(str) {
        return this.sprites[str];
    }
}
class AudioManager {
    static initialise() {
        for (let i = 0; i !== this.SAMPLE_BUFFER_SIZE; ++i) {
            this.samples[i] = new Audio();
        }
    }
    static playMusic(vol) {
        let myAudio = new Audio('./assets/sounds/' + 'music_file_here');
        myAudio.volume = vol * this.GLOBAL_VOLUME;
        myAudio.loop = true;
        myAudio.play();
    }
    // TODO: rewrite this to use a hashmap of samples?
    // Calling new Audio() on every new sound is bad
    static playSound(str, vol) {
        let sample = this.samples[this.sampleIndex];
        sample.pause();
        sample.currentTime = 0;
        sample = new Audio('./assets/sounds/' + str + '.wav');
        // sample.playbackRate = 1;
        sample.volume = vol * this.GLOBAL_VOLUME;
        sample.play();
        this.sampleIndex = (this.sampleIndex + 1) % this.SAMPLE_BUFFER_SIZE;
    }
}
AudioManager.samples = Object;
AudioManager.sampleIndex = 0;
AudioManager.SAMPLE_BUFFER_SIZE = 6;
AudioManager.GLOBAL_VOLUME = 0.5;
class Constants {
}
Constants.CANVAS_WIDTH = 800;
Constants.CANVAS_HEIGHT = 518;
Constants.X_IMPULSE = 0.275;
Constants.Y_IMPULSE = 0.175;
Constants.GRAVITY = 0.08; // constant value added to vy every frame
Constants.DRAG = 0.955; // constant value by which vx is multiplied every frame
Constants.MAX_X_SPEED = 2;
Constants.MAX_Y_SPEED = 2;
Constants.WINCH_SPEED = 1;
Constants.WINCH_LENGTH = 50;
Constants.GROUND_HEIGHT = 500;
Constants.LEVEL_TIME = 60;
Constants.OUTCOME_SPRITE_WIDTH = 30;
Constants.LIST_OUTCOME_DELAY = 20;
Constants.WINCH_Y_OFFSET = 12;
Constants.PERSON_HEIGHT = 22;
Constants.COLORS = {
    DRAW_COLOR: '#ffffff',
    SCANLINE_COLOR: '#006000',
    NONE: '#000000',
    SCANLINE_ALPHA: 0.25,
};
Constants.INPUT = {
    None: -1,
    Keys: {
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        Tab: 9,
        Alt: 18,
        Numpad0: 96,
        Numpad1: 97,
        Numpad2: 98,
        Numpad3: 99,
        Numpad4: 100,
        Numpad5: 101,
        Numpad6: 102,
        Numpad7: 103,
        Numpad8: 104,
        Numpad9: 105,
        NumpadMultiply: 106,
        NumpadAdd: 107,
        Numrow0: 48,
        Numrow1: 49,
        Numrow2: 50,
        Numrow3: 51,
        Numrow4: 52,
        Numrow5: 53,
        Numrow6: 54,
        Numrow7: 55,
        Numrow8: 56,
        Numrow9: 57,
        Escape: 27,
        Space: 32,
        DownArrow: 40,
        UpArrow: 38,
        LeftArrow: 37,
        RightArrow: 39,
    },
    Mouse: {
        Left: 1000,
        Right: 1001,
    }
};
class HELI {
    constructor() {
        this.scanlineOffset = 0;
        this.cnv = document.getElementById('myCanvas');
        this.ctx = this.cnv.getContext('2d');
        this.inputManager = new InputManager(this.cnv);
        this.activeScreen = new MenuScreen(this.ctx, this, this.inputManager);
    }
    init() {
        this.initialiseCanvases();
        AssetManager.loadSprites();
        AudioManager.initialise();
        setTimeout(() => {
            this.lastFrameTime = performance.now();
            window.requestAnimationFrame(() => { this.coreGameLoop(); });
        }, 250);
    }
    initialiseCanvases() {
        this.cnv.width = Constants.CANVAS_WIDTH;
        this.cnv.height = Constants.CANVAS_HEIGHT;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.fillStyle = Constants.COLORS.DRAW_COLOR;
        this.ctx.font = '' + 26 + "px '" + 'FONT_SPECTRUM' + "'";
        this.glfxSourceCanvas = document.getElementsByTagName('canvas')[0];
        this.glfxCanvas = fx.canvas();
        this.glfxTexture = this.glfxCanvas.texture(this.glfxSourceCanvas);
        // Hide the original 2D canvas and put the GLFX WebGL Canvas in its place
        this.glfxSourceCanvas.parentNode.insertBefore(this.glfxCanvas, this.glfxSourceCanvas);
        this.glfxSourceCanvas.style.display = 'none';
        this.glfxCanvas.className = this.glfxSourceCanvas.className;
        this.glfxCanvas.id = this.glfxSourceCanvas.id;
        this.glfxCanvas.style = 'height: 518px; width: 800px; border: 5px solid #606060; border-radius: 5px; box-shadow: 0px 0px 150px #444;';
        this.glfxSourceCanvas.id = 'old_' + this.glfxSourceCanvas.id;
    }
    clearCanvas() {
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = Constants.COLORS.NONE;
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
        this.ctx.globalAlpha = 1;
    }
    coreGameLoop() {
        this.clearCanvas();
        this.activeScreen.act();
        this.inputManager.clearInput();
        this.overdrawScanlines();
        this.applyGlfx();
        this.awaitNextFrame();
    }
    applyGlfx() {
        // Load the latest glfxSourceCanvas frame
        this.glfxTexture.loadContentsOf(this.glfxSourceCanvas);
        // Apply WebGL magic
        this.glfxCanvas.draw(this.glfxTexture)
            .brightnessContrast(0.125, 0.04)
            .noise(0.025)
            .bulgePinch(400, 256, 550, 0.065)
            .vignette(0.15, 0.625)
            .update();
    }
    switchScreen(appScreen) {
        this.activeScreen = appScreen;
    }
    overdrawScanlines() {
        this.scanlineOffset -= .5;
        let split = 8;
        if (this.scanlineOffset < -(split * 3)) {
            this.scanlineOffset += (split * 3);
        } // sure
        this.ctx.fillStyle = Constants.COLORS.SCANLINE_COLOR;
        this.ctx.globalAlpha = Constants.COLORS.SCANLINE_ALPHA;
        for (let i = 0; i <= 820 / split; ++i) {
            this.ctx.fillRect(0, this.scanlineOffset + i * split, Constants.CANVAS_WIDTH, 5);
        }
        this.ctx.globalAlpha = 1;
    }
    oneIn(x) {
        let n = Math.floor(Math.random() * x) + 1;
        return n === 1;
    }
    coinflip() {
        return this.oneIn(2);
    }
    awaitNextFrame() {
        window.requestAnimationFrame(() => { this.coreGameLoop(); });
    }
}
class InputManager {
    constructor(cnv) {
        this.cnv = cnv;
        this.mouse = new Point(0, 0);
        this.KB = new Map();
        this.KP = Constants.INPUT.None;
        this.attachListeners();
    }
    attachListeners() {
        window.onkeydown = (e) => {
            if (e.keyCode === Constants.INPUT.Keys.Alt) {
                e.preventDefault();
            }
            this.KB[e.keyCode] = true;
            this.KP = e.keyCode;
        };
        window.onkeyup = (e) => { this.KB[e.keyCode] = false; };
        this.cnv.addEventListener('mousedown', () => { this.KB['M1'] = true; this.KP = Constants.INPUT.Mouse.Left; }, false);
        this.cnv.addEventListener('mouseup', () => { this.KB['M1'] = false; }, false);
        this.cnv.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX - this.cnv.getBoundingClientRect().left;
            this.mouse.y = e.clientY - this.cnv.getBoundingClientRect().top;
        }, false);
        this.cnv.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.KB['M2'] = true;
            this.KP = Constants.INPUT.Mouse.Right;
        }, false);
    }
    clearInput() {
        this.KP = Constants.INPUT.None;
    }
}
class Debris extends WorldObject {
    constructor(x, y, levelModel) {
        super(levelModel, new Rect(x, y, 2, 2));
        this.sprites = ['debris'];
        this.vy = (Math.random() * 6) - 4;
        this.vx = (Math.random() * 8) - 4;
    }
    act() {
        this.hitbox.x += this.vx;
        this.hitbox.y += this.vy;
        if (this.hitbox.y > Constants.GROUND_HEIGHT) {
            this.hitbox.y = Constants.GROUND_HEIGHT - Math.abs(this.hitbox.y - Constants.GROUND_HEIGHT);
            this.vy = -this.vy * 0.8;
        }
        this.vy += Constants.GRAVITY;
        this.vx *= 0.9975;
    }
}
class Helipad extends WorldObject {
    constructor(x, y, levelModel) {
        super(levelModel, new Rect(x, y, 96, 8));
        this.safetyBox = new Rect(this.hitbox.x, this.hitbox.y - 10, this.hitbox.w, 8);
        this.sprites = ['helipad'];
    }
}
class Helper extends WorldObject {
    constructor(x, y, levelModel) {
        super(levelModel, new Rect(x, y, 100, 50));
        this.lifetime = 0;
        this.state = HelperEnum.Steer;
        // this.sprites = ['volcano'];
    }
    act() {
        if (this.state === HelperEnum.Steer) {
            this.hitbox.x = this.levelModel.player.hitbox.x - ((this.hitbox.w - this.levelModel.player.hitbox.w) / 2);
            this.hitbox.y = this.levelModel.player.hitbox.y - 32;
        }
        else if (this.state === HelperEnum.Winch) {
            this.hitbox.x = this.levelModel.player.hitbox.x - ((this.hitbox.w - this.levelModel.player.hitbox.w) / 2);
            this.hitbox.y = this.levelModel.player.hitbox.y;
        }
        else if (this.state === HelperEnum.Rescue) {
            this.hitbox.x = this.levelModel.helipad.hitbox.x + 16;
            this.hitbox.y = this.levelModel.helipad.hitbox.y - 32;
        }
        this.calculateSprites();
    }
    switchMessage(newState) {
        this.lifetime = 0;
        this.state = newState;
    }
    calculateSprites() {
        if (!this.levelModel.player.alive) {
            this.sprites = [];
        }
        this.lifetime++;
        if (this.lifetime < 240 && this.lifetime % 20 < 12) {
            if (this.state === HelperEnum.Steer) {
                this.sprites = ['help1'];
            }
            if (this.state === HelperEnum.Rescue) {
                this.sprites = ['help2'];
            }
            if (this.state === HelperEnum.Winch) {
                this.sprites = ['help3'];
            }
            if (this.state === HelperEnum.None) {
                this.sprites = [];
            }
        }
        else {
            this.sprites = [];
        }
        if (this.state === HelperEnum.Steer) {
            this.angle = this.levelModel.player.angle;
        }
        else {
            this.angle = 0;
        }
    }
}
var HelperEnum;
(function (HelperEnum) {
    HelperEnum[HelperEnum["Steer"] = 1] = "Steer";
    HelperEnum[HelperEnum["Rescue"] = 2] = "Rescue";
    HelperEnum[HelperEnum["Winch"] = 3] = "Winch";
    HelperEnum[HelperEnum["None"] = 4] = "None";
})(HelperEnum || (HelperEnum = {}));
class LevelModel {
    constructor() {
        this.w = Constants.CANVAS_WIDTH;
        this.h = Constants.CANVAS_HEIGHT;
        this.deaths = 0;
        this.saves = 0;
        this.timer = Constants.LEVEL_TIME;
        this.ms = 60;
        this.timerstring = '';
        this.firstPickup = true;
        this.inFlightWithoutWinch = true;
        this.state = GameState.Playing;
        this.player = new Player(40, 135, this);
        this.player.facing = DirEnum.Right;
        this.meteors = new Array();
        this.people = new Array();
        this.helipad = new Helipad(0, 150, this);
        this.volcano = new Volcano(300, Constants.GROUND_HEIGHT - 64, this);
        this.debris = new Array();
        this.helper = new Helper(50, 50, this);
        this.outcomes = new Array();
        for (let i = 0; i !== 3; ++i) {
            this.people.push(new Person(500 + Math.floor(Math.random() * 200), Constants.GROUND_HEIGHT - 16, this));
        }
    }
    act() {
        this.advanceTime();
        if (this.state === GameState.Playing || this.state === GameState.Dead) {
            this.allObjectsAct();
            if (this.state === GameState.Playing) {
                this.handleInteractions();
                this.checkHelpMessageTriggers();
            }
        }
    }
    // move element i of array a into array b
    switch(a, index, b) {
        b.push(a.splice(index, 1)[0]);
    }
    advanceTime() {
        if (this.state === GameState.Playing || this.state === GameState.Dead) {
            if (this.state === GameState.Dead) {
                return;
            }
            if (this.ms++ > 60) {
                if (this.timer === 0) {
                    this.ms = 60;
                    this.state = GameState.Victory;
                }
                else {
                    this.ms = 0;
                    this.timer = Math.max(0, --this.timer);
                }
            }
        }
        let frac = ((60 - this.ms) / 0.6) / 100;
        this.timerstring = (this.timer + frac).toFixed(2);
    }
    allObjectsAct() {
        if (this.player.alive) {
            this.player.act();
            this.player.hangers.forEach(h => h.act());
            this.helper.act();
        }
        this.people.forEach(p => p.act());
        this.volcano.act();
        this.meteors.forEach(m => { m.act(); });
        this.debris.forEach(m => m.act());
        this.meteors = this.meteors.filter(p => p.alive);
        this.people = this.people.filter(p => p.alive);
        if (this.people.length < 3) {
            this.people.push(new Person(830, Constants.GROUND_HEIGHT - 16, this));
        }
    }
    checkHelpMessageTriggers() {
        // if the player has taken off, and has flown over to the right of the map, and hasn't extended the winch yet
        if (this.player.hitbox.leftEdge() > Constants.CANVAS_WIDTH / 2) {
            if (this.inFlightWithoutWinch === true) {
                this.inFlightWithoutWinch = false;
                this.helper.switchMessage(HelperEnum.Winch);
            }
        }
        // if this player has used the winch already, don't instruct them about how to use it
        if (this.player.winchLength > 0 && this.helper.state === HelperEnum.Winch) {
            this.inFlightWithoutWinch = false;
            this.helper.switchMessage(HelperEnum.None);
        }
    }
    handleInteractions() {
        // meteor vs player and meteor vs person
        this.meteors.forEach(m => {
            if (m.hitbox.overlap(this.player.hitbox)) {
                if (this.player.alive) {
                    this.player.die();
                }
            }
            for (let i = 0; i !== this.player.hangers.length; ++i) {
                let p = this.player.hangers[i];
                if (p.hitbox.overlap(m.hitbox)) {
                    p.startFalling(this.player.vx, this.player.vy);
                    this.switch(this.player.hangers, i, this.people);
                    i--;
                }
            }
        });
        // test for hitting the winch on the helipad
        if (this.player.winch.overlap(this.helipad.hitbox)) {
            for (let i = 0; i !== this.player.hangers.length; ++i) {
                this.player.hangers[i].startFalling(this.player.vx, this.player.vy);
                this.switch(this.player.hangers, i, this.people);
                i--;
            }
            this.player.winchState = WinchStateEnum.Retracting;
        }
        // test for picking a person up
        for (let i = 0; i !== this.people.length; ++i) {
            if (this.player.hangers.length > 0 || !this.player.alive) {
                continue;
            }
            let p = this.people[i];
            if (p.state === BehaviourEnum.Leaving) {
                continue;
            }
            // successful pickup
            if (this.overlap(this.player.winch, p.hitbox)) {
                p.state = BehaviourEnum.Hanging;
                this.switch(this.people, i, this.player.hangers);
                i--;
                // if this is the player's first pickup, show the helper indicating where to take them
                if (this.firstPickup) {
                    this.firstPickup = false;
                    this.helper.switchMessage(HelperEnum.Rescue);
                }
            }
        }
        // person vs helipad
        for (let i = 0; i !== this.player.hangers.length; ++i) {
            let p = this.player.hangers[i];
            if (p.hitbox.overlap(this.helipad.hitbox)) {
                this.switch(this.player.hangers, i, this.people);
                p.die();
                i--;
                this.outcomes.push('killed_by_helipad');
            }
            else if (p.hitbox.overlap(this.helipad.safetyBox)) {
                p.state = BehaviourEnum.Leaving;
                p.hitbox.y = this.helipad.safetyBox.bottomEdge() - p.hitbox.h;
                this.switch(this.player.hangers, i, this.people);
                this.saves++;
                i--;
                this.outcomes.push('escaped');
            }
        }
    }
    overlap(a, b) {
        return (a.x + a.w > b.x && a.x < b.x + b.w && a.y + a.h > b.y && a.y < b.y + b.h);
    }
}
var GameState;
(function (GameState) {
    GameState[GameState["Playing"] = 1] = "Playing";
    GameState[GameState["Dead"] = 2] = "Dead";
    GameState[GameState["Victory"] = 3] = "Victory";
})(GameState || (GameState = {}));
class Meteor extends WorldObject {
    constructor(x, y, levelModel) {
        super(levelModel, new Rect(x, y, 8, 8));
        this.angle = 0;
        this.alive = true;
        this.hitbox.x += Math.floor(Math.random() * 12);
        if (Math.random() < .5) {
            this.sprites = ['meteor'];
        }
        else {
            this.sprites = ['meteor2'];
            this.hitbox.w = 12;
            this.hitbox.h = 12;
        }
        this.angularVelocity = Math.random() * 6 - 12;
        this.vx = Math.random() * 4;
        if (Math.random() < .5) {
            this.vx = -this.vx;
        }
        this.vy = -(Math.random() * 9 + 3);
    }
    act() {
        this.angle += this.angularVelocity;
        this.hitbox.x += this.vx;
        this.hitbox.y += this.vy;
        this.vy += Constants.GRAVITY;
        if (this.hitbox.y > Constants.GROUND_HEIGHT) {
            this.alive = false;
        }
    }
}
class Person extends WorldObject {
    constructor(x, y, levelModel) {
        super(levelModel, new Rect(x, y, 10, 16));
        this.lifetime = 0;
        this.hop = false;
        this.state = BehaviourEnum.Panicking;
        this.alive = true;
        this.animationTimer = 0;
        this.animationFrames = 5;
        this.sprites = ['person'];
    }
    act() {
        // reset our y-position if last frame was a hop frame
        if (this.hop) {
            this.hitbox.y += 2;
            this.hop = false;
        }
        // has person been rescued and moved off the left side of the playarea?
        if (this.state === BehaviourEnum.Leaving && this.hitbox.x < -20) {
            this.alive = false;
            return;
        }
        if (this.state === BehaviourEnum.Panicking) {
            // randomly swap direction of travel
            if (Math.random() < .025) {
                this.facing = (this.facing === DirEnum.Left) ? DirEnum.Right : DirEnum.Left;
            }
            // hack to stop them walking too near the volcano or off the right side of the screen
            if (this.hitbox.x < 440) {
                this.facing = DirEnum.Right;
            }
            else if (this.hitbox.x > 750) {
                this.facing = DirEnum.Left;
            }
            // move jerkily
            if (Math.random() < .4) {
                this.hitbox.x += (this.facing === DirEnum.Left) ? -2 : 2;
            }
        }
        else if (this.state === BehaviourEnum.Leaving) {
            this.hitbox.x -= 1;
        }
        if (this.state === BehaviourEnum.Falling) {
            this.vy += 0.05;
            this.hitbox.x += this.vx;
            this.hitbox.y += this.vy;
            if (this.hitbox.y + this.hitbox.h > Constants.GROUND_HEIGHT) {
                this.hitbox.y = Constants.GROUND_HEIGHT - this.hitbox.h;
                this.die();
                this.levelModel.outcomes.push('killed_by_falling');
            }
        }
        // roll to see if this is a hop frame, move y-position up a little bit if it is
        if (Math.random() < .05) {
            this.hop = true;
            this.hitbox.y -= 2;
        }
        this.calculateSprites();
    }
    calculateSprites() {
        if (this.state === BehaviourEnum.Panicking || this.state === BehaviourEnum.Leaving) {
            this.sprites = ['person'];
        }
        else if (this.state === BehaviourEnum.Falling) {
            this.animationTimer++;
            if (this.animationTimer === this.animationFrames) {
                this.sprites = ['person_fall_' + (Math.floor(Math.random() * 2) + 1)];
                this.animationTimer = 0;
            }
        }
        else if (this.state === BehaviourEnum.Hanging) {
            console.log('this');
            this.sprites = ['person_hang'];
        }
    }
    startFalling(vx, vy) {
        this.state = BehaviourEnum.Falling;
        this.vx = vx * 0.65;
        this.vy = vy * 0.65;
    }
    die() {
        if (!this.alive) {
            return;
        } // don't die twice
        this.alive = false;
        this.levelModel.deaths++;
        for (let i = 0; i !== 25; ++i) {
            let p = this.hitbox.randomPointWithin();
            let d = new Debris(p.x, p.y, this.levelModel);
            d.vx += Math.random() * (this.vx / 2);
            d.vy += Math.random() * (this.vy / 2);
            this.levelModel.debris.push(d);
        }
    }
}
var BehaviourEnum;
(function (BehaviourEnum) {
    BehaviourEnum[BehaviourEnum["Panicking"] = 1] = "Panicking";
    BehaviourEnum[BehaviourEnum["Leaving"] = 2] = "Leaving";
    BehaviourEnum[BehaviourEnum["Falling"] = 3] = "Falling";
    BehaviourEnum[BehaviourEnum["Hanging"] = 4] = "Hanging";
})(BehaviourEnum || (BehaviourEnum = {}));
class Player extends WorldObject {
    constructor(x, y, levelModel) {
        super(levelModel, new Rect(x, y, 32, 16));
        this.lifetime = 0;
        this.winchLength = 0;
        this.winchState = WinchStateEnum.Retracting;
        this.alive = true;
        this.hangers = new Array();
        this.winch = new Rect(2, 2, 2, 2);
        this.repositionWinch();
    }
    applyImpulse(dir) {
        if (dir === 'L') {
            this.vx -= Constants.X_IMPULSE;
        }
        else if (dir === 'R') {
            this.vx += Constants.X_IMPULSE;
        }
        else if (dir === 'U') {
            this.vy -= Constants.Y_IMPULSE;
        }
        else if (dir === 'D') {
            this.vy += Constants.Y_IMPULSE / 2;
        }
    }
    die() {
        // TODO: surely we don't need to effectively say the same thing here twice
        this.alive = false;
        this.levelModel.state = GameState.Dead;
        for (let i = 0; i !== 25; ++i) {
            let p = this.hitbox.randomPointWithin();
            let d = new Debris(p.x, p.y, this.levelModel);
            d.vx += Math.random() * (this.vx / 2);
            d.vy += Math.random() * (this.vy / 2);
            this.levelModel.debris.push(d);
        }
        for (let i = 0; i !== this.hangers.length; ++i) {
            if (this.hangers[i]) {
                this.hangers[i].startFalling(this.vx, this.vy);
                this.levelModel.people.push(this.hangers[i]);
                this.hangers.splice(i, 1);
                i--;
            }
        }
    }
    act() {
        // handle extension or retraction of winch
        if (this.winchState === WinchStateEnum.Extending) {
            this.winchLength = Math.min(Constants.WINCH_LENGTH, this.winchLength += Constants.WINCH_SPEED);
        }
        else {
            this.winchLength = Math.max(0, this.winchLength -= Constants.WINCH_SPEED);
        }
        this.vx *= Constants.DRAG;
        this.vy += Constants.GRAVITY;
        let testHitbox = new Rect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);
        testHitbox.y += this.vy;
        if (testHitbox.overlap(this.levelModel.helipad.hitbox)) {
            testHitbox.alignTop(this.levelModel.helipad.hitbox);
            this.hitbox = testHitbox;
            this.vy = 0;
        }
        else {
            this.hitbox = testHitbox;
            this.hitbox.x += this.vx;
        }
        if (testHitbox.y + testHitbox.h > Constants.GROUND_HEIGHT) {
            if (this.vy > 3 || Math.abs(this.vx) > 2) {
                this.die();
            }
            else {
                testHitbox.y = Constants.GROUND_HEIGHT - testHitbox.h;
                this.vy = 0;
                this.vx = 0;
                this.hitbox = testHitbox;
            }
        }
        if (this.hitbox.x < 0 || this.hitbox.x + this.hitbox.w > 800) {
            this.die();
        }
        for (let i = 0; i !== this.levelModel.people.length; ++i) {
            if (this.levelModel.people[i].hitbox.overlap(this.hitbox)) {
                this.levelModel.people[i].die();
                this.levelModel.outcomes.push('killed_by_helicopter');
            }
        }
        for (let i = 0; i !== this.hangers.length; ++i) {
            if (this.hangers[i].hitbox.overlap(this.hitbox)) {
                this.hangers[i].startFalling(this.vx, this.vy);
                this.levelModel.switch(this.hangers, i, this.levelModel.people);
                i--;
            }
        }
        this.repositionWinch();
        if (this.vx > 0) {
            this.facing = DirEnum.Right;
        }
        if (this.vx < 0) {
            this.facing = DirEnum.Left;
        }
        this.calculateSprites();
    }
    toggleWinch() {
        if (this.winchState === WinchStateEnum.Extending) {
            this.winchState = WinchStateEnum.Retracting;
        }
        else {
            this.winchState = WinchStateEnum.Extending;
        }
    }
    // TODO: rewrite this so it is not terrible
    repositionWinch() {
        // set position of winch hitbox relative to helicopter
        this.winch.x = this.hitbox.x + ((this.facing === DirEnum.Left) ? 12 : 24),
            this.winch.y = this.hitbox.y + Constants.WINCH_Y_OFFSET + this.winchLength;
        // don't let winch go lower than ground
        if (this.winch.bottomEdge() > Constants.GROUND_HEIGHT) {
            this.winchLength -= (this.winch.bottomEdge() - Constants.GROUND_HEIGHT);
        }
        if (this.hangers[0]) {
            if (this.winch.y + Constants.PERSON_HEIGHT > Constants.GROUND_HEIGHT) {
                this.winch.y = Constants.GROUND_HEIGHT - Constants.PERSON_HEIGHT;
            }
        }
        // reposition the person hanging from the winch (if there is one)
        for (let i = 0; i !== this.hangers.length; ++i) {
            let p = this.hangers[i];
            p.hitbox.x = this.winch.x - 3;
            p.hitbox.y = this.winch.y + this.winch.h + 2;
        }
    }
    calculateSprites() {
        this.lifetime++;
        this.sprites =
            (this.facing === DirEnum.Left) ?
                (this.lifetime % 4 <= 1) ? ['heli_l_1'] : ['heli_l_2'] :
                (this.lifetime % 4 <= 1) ? ['heli_r_1'] : ['heli_r_2'];
        this.angle = 0 + (this.vx * 2.5);
    }
}
var WinchStateEnum;
(function (WinchStateEnum) {
    WinchStateEnum[WinchStateEnum["Retracting"] = 1] = "Retracting";
    WinchStateEnum[WinchStateEnum["Extending"] = 2] = "Extending";
})(WinchStateEnum || (WinchStateEnum = {}));
class Point {
    constructor(x, y) {
        Object.assign(this, { x, y });
    }
    plusEquals(that) {
        this.x += that.x;
        this.y += that.y;
    }
    minusEquals(that) {
        this.x -= that.x;
        this.y -= that.y;
    }
    timesEquals(that) {
        if (that.x && that.y) {
            this.x *= that.x;
            this.y *= that.y;
        }
        else {
            this.x *= that.x;
            this.y *= that.y;
        }
    }
    divideEquals(that) {
        if (that.x && that.y) {
            this.x /= that.x;
            this.y /= that.y;
        }
        else {
            this.x /= that.x;
            this.y /= that.y;
        }
    }
    equals(that) {
        return (this.x === that.x && this.y === that.y);
    }
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }
}
class Rect {
    constructor(x, y, w, h) {
        Object.assign(this, { x, y, w, h });
    }
    leftEdge() { return this.x; }
    rightEdge() { return this.x + this.w; }
    topEdge() { return this.y; }
    bottomEdge() { return this.y + this.h; }
    alignLeft(a) { this.x = a.x - this.w; }
    alignRight(a) { this.x = a.x + a.w; }
    alignTop(a) { this.y = a.y - this.h; }
    alignBottom(a) { this.y = a.y + a.h; }
    overlap(b) {
        return (this.x + this.w > b.x && this.x < b.x + b.w && this.y + this.h > b.y && this.y < b.y + b.h);
    }
    randomPointWithin() {
        return new Point(this.x + Math.floor(Math.random() * this.w), this.y + Math.floor(Math.random() * this.h));
    }
}
class Volcano extends WorldObject {
    constructor(x, y, levelModel) {
        super(levelModel, new Rect(x, y, 128, 64));
        this.explodeTimer = 90 + Math.floor(Math.random() * 61);
        this.sprites = ['volcano'];
    }
    act() {
        this.explodeTimer--;
        if (this.explodeTimer === 0) {
            this.explodeTimer = 90 + Math.floor(Math.random() * 61);
            this.explode();
        }
    }
    explode() {
        for (let i = 0; i < 3 + Math.floor(Math.random() * 2); ++i) {
            let m = new Meteor(this.hitbox.x + this.hitbox.w / 2, this.hitbox.y, this.levelModel);
            this.levelModel.meteors.push(m);
        }
    }
}
class LevelScreen {
    constructor(ctx, heli, inputManager) {
        Object.assign(this, { ctx, heli });
        this.model = new LevelModel();
        this.view = new LevelView(ctx, this.model);
        this.controller = new LevelController(inputManager, heli, this.model, this.ctx);
    }
    act() {
        this.controller.handleInput();
        this.model.act();
        this.view.draw();
    }
}
class MenuScreen {
    constructor(ctx, heli, inputManager) {
        Object.assign(this, { ctx, heli });
        this.model = null;
        this.view = new MenuView(ctx);
        this.controller = new MenuController(inputManager, heli, ctx);
    }
    act() {
        this.controller.handleInput();
        // this.model.act();
        this.view.draw();
    }
}
class LevelView {
    constructor(ctx, levelModel) {
        this.postGameTimer = 0;
        Object.assign(this, { ctx, levelModel });
    }
    draw() {
        this.ctx.fillStyle = Constants.COLORS.DRAW_COLOR;
        if (this.levelModel.player.alive) {
            this.drawActor(this.levelModel.player);
            this.ctx.fillRect(this.levelModel.player.winch.x, this.levelModel.player.hitbox.y + Constants.WINCH_Y_OFFSET, 2, this.levelModel.player.winchLength);
            this.drawActor(this.levelModel.helper);
        }
        this.drawActorArray(this.levelModel.player.hangers);
        this.drawActor(this.levelModel.volcano);
        this.drawActor(this.levelModel.helipad);
        this.drawActorArray(this.levelModel.people);
        this.drawActorArray(this.levelModel.debris);
        this.drawActorArray(this.levelModel.meteors);
        this.ctx.fillRect(0, Constants.GROUND_HEIGHT, 800, 1);
        this.drawIngameOverlay();
        if (this.levelModel.state === GameState.Victory || this.levelModel.state === GameState.Dead) {
            this.postGameTimer++;
            this.drawPostgameOverlay();
        }
    }
    drawIngameOverlay() {
        for (let i = 0; i !== this.levelModel.saves; ++i) {
            this.ctx.drawImage(AssetManager.getSprite('saved'), 780, 4 + i * 20);
        }
        for (let i = 0; i !== this.levelModel.deaths; ++i) {
            this.ctx.drawImage(AssetManager.getSprite('death'), 760, 4 + i * 20);
        }
        this.ctx.textAlign = 'center';
        this.ctx.font = '' + 24 + "px '" + 'FONT_SPECTRUM' + "'";
        this.ctx.fillText(this.levelModel.timerstring, Constants.CANVAS_WIDTH / 2, 40);
        this.ctx.textAlign = 'left';
    }
    drawPostgameOverlay() {
        this.ctx.textAlign = 'center';
        // after one second draw the win/lose text
        if (this.postGameTimer > 60) {
            this.ctx.font = '' + 36 + "px '" + 'FONT_SPECTRUM' + "'";
            if (this.postGameTimer > 75 || this.postGameTimer % 4 <= 1) {
                this.ctx.fillText((this.levelModel.state === GameState.Victory ? 'TIME OVER' : 'CRASH AND BURN'), Constants.CANVAS_WIDTH / 2, 180);
            }
        }
        // after two seconds, start listing the player's rescues/deaths in order
        if (this.postGameTimer > 120) {
            this.ctx.textAlign = 'start';
            // how many things should we draw at this point in time
            let fills = Math.floor((this.postGameTimer - 120) / Constants.LIST_OUTCOME_DELAY);
            if (fills >= this.levelModel.outcomes.length) {
                fills = this.levelModel.outcomes.length;
            }
            // figure out where on the left we should start drawing from to make the whole list centred
            let x = (Constants.CANVAS_WIDTH / 2) - (fills * Constants.OUTCOME_SPRITE_WIDTH) / 2;
            for (let i = 0; i !== fills; ++i) {
                let o = this.levelModel.outcomes[i];
                let sprite = '';
                if (o === 'killed_by_helicopter') {
                    sprite = 'death';
                }
                if (o === 'escaped') {
                    sprite = 'saved';
                }
                if (o === 'killed_by_falling') {
                    sprite = 'death';
                }
                if (o === 'killed_by_helipad') {
                    sprite = 'death';
                }
                this.ctx.drawImage(AssetManager.getSprite(sprite), x + (i * Constants.OUTCOME_SPRITE_WIDTH), 240);
            }
        }
        if (this.postGameTimer > 180) {
            if (this.postGameTimer > 195 || this.postGameTimer % 4 <= 1) {
                this.ctx.font = '' + 16 + "px '" + 'FONT_SPECTRUM' + "'";
                this.ctx.textAlign = 'center';
                this.ctx.fillText('PRESS ESCAPE TO RETURN TO MENU', Constants.CANVAS_WIDTH / 2, 350);
            }
        }
    }
    drawActorArray(arr) {
        for (let i = 0; i !== arr.length; ++i) {
            let wa = arr[i];
            // crude hack to make offscreen indicators not get pushed off the top of the canvas by the bulge effect
            if (wa instanceof Meteor && wa.hitbox.bottomEdge() < 0) {
                let centreOffset = Math.abs((wa.hitbox.x + wa.hitbox.w / 2) - (Constants.CANVAS_WIDTH / 2));
                let yBump = Math.floor((400 - centreOffset) / 50);
                this.ctx.drawImage(AssetManager.getSprite('arrow_tag'), wa.hitbox.x, 4 + yBump);
            }
            else {
                this.drawActor(wa);
            }
        }
    }
    drawActor(wa) {
        let screenPosition = wa.getScreenPosition();
        for (let i = 0; i !== wa.sprites.length; ++i) {
            let sprite = AssetManager.getSprite(wa.sprites[i]);
            if (wa.angle) {
                this.ctx.save();
                this.ctx.translate(screenPosition.x + wa.hitbox.w / 2, screenPosition.y + wa.hitbox.h / 2);
                this.ctx.rotate(wa.angle * (Math.PI / 180));
                this.ctx.translate(-(screenPosition.x + wa.hitbox.w / 2), -(screenPosition.y + wa.hitbox.h / 2));
                this.ctx.drawImage(sprite, screenPosition.x, screenPosition.y);
                this.ctx.restore();
            }
            else {
                this.ctx.drawImage(sprite, screenPosition.x, screenPosition.y);
            }
        }
    }
}
class MenuView {
    constructor(ctx) {
        this.timer = 0;
        Object.assign(this, { ctx });
    }
    draw() {
        this.timer++;
        this.ctx.fillStyle = Constants.COLORS.DRAW_COLOR;
        this.ctx.textAlign = 'center';
        this.ctx.font = '' + 48 + "px '" + 'FONT_SPECTRUM' + "'";
        this.ctx.fillText('V O L C A N O', 400, 150);
        this.ctx.fillText('H E L I C O P T E R', 400, 200);
        this.ctx.fillText('R E S C U E', 400, 250);
        if (this.timer > 60) {
            if (this.timer > 75 || this.timer % 4 <= 1) {
                this.ctx.font = '' + 24 + "px '" + 'FONT_SPECTRUM' + "'";
                this.ctx.fillText('-  PRESS SPACE TO START -', 400, 350);
            }
        }
        this.ctx.textAlign = 'left';
    }
}
