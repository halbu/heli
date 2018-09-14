class LevelController implements IController {
    public ctx: CanvasRenderingContext2D;
    public heli: HELI; // reference to parent application
    public inputManager: InputManager;
    public levelModel: LevelModel;

    constructor(inputManager: InputManager, heli: HELI, levelModel: LevelModel, ctx: CanvasRenderingContext2D) {
        Object.assign(this, { inputManager, heli, levelModel, ctx });
    }

    public handleInput(): void {
        if (this.inputManager.KB[Constants.INPUT.Keys.D]) {
            this.levelModel.player.applyImpulse('R');
        } else if (this.inputManager.KB[Constants.INPUT.Keys.A]) {
            this.levelModel.player.applyImpulse('L');
        }    
        if (this.inputManager.KB[Constants.INPUT.Keys.W]) {
            this.levelModel.player.applyImpulse('U');
        } else if (this.inputManager.KB[Constants.INPUT.Keys.S]) {
            this.levelModel.player.applyImpulse('D');
        }

        if (this.inputManager.KP === Constants.INPUT.Keys.Space) {
            this.levelModel.player.toggleWinch();
        }

        if (this.inputManager.KP === Constants.INPUT.Keys.Escape && this.levelModel.state !== GameState.Playing) {
            this.heli.switchScreen(new MenuScreen(this.ctx, this.heli, this.inputManager));
        }
    }
}
