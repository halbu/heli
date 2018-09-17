class Person extends WorldObject {
    public lifetime = 0;
    public hop = false;
    public state = BehaviourEnum.Panicking;
    public alive = true;

    public animationTimer = 0;
    public animationFrames = 5;

    constructor(x: number, y: number, levelModel: LevelModel) {
        super(levelModel, new Rect(x, y, 10, 16));
        this.sprites = ['person'];
    }

    public act(): void {
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
            if (this.hitbox.x < Constants.PERSON_LEFTMOST_WALK_POINT) {
                this.facing = DirEnum.Right;
            } else if (this.hitbox.x > Constants.PERSON_RIGHTMOST_WALK_POINT) {
                this.facing = DirEnum.Left;
            }

            // move jerkily
            if (Math.random() < .4) {
                this.hitbox.x += (this.facing === DirEnum.Left) ? -2 : 2;
            }
        } else if (this.state === BehaviourEnum.Leaving) {
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

     public calculateSprites(): void {
        if (this.state === BehaviourEnum.Panicking || this.state === BehaviourEnum.Leaving) {
            this.sprites = ['person'];
        } else if (this.state === BehaviourEnum.Falling) {
            this.animationTimer++;
            if (this.animationTimer === this.animationFrames) {
                this.sprites = ['person_fall_' + (Math.floor(Math.random() * 2) + 1)];
                this.animationTimer = 0;
            }
        } else if (this.state === BehaviourEnum.Hanging) {
            this.sprites = ['person_hang'];
        }
    }

    public startFalling(vx: number, vy: number): void {
        this.state = BehaviourEnum.Falling;
        this.vx = vx * 0.65;
        this.vy = vy * 0.65;
    }

    public die(): void {
        if (!this.alive) { return; } // don't die twice
        this.alive = false;
        this.levelModel.kills++;
        for (let i = 0; i !== 25; ++i) {
            let p = this.hitbox.randomPointWithin();
            let d = new Debris(p.x, p.y, this.levelModel);
            d.vx += Math.random() * (this.vx / 2);
            d.vy += Math.random() * (this.vy / 2);
            this.levelModel.debris.push(d);
        }
    }
}

enum BehaviourEnum {
    Panicking = 1,
    Leaving = 2,
    Falling = 3,
    Hanging = 4
}
