class Helper extends WorldObject {
    public lifetime = 0;
    public state = HelperEnum.Steer;

    constructor(x: number, y: number, levelModel: LevelModel) {
        super(levelModel, new Rect(x, y, 100, 50));
        // this.sprites = ['volcano'];
    }

    public act(): void {
        if (this.state === HelperEnum.Steer) {
            this.hitbox.x = this.levelModel.player.hitbox.x - ((this.hitbox.w - this.levelModel.player.hitbox.w) / 2);
            this.hitbox.y = this.levelModel.player.hitbox.y - 32;
        } else if (this.state === HelperEnum.Winch) {
            this.hitbox.x = this.levelModel.player.hitbox.x - ((this.hitbox.w - this.levelModel.player.hitbox.w) / 2);
            this.hitbox.y = this.levelModel.player.hitbox.y;
        } else if (this.state === HelperEnum.Rescue) {
            this.hitbox.x = this.levelModel.helipad.hitbox.x + 16;
            this.hitbox.y = this.levelModel.helipad.hitbox.y - 32;
        }
        this.calculateSprites();
    }

    public switchMessage(newState: HelperEnum): void {
        this.lifetime = 0;
        this.state = newState;
    }

    public calculateSprites(): void {
        if (!this.levelModel.player.alive) { this.sprites = []; }

        this.lifetime++;

        if (this.lifetime < 240 && this.lifetime % 20 < 12) {
            if (this.state === HelperEnum.Steer) { this.sprites = ['help1']; }
            if (this.state === HelperEnum.Rescue) { this.sprites = ['help2']; }
            if (this.state === HelperEnum.Winch) { this.sprites = ['help3']; }
            if (this.state === HelperEnum.None) { this.sprites = []; }
        } else { this.sprites = []; }

        if (this.state === HelperEnum.Steer) {
            this.angle = this.levelModel.player.angle;
        } else { this.angle = 0; }
    }
}

enum HelperEnum {
    Steer = 1,
    Rescue = 2,
    Winch = 3,
    None = 4
}
