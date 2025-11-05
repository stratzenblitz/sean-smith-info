export class Vector2D {
    constructor(
        public x: number = 0,
        public y: number = 0
    ) {}

    add(v: Vector2D) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    multiplyScalar(s: number) {
        this.x *= s;
        this.y *= s;
        return this;
    }
}