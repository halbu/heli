class LevelModel implements IModel {
    public w = Constants.CANVAS_WIDTH;
    public h = Constants.CANVAS_HEIGHT;
    
    public player: Player;
    public people: Array<Person>;
    public meteors: Array<Meteor>;
    public volcano: Volcano;
    public helipad: Helipad;
    public helper: Helper;
    public debris: Array<Debris>;

    public kills = 0;
    public saves = 0;
    public timer = Constants.LEVEL_TIME;
    public ms = 60;
    public timerstring = '';
    public firstPickup = true;
    public inFlightWithoutWinch = true;

    public state = GameState.Playing;
    public outcomes: Array<string>;

    constructor() {
        this.player = new Player(50, 135, this);
        this.player.facing = DirEnum.Right;
        this.meteors = new Array<Meteor>();
        this.people = new Array<Person>();
        this.helipad = new Helipad(0, 150, this);
        this.volcano = new Volcano(300, Constants.GROUND_HEIGHT - 64, this);
        this.debris = new Array<Debris>();
        this.helper = new Helper(50, 50, this);
        this.outcomes = new Array<string>();

        for (let i = 0; i !== 3; ++i) {
            this.people.push(
                new Person(500 + Math.floor(Math.random() * 200), Constants.GROUND_HEIGHT - 16, this)
            );
        }
    }

    public act(): void {
        this.advanceTime();

        if (this.state === GameState.Playing || this.state === GameState.Dead) {
            this.allObjectsAct();
            if (this.state === GameState.Playing) {
                this.handleInteractions();
                this.checkHelpMessageTriggers();
            }
        }
    }

    public processGameEnd(): void {
        let mostHeroic = JSON.parse(PersistenceManager.retrieve('hiScoreMostHeroic'));
        if (this.saves > mostHeroic.saves) {
            PersistenceManager.store('hiScoreMostHeroic', JSON.stringify({saves: this.saves, kills: this.kills}));
        }
        
        let mostMurderous = JSON.parse(PersistenceManager.retrieve('hiScoreMostMurderous'));
        if (this.kills > mostMurderous.kills) {
            PersistenceManager.store('hiScoreMostMurderous', JSON.stringify({saves: this.saves, kills: this.kills}));
        }
        
        let bestOverall = JSON.parse(PersistenceManager.retrieve('hiScoreBestOverall'));
        if ((this.saves - this.kills) > (bestOverall.saves - bestOverall.kills)) {
            PersistenceManager.store('hiScoreBestOverall', JSON.stringify({saves: this.saves, kills: this.kills}));
        }
    }

    public advanceTime(): void {
        if (this.state === GameState.Playing || this.state === GameState.Dead) {
            if (this.state === GameState.Dead) { return; }
            if (this.ms++ > 60) {
                if (this.timer === 0) {
                    this.ms = 60;
                    if (this.state === GameState.Playing) {
                        this.processGameEnd();
                        this.state = GameState.Victory;
                    }
                } else {
                    this.ms = 0;
                    this.timer = Math.max(0, --this.timer);
                }
            }
        }
        let frac = ((60 - this.ms) / 0.6) / 100;
        this.timerstring = (this.timer + frac).toFixed(2); 
    }

    public allObjectsAct(): void {
        if (this.player.alive) {
            this.player.act();
            if (this.player.hanger) { this.player.hanger.act(); }
            this.helper.act();
        }
        this.people.forEach(p => p.act());
        this.volcano.act();
        this.meteors.forEach(m => { m.act(); });
        this.debris.forEach(m => m.act());

        this.meteors = this.meteors.filter(p => p.alive);
        this.people = this.people.filter(p => p.alive);
        
        if (this.people.length < 3) {
            this.people.push(new Person(Constants.CANVAS_WIDTH + 30, Constants.GROUND_HEIGHT - 16, this));
        }
    }

    public checkHelpMessageTriggers(): void {
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

    public handleInteractions(): void {
        // meteor vs player and meteor vs person
        this.meteors.forEach(m => {
            if (m.hitbox.overlap(this.player.hitbox)) {
                if (this.player.alive) { this.player.die(); }
            }

            if (this.player.hanger && this.player.hanger.hitbox.overlap(m.hitbox)) {
                this.player.hanger.startFalling(this.player.vx, this.player.vy);
                this.people.push(this.player.hanger);
                this.player.hanger = null;
            }
        });

        // test for hitting the winch on the helipad
        if (this.player.winchArea().overlap(this.helipad.hitbox)) {
            if (this.player.hanger) {
                this.player.hanger.startFalling(this.player.vx, this.player.vy);
                this.people.push(this.player.hanger);
                this.player.hanger = null;
            }
            this.player.winchState = WinchStateEnum.Retracting;
        }

        // test for picking a person up
        for (let i = 0; i !== this.people.length; ++i) {
            if (this.player.hanger || !this.player.alive) { continue; }
            let p = this.people[i];
            if (p.state === BehaviourEnum.Leaving) { continue; }

            // successful pickup
            if (this.player.winch.overlap(p.hitbox)) {
                p.state = BehaviourEnum.Hanging;
                this.player.hanger = p;
                this.people.splice(i, 1);
                i--;

                // if this is the player's first pickup, show the helper indicating where to take them
                if (this.firstPickup) {
                    this.firstPickup = false;
                    this.helper.switchMessage(HelperEnum.Rescue);
                }
            }
        }

        // person vs helipad
        if (this.player.hanger) {
            if (this.player.hanger.hitbox.overlap(this.helipad.hitbox)) {
                this.player.hanger.die();
                this.player.hanger = null;
                this.outcomes.push('killed_by_helipad');
            } else if (this.player.hanger.hitbox.overlap(this.helipad.safetyBox)) {
                this.player.hanger.state = BehaviourEnum.Leaving;
                this.player.hanger.hitbox.y = this.helipad.safetyBox.bottomEdge() - this.player.hanger.hitbox.h;
                this.people.push(this.player.hanger);
                this.player.hanger = null;
                this.saves++;
                this.outcomes.push('escaped');
            }
        }
    }
}

enum GameState {
    Playing = 1,
    Dead = 2,
    Victory = 3
}
