class MenuView implements IView {
    public ctx: CanvasRenderingContext2D;
    public timer = 0;

    constructor(ctx: CanvasRenderingContext2D) {
        Object.assign(this, { ctx });
    }

    public draw(): void {
        this.timer++;

        this.ctx.fillStyle = Constants.COLORS.DRAW_COLOR;
        this.ctx.textAlign = 'center';

        this.ctx.font = '' + 48 + "px '" + 'FONT_SPECTRUM' + "'";
        this.ctx.fillText('V O L C A N O', 400, 150);
        this.ctx.fillText('H E L I C O P T E R', 400, 200);
        this.ctx.fillText('R E S C U E', 400, 250);

        if (this.timer > 60) {
            if (this.timer > 75 || this.timer % 4 <= 1) {
                this.ctx.font = '' + 24 + "px '" + 'FONT_SPECTRUM' + "'";
                this.ctx.fillText('-  PRESS SPACE TO START -', 400, 350);
            }
        }
        
        this.ctx.textAlign = 'left';
    }
}
