class MenuScreen implements IAppScreen {
    public ctx: CanvasRenderingContext2D;
    public model: MenuModel;
    public view: MenuView;
    public controller: MenuController;
    public heli: HELI;
    
    constructor(ctx: CanvasRenderingContext2D, heli: HELI, inputManager: InputManager) {
        Object.assign(this, { ctx, heli });
        this.model = new MenuModel();
        this.view = new MenuView(ctx, this.model);
        this.controller = new MenuController(inputManager, heli, ctx);
    }

    public act(): void {
        this.controller.handleInput();
        this.model.act();
        this.view.draw();
    }
}
