import React, {useRef, useEffect} from 'react';

import { Vector2D } from './Vector2D';

const GRAVITY = new Vector2D(0, 0.02);

interface ClampResult {
    val: number,
    clamped: boolean
}

function clamp(val: number, min: number, max: number): ClampResult {
    if (val < min) {
        return {val: min, clamped: true};
    } else if (val > max) {
        return {val: max, clamped: true};
    } else {
        return {val: val, clamped: false};
    }
}

interface Bounds {
    width: number;
    height: number;
}

class Particle {
    constructor(
        public pos: Vector2D,
        public vel: Vector2D,
        public radius: number,
        public color: string
    ) {}

    update(bounds: Bounds): void {
        this.vel.add(GRAVITY);
        this.pos.add(this.vel);

        // X bounds
        const xClampResult = clamp(this.pos.x, 0 + this.radius, bounds.width - this.radius);
        this.pos.x = xClampResult.val

        if (xClampResult.clamped) {
            this.vel.x *= -1;
        }

        // Y bounds
        const yClampResult = clamp(this.pos.y, 0 + this.radius, bounds.width - this.radius);

        if (yClampResult.clamped) {
            this.vel.y *= -1;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        ctx.fill();
        ctx.stroke();

        ctx.closePath();
    }
}

// UseEffect with no dep array will continuously re-run in an infinite loop


const ParticleCanvas = ({})