class Helipad extends WorldObject {

    public safetyBox: Rect;
    constructor(x: number, y: number, levelModel: LevelModel) {
        super(levelModel, new Rect(x, y, 96, 8));
        this.safetyBox = new Rect(this.hitbox.x, this.hitbox.y - 10, this.hitbox.w, 8);
        this.sprites = ['helipad'];
    }
}
