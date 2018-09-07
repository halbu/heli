class Point {
    public x: number;
    public y: number;
    
    constructor(x: number, y: number) {
        Object.assign(this, {x, y});
    }

    public plusEquals(that: Point): void {
        this.x += that.x;
        this.y += that.y;
    }

    public minusEquals(that: Point): void {
        this.x -= that.x;
        this.y -= that.y;
    }

    public timesEquals(that: Point): void {
        if (that.x && that.y) {
            this.x *= that.x;
            this.y *= that.y;
        } else {
            this.x *= that.x;
            this.y *= that.y;
        }
    }

    public divideEquals(that: Point): void {
        if (that.x && that.y) {
            this.x /= that.x;
            this.y /= that.y;
        } else {
            this.x /= that.x;
            this.y /= that.y;
        }
    }
    
    public equals(that: Point): boolean {
        return (this.x === that.x && this.y === that.y);
    }

    public floor(): void {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }
}
