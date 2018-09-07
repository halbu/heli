class LevelScreen implements IAppScreen {
    public ctx: CanvasRenderingContext2D;
    public model: LevelModel;
    public view: LevelView;
    public controller: LevelController;
    public heli: HELI;
    
    constructor(ctx: CanvasRenderingContext2D, heli: HELI, inputManager: InputManager) {
        Object.assign(this, { ctx, heli });
        this.model = new LevelModel();
        this.view = new LevelView(ctx, this.model);
        this.controller = new LevelController(inputManager, heli, this.model, this.ctx);
    }

    public act(): void {
        this.controller.handleInput();
        this.model.act();
        this.view.draw();
    }
}
