class Rect {
    public x: number;
    public y: number;
    public w: number;
    public h: number;

    constructor(x: number, y: number, w: number, h: number) {
        Object.assign(this, {x, y, w, h});
    }

    public leftEdge(): number           { return this.x; }
    public rightEdge(): number          { return this.x + this.w; }
    public topEdge(): number            { return this.y; }
    public bottomEdge(): number         { return this.y + this.h; }

    public alignLeft(a: Rect): void     { this.x = a.x - this.w; }
    public alignRight(a: Rect): void    { this.x = a.x + a.w; }
    public alignTop(a: Rect): void      { this.y = a.y - this.h; }
    public alignBottom(a: Rect): void   { this.y = a.y + a.h; }
    
    public overlap(b: Rect): boolean {
        return (this.x + this.w > b.x && this.x < b.x + b.w && this.y + this.h > b.y && this.y < b.y + b.h);
    }

    public randomPointWithin(): Point {
        return new Point(
            this.x + Math.floor(Math.random() * this.w),
            this.y + Math.floor(Math.random() * this.h)
        );
    }
}
