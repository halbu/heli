class Debris extends WorldObject {
    constructor(x: number, y: number, levelModel: LevelModel) {
        super(levelModel, new Rect(x, y, 2, 2));  
        this.sprites = ['debris'];      
        this.vy = (Math.random() * 6) - 4; 
        this.vx = (Math.random() * 8) - 4;
    }

    public act(): void {
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
