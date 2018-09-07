class WorldObject {
    public sprites: Array<string>;
    public hitbox: Rect;
    public levelModel: LevelModel;
    public facing = DirEnum.Left;
    public angle: number;
    public angularVelocity: number;

    public vx = 0;
    public vy = 0;

    public deleteMe: boolean;

    constructor(levelModel: LevelModel, hitbox: Rect) {
        Object.assign(this, {levelModel, hitbox});
    }

    public act(): void {}
    public calculateSprites(): void {}

    public getScreenPosition(): Point {
        return new Point(this.hitbox.x, this.hitbox.y);
    }
}

enum DirEnum {
    Left = 1,
    Right = 2
}
