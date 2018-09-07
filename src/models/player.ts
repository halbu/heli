class Player extends WorldObject {
    public lifetime = 0;

    public winch: Rect;
    public winchLength = 0;
    public winchState = WinchStateEnum.Retracting;

    public hangers: Array<Person>;
    public alive = true;

    constructor(x: number, y: number, levelModel: LevelModel) {
        super(levelModel, new Rect(x, y, 32, 16));
        this.hangers = new Array<Person>();
        this.winch = new Rect(2, 2, 2, 2);
        this.repositionWinch();
    }

    public applyImpulse(dir: string): void {
        if (dir === 'L') {
            this.vx -= Constants.X_IMPULSE;
        } else if (dir === 'R') {
            this.vx += Constants.X_IMPULSE;
        } else if (dir === 'U') {
            this.vy -= Constants.Y_IMPULSE;
        } else if (dir === 'D') {
            this.vy += Constants.Y_IMPULSE / 2;
        }
    }

    public die(): void {
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

    public act(): void {
        // handle extension or retraction of winch
        if (this.winchState === WinchStateEnum.Extending) {
            this.winchLength = Math.min(Constants.WINCH_LENGTH, this.winchLength += Constants.WINCH_SPEED);
        } else {
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
        } else {
            this.hitbox = testHitbox;
            this.hitbox.x += this.vx;
        }

        if (testHitbox.y + testHitbox.h > Constants.GROUND_HEIGHT) {
            if (this.vy > 3 || Math.abs(this.vx) > 2) {
                this.die();
            } else {
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

        if (this.vx > 0) { this.facing = DirEnum.Right; }
        if (this.vx < 0) { this.facing = DirEnum.Left; }

        this.calculateSprites();
    }

    public toggleWinch(): void {
        if (this.winchState === WinchStateEnum.Extending) {
            this.winchState = WinchStateEnum.Retracting;
        } else {this.winchState = WinchStateEnum.Extending; }
    }

    // TODO: rewrite this so it is not terrible
    public repositionWinch(): void {
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

    public calculateSprites(): void {
        this.lifetime++;
        this.sprites =
            (this.facing === DirEnum.Left) ?    
                (this.lifetime % 4 <= 1) ? ['heli_l_1'] : ['heli_l_2'] :
                (this.lifetime % 4 <= 1) ? ['heli_r_1'] : ['heli_r_2'];

        this.angle = 0 + (this.vx * 2.5);
    }
}

enum WinchStateEnum {
    Retracting = 1,
    Extending = 2
}
