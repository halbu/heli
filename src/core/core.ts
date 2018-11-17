// tslint:disable-next-line:no-any
declare var fx: any;

class HELI {
    public cnv: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    public lastFrameTime: number;
    public deltaTime: number;

    public inputManager: InputManager;
    public scanlineOffset = 0;
    public activeScreen: IAppScreen;

    // tslint:disable-next-line:no-any
    public glfxTexture: any;
    // tslint:disable-next-line:no-any
    public glfxCanvas: any;
    // tslint:disable-next-line:no-any
    public glfxSourceCanvas: any;

    constructor() {
        this.cnv = <HTMLCanvasElement> document.getElementById('myCanvas');
        this.ctx = this.cnv.getContext('2d');
        this.inputManager = new InputManager(this.cnv);
        this.activeScreen = new MenuScreen(this.ctx, this, this.inputManager);
    }
    
    public init(): void {
        this.initialiseCanvases();
        
        AssetManager.loadSprites();
        AudioManager.initialise();
        
        setTimeout(() => {
            this.lastFrameTime = performance.now();
            window.requestAnimationFrame(() => { this.coreGameLoop(); });
       }, 250);
    }

    public initialiseCanvases(): void {
        this.cnv.width = Constants.CANVAS_WIDTH;
        this.cnv.height = Constants.CANVAS_HEIGHT;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.fillStyle = Constants.COLORS.DRAW_COLOR;
        this.ctx.font = '' + 26 + "px '" + 'FONT_SPECTRUM' + "'";
        
        this.glfxSourceCanvas = document.getElementsByTagName('canvas')[0];
        this.glfxCanvas = fx.canvas();
        this.glfxTexture = this.glfxCanvas.texture(this.glfxSourceCanvas);

        // Hide the original 2D canvas and put the GLFX WebGL Canvas in its place
        this.glfxSourceCanvas.parentNode.insertBefore(<Node> this.glfxCanvas, <Node> this.glfxSourceCanvas);
        this.glfxSourceCanvas.style.display = 'none';
        this.glfxCanvas.className = this.glfxSourceCanvas.className;
        this.glfxCanvas.id = this.glfxSourceCanvas.id;
        this.glfxCanvas.style = 'height: 518px; width: 800px; border: 5px solid #606060; border-radius: 5px; box-shadow: 0px 0px 150px #444;';
        this.glfxSourceCanvas.id = 'old_' + this.glfxSourceCanvas.id;
    }

    public clearCanvas(): void {
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = Constants.COLORS.NONE;
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
        this.ctx.globalAlpha = 1;
    }
    
    public coreGameLoop(): void {
        this.clearCanvas();
        
        this.activeScreen.act();

        this.inputManager.clearInput();
        
        this.overdrawScanlines();
        this.applyGlfx();

        this.deltaTime = performance.now() - this.lastFrameTime;
        while (this.deltaTime < Constants.MILLISECONDS_PER_FRAME) {
            this.deltaTime = performance.now() - this.lastFrameTime;
        }

        this.lastFrameTime = performance.now();
        window.requestAnimationFrame(() => {this.coreGameLoop(); });
    }

    public applyGlfx(): void {
        // Load the latest glfxSourceCanvas frame
        this.glfxTexture.loadContentsOf(this.glfxSourceCanvas);

        // Apply WebGL magic
        this.glfxCanvas.draw(this.glfxTexture)
            .brightnessContrast(0.125, 0.04)
            .noise(0.025)
            .bulgePinch(400, 256, 550, 0.065)
            .vignette(0.15, 0.625)
            .update();
    }

    public switchScreen(appScreen: IAppScreen): void {
        this.activeScreen = appScreen; 
    }

    public overdrawScanlines(): void {
        this.scanlineOffset -= .5;
        let split = 8;
        if (this.scanlineOffset < -(split * 3)) { this.scanlineOffset += (split * 3); } // sure
        this.ctx.fillStyle = Constants.COLORS.SCANLINE_COLOR;
        this.ctx.globalAlpha = Constants.COLORS.SCANLINE_ALPHA;
        for (let i = 0; i <= 820 / split; ++i) {
            this.ctx.fillRect(0, this.scanlineOffset + i * split, Constants.CANVAS_WIDTH, 5);
        }
        this.ctx.globalAlpha = 1;
    }

    public oneIn(x: number): boolean {
        let n = Math.floor(Math.random() * x) + 1;
        return n === 1;
    }

    public coinflip(): boolean {
        return this.oneIn(2);
    }
}
