class Volcano extends WorldObject {
    public explodeTimer = 90 + Math.floor(Math.random() * 61);

    constructor(x: number, y: number, levelModel: LevelModel) {
        super(levelModel, new Rect(x, y, 128, 64));
        this.sprites = ['volcano'];
    }

    public act(): void {
        this.explodeTimer--;
        if (this.explodeTimer === 0) {
            this.explodeTimer = 90 + Math.floor(Math.random() * 61);
            this.explode();
        }
    }

    public explode(): void {
        for (let i = 0; i < 3 + Math.floor(Math.random() * 2); ++i) {
            let m = new Meteor(this.hitbox.x + this.hitbox.w / 2, this.hitbox.y, this.levelModel);
            this.levelModel.meteors.push(m);
        }
    }
}
