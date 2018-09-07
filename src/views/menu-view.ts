class MenuView implements IView {
    public ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        Object.assign(this, { ctx });
    }

    public draw(): void {
        this.ctx.fillStyle = Constants.COLORS.DRAW_COLOR;
        this.ctx.textAlign = 'center';

        this.ctx.font = '' + 48 + "px '" + 'FONT_SPECTRUM' + "'";
        this.ctx.fillText('v o l c a n o', 400, 160);
        this.ctx.fillText('h e l i c op t e r', 400, 200);
        this.ctx.fillText('r e s c u e', 400, 240);

        this.ctx.font = '' + 24 + "px '" + 'FONT_SPECTRUM' + "'";
        this.ctx.fillText('/ press space /', 400, 300);
        
        this.ctx.textAlign = 'left';
    }
}
