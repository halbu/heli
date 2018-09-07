class InputManager {
    private cnv: HTMLCanvasElement;
    public mouse: Point;
    
    // tslint:disable-next-line:no-any
    public KB: any; // because supporting IE11 is really important
    // public KB: Map<string, boolean>;
    public KP: number;

    constructor(cnv: HTMLCanvasElement) {
        this.cnv = cnv;
        this.mouse = new Point(0, 0);
        this.KB = new Map<string, boolean>();
        this.KP = Constants.INPUT.None;

        this.attachListeners();
    }

    public attachListeners(): void {
        window.onkeydown =                      (e) =>  {
            if (e.keyCode === Constants.INPUT.Keys.Alt) {
                e.preventDefault();
            }
            this.KB[e.keyCode] = true;
            this.KP = e.keyCode;
        };
        window.onkeyup =                        (e) =>  { this.KB[e.keyCode] = false; };
        this.cnv.addEventListener('mousedown',  () =>   { this.KB['M1'] = true; this.KP = Constants.INPUT.Mouse.Left; }, false);
        this.cnv.addEventListener('mouseup',    () =>   { this.KB['M1'] = false; }, false);
        this.cnv.addEventListener('mousemove',  (e) =>  {
            this.mouse.x = e.clientX - this.cnv.getBoundingClientRect().left;
            this.mouse.y = e.clientY - this.cnv.getBoundingClientRect().top;
        }, false);
        this.cnv.addEventListener('contextmenu', (e) =>  {
            e.preventDefault();
            this.KB['M2'] = true; this.KP = Constants.INPUT.Mouse.Right;
        }, false);
    }

    public clearInput(): void {
        this.KP = Constants.INPUT.None;
    }
}
