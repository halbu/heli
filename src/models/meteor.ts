class Meteor extends WorldObject {
    public angle = 0;
    public angularVelocity: number;

    public vx: number;
    public vy: number;
    public alive = true;

    constructor(x: number, y: number, levelModel: LevelModel) {
        super(levelModel, new Rect(x, y, 8, 8));
        this.hitbox.x += Math.floor(Math.random() * 12);

        if (Math.random () < .5) {
            this.sprites = ['meteor'];
        } else {
            this.sprites = ['meteor2'];
            this.hitbox.w = 12;
            this.hitbox.h = 12;
        }
        this.angularVelocity = Math.random() * 6 - 12;
        this.vx = Math.random() * 4;
        if (Math.random() < .5) { this.vx = -this.vx; }
        this.vy = -(Math.random() * 9 + 3);
    }

    public act(): void {
        this.angle += this.angularVelocity;
        this.hitbox.x += this.vx;
        this.hitbox.y += this.vy;
        this.vy += Constants.GRAVITY;
        if (this.hitbox.y > Constants.GROUND_HEIGHT) {
            this.alive = false;
        }
    }
}
