class MenuView implements IView {
    public ctx: CanvasRenderingContext2D;
    public menuModel: MenuModel;
    public timer = 0;

    constructor(ctx: CanvasRenderingContext2D, menuModel: MenuModel) {
        Object.assign(this, { ctx, menuModel });
    }

    public draw(): void {
        this.timer++;

        this.ctx.fillStyle = Constants.COLORS.DRAW_COLOR;
        this.ctx.textAlign = 'center';

        this.ctx.font = '' + 48 + "px '" + 'FONT_SPECTRUM' + "'";
        this.ctx.fillText('V O L C A N O', 400, 100);
        this.ctx.fillText('H E L I C O P T E R', 400, 150);
        this.ctx.fillText('R E S C U E', 400, 200);

        if (this.timer > 60) {
            if (this.timer > 75 || this.timer % 4 <= 1) {
                this.ctx.font = '' + 24 + "px '" + 'FONT_SPECTRUM' + "'";
                this.ctx.fillText('-  PRESS SPACE TO START -', 400, 320);
            }
        }

        this.ctx.font = '' + 12 + "px '" + 'FONT_SPECTRUM' + "'";
        this.ctx.fillText('**  HIGH SCORES  **', 400, 430);
        this.ctx.fillText('Most Heroic Game: +' + this.menuModel.hiScoreMostHeroic.saves + ' -' + this.menuModel.hiScoreMostHeroic.kills, 400, 460);
        this.ctx.fillText('Most Murderous Game: +' + this.menuModel.hiScoreMostMurderous.saves + ' -' + this.menuModel.hiScoreMostMurderous.kills, 400, 475);
        this.ctx.fillText('Best Overall Game: +' + this.menuModel.hiScoreBestOverall.saves + ' -' + this.menuModel.hiScoreBestOverall.kills, 400, 490);
        
        this.ctx.textAlign = 'left';
    }
}
