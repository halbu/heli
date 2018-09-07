class MenuScreen implements IAppScreen {
    public ctx: CanvasRenderingContext2D;
    public model: null;
    public view: MenuView;
    public controller: MenuController;
    public heli: HELI;
    
    constructor(ctx: CanvasRenderingContext2D, heli: HELI, inputManager: InputManager) {
        Object.assign(this, { ctx, heli });
        this.model = null;
        this.view = new MenuView(ctx);
        this.controller = new MenuController(inputManager, heli, ctx);
    }

    public act(): void {
        this.controller.handleInput();
        // this.model.act();
        this.view.draw();
    }
}
