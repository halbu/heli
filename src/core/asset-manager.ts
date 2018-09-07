class AssetManager {
    // tslint:disable-next-line:no-any
    public static sprites: Map<any, any>;

    public static loadSprites(): void {
        let files = new Array<string>();
        for (let i = 0; i !== 99; ++i) {
            if (i > 0 && i <= 2) { files.push('heli_l_' + i); }
            if (i > 0 && i <= 2) { files.push('heli_r_' + i); }
            if (i > 0 && i <= 3) { files.push('help' + i); }
            if (i > 0 && i <= 2) { files.push('person_fall_' + i); }
        }
        files.push(...['person', 'person_hang', 'volcano', 'meteor', 'meteor2', 'helipad', 'arrow_tag', 'debris', 'death', 'saved']);

        // tslint:disable-next-line:no-any
        this.sprites = new Map<any, any>();

        files.forEach(s => {
            let i = new Image();
            i.src = 'assets/sprites/' + s + '.png';
            i.crossOrigin = 'anonymous';
            this.sprites[s] = i;
        });
    }

    // tslint:disable-next-line:no-any
    public static getSprite(str: string): any {
        return this.sprites[str];
    }
}
