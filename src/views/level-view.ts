class LevelView implements IView {
    public ctx: CanvasRenderingContext2D;
    public levelModel: LevelModel;
    public postGameTimer = 0;

    constructor(ctx: CanvasRenderingContext2D, levelModel: LevelModel) {
        Object.assign(this, { ctx, levelModel });
    }

    public draw(): void {
        this.ctx.fillStyle = Constants.COLORS.DRAW_COLOR;
        if (this.levelModel.player.alive) {
            this.drawActor(this.levelModel.player);
            this.ctx.fillRect(
                this.levelModel.player.winch.x,
                this.levelModel.player.hitbox.y + Constants.WINCH_Y_OFFSET,
                2,
                this.levelModel.player.winchLength);
            this.drawActor(this.levelModel.helper);
        }
        if (this.levelModel.player.hanger) {
            this.drawActor(this.levelModel.player.hanger);
        }
        this.drawActor(this.levelModel.volcano);
        this.drawActor(this.levelModel.helipad);
        this.drawActorArray(this.levelModel.people);
        this.drawActorArray(this.levelModel.debris);
        this.drawActorArray(this.levelModel.meteors);
        
        this.ctx.fillRect(0, Constants.GROUND_HEIGHT, 800, 1);

        this.drawIngameOverlay();

        if (this.levelModel.state === GameState.Victory || this.levelModel.state === GameState.Dead) {
            this.postGameTimer++;
            this.drawPostgameOverlay();
        }
    }

    public drawIngameOverlay(): void {
        for (let i = 0; i !== this.levelModel.saves; ++i) {
            this.ctx.drawImage(AssetManager.getSprite('saved'), 780, 4 + i * 20);
        }
        for (let i = 0; i !== this.levelModel.deaths; ++i) {
            this.ctx.drawImage(AssetManager.getSprite('death'), 760, 4 + i * 20);
        }
        this.ctx.textAlign = 'center';
        this.ctx.font = '' + 24 + "px '" + 'FONT_SPECTRUM' + "'";
        this.ctx.fillText(this.levelModel.timerstring, Constants.CANVAS_WIDTH / 2, 40);
        this.ctx.textAlign = 'left';
    }

    public drawPostgameOverlay(): void {
        this.ctx.textAlign = 'center';

        // after one second draw the win/lose text
        if (this.postGameTimer > 60) {
            this.ctx.font = '' + 36 + "px '" + 'FONT_SPECTRUM' + "'";
            if (this.postGameTimer > 75 || this.postGameTimer % 4 <= 1) {
                this.ctx.fillText((this.levelModel.state === GameState.Victory ? 'TIME OVER' : 'CRASH AND BURN'), Constants.CANVAS_WIDTH / 2, 180);
            }
        }

        // after two seconds, start listing the player's rescues/deaths in order
        if (this.postGameTimer > 120) {
            this.ctx.textAlign = 'start';
            // how many things should we draw at this point in time
            let fills = Math.floor((this.postGameTimer - 120) / Constants.LIST_OUTCOME_DELAY);
            if (fills >= this.levelModel.outcomes.length) { fills = this.levelModel.outcomes.length; }

            // figure out where on the left we should start drawing from to make the whole list centred
            let x = (Constants.CANVAS_WIDTH / 2) - (fills * Constants.OUTCOME_SPRITE_WIDTH) / 2;
            for (let i = 0; i !== fills; ++i) {
                let o = this.levelModel.outcomes[i];
                let sprite = '';
                if (o === 'killed_by_helicopter') { sprite = 'death'; }
                if (o === 'escaped') { sprite = 'saved'; }
                if (o === 'killed_by_falling') { sprite = 'death'; }
                if (o === 'killed_by_helipad') { sprite = 'death'; }
                this.ctx.drawImage(AssetManager.getSprite(sprite), x + (i * Constants.OUTCOME_SPRITE_WIDTH), 240);
            }
        }

        if (this.postGameTimer > 180) {
            if (this.postGameTimer > 195 || this.postGameTimer % 4 <= 1) {
                this.ctx.font = '' + 16 + "px '" + 'FONT_SPECTRUM' + "'";
                this.ctx.textAlign = 'center';
                this.ctx.fillText('PRESS ESCAPE TO RETURN TO MENU', Constants.CANVAS_WIDTH / 2, 350);
            }
        }
    }

    public drawActorArray(arr: Array<WorldObject>): void {
        for (let i = 0; i !== arr.length; ++i) {
            let wa = arr[i];
            // crude hack to make offscreen indicators not get pushed off the top of the canvas by the bulge effect
            if (wa instanceof Meteor && wa.hitbox.bottomEdge() < 0) {
                let centreOffset = Math.abs((wa.hitbox.x + wa.hitbox.w / 2) - (Constants.CANVAS_WIDTH / 2));
                let yBump = Math.floor((400 - centreOffset) / 50);
                this.ctx.drawImage(AssetManager.getSprite('arrow_tag'), wa.hitbox.x, 4 + yBump);
            } else { this.drawActor(wa); }
        }
    }

    protected drawActor(wa: WorldObject): void {
        let screenPosition = wa.getScreenPosition();

        for (let i = 0; i !== wa.sprites.length; ++i) {
            let sprite = <HTMLImageElement> AssetManager.getSprite(wa.sprites[i]);

            if (wa.angle) {
                this.ctx.save();
                this.ctx.translate(screenPosition.x + wa.hitbox.w / 2, screenPosition.y + wa.hitbox.h / 2);
                this.ctx.rotate(wa.angle * (Math.PI / 180));
                this.ctx.translate(-(screenPosition.x + wa.hitbox.w / 2), -(screenPosition.y + wa.hitbox.h / 2));
                this.ctx.drawImage(sprite, screenPosition.x, screenPosition.y);
                this.ctx.restore();
            } else {
                this.ctx.drawImage(
                    sprite,
                    screenPosition.x,
                    screenPosition.y,
                );
            }
        }
    }
}
