class MenuController implements IController {
    public ctx: CanvasRenderingContext2D;
    public heli: HELI; // reference to parent application
    public inputManager: InputManager;

    constructor(inputManager: InputManager, heli: HELI, ctx: CanvasRenderingContext2D) {
        Object.assign(this, { inputManager, heli, ctx });
    }

    public handleInput(): void {
        if (this.inputManager.KP === Constants.INPUT.Keys.Space) {
            this.heli.switchScreen(new LevelScreen(this.ctx, this.heli, this.inputManager));
        }
    }
}
