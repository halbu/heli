class LevelModel {
    public w = Constants.CANVAS_WIDTH;
    public h = Constants.CANVAS_HEIGHT;
    
    public player: Player;
    public people: Array<Person>;
    public meteors: Array<Meteor>;
    public volcano: Volcano;
    public helipad: Helipad;
    public helper: Helper;
    public debris: Array<Debris>;

    public deaths = 0;
    public saves = 0;
    public timer = Constants.LEVEL_TIME;
    public ms = 60;
    public timerstring = '';
    public firstPickup = true;
    public inFlightWithoutWinch = true;

    public state = GameState.Playing;
    public outcomes: Array<string>;

    constructor() {
        this.player = new Player(40, 135, this);
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

    // move element i of array a into array b
    public switch<T>(a: Array<T>, index: number, b: Array<T>): void {
        b.push(a.splice(index, 1)[0]);
    }

    public advanceTime(): void {
        if (this.state === GameState.Playing || this.state === GameState.Dead) {
            if (this.state === GameState.Dead) { return; }
            if (this.ms++ > 60) {
                if (this.timer === 0) {
                    this.ms = 60;
                    this.state = GameState.Victory;
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
            if (this.player.hangers.length > 0 || !this.player.alive) { continue; }
            let p = this.people[i];
            if (p.state === BehaviourEnum.Leaving) { continue; }

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
            } else if (p.hitbox.overlap(this.helipad.safetyBox)) {
                p.state = BehaviourEnum.Leaving;
                p.hitbox.y = this.helipad.safetyBox.bottomEdge() - p.hitbox.h;
                this.switch(this.player.hangers, i, this.people);
                this.saves++;
                i--;
                this.outcomes.push('escaped');
            }
        }
    }
    
    protected overlap(a: Rect, b: Rect): boolean {
        return (a.x + a.w > b.x && a.x < b.x + b.w && a.y + a.h > b.y && a.y < b.y + b.h);
    }
}

enum GameState {
    Playing = 1,
    Dead = 2,
    Victory = 3
}
