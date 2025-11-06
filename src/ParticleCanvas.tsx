import React, {useRef, useEffect} from 'react';

import { Vector2D } from './Vector2D';

const GRAVITY = new Vector2D(0, 0.001);

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

        const epsilon: number = 0.01;

        // X bounds
        const xClampResult = clamp(this.pos.x, 0 + this.radius + epsilon, bounds.width - this.radius - epsilon);
        this.pos.x = xClampResult.val

        if (xClampResult.clamped) {
            this.vel.x *= -1;
        }

        // Y bounds
        const yClampResult = clamp(this.pos.y, 0 + this.radius + epsilon, bounds.height - this.radius - epsilon);
        this.pos.y = yClampResult.val

        if (yClampResult.clamped) {
            this.vel.y *= -1;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        // ctx.strokeStyle = "white";
        // ctx.lineWidth = 2;

        ctx.fill();
        // ctx.stroke();

        ctx.closePath();
    }
}

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomVelocity(magnitude: number): Vector2D {
  return new Vector2D(getRandomNumber(-magnitude, magnitude), getRandomNumber(-magnitude, magnitude)); // Adjust the velocity range as needed
}

// Function to generate a random position
function getRandomPosition(bounds: Bounds): Vector2D  {
  const x = getRandomNumber(0, bounds.width);
  const y = getRandomNumber(0, bounds.height);
  return new Vector2D(x, y);
}

function getRandomParticleArray(particleCount: number, bounds: Bounds): Particle[] {
    const particleArray: Particle[] = []

     for (let i = 0; i < particleCount; i++) {
        particleArray.push(new Particle(
            getRandomPosition(bounds),
            getRandomVelocity(2),
            5,
            "gray"
        ));
    }

    return particleArray;
}

function animateParticles(particles: Particle[], bounds: Bounds): void {
    for (const particle of particles) {
        particle.update(bounds);
    }
}


function drawParticles(particles: Particle[], ctx: CanvasRenderingContext2D): void {
    for (const particle of particles) {
        particle.draw(ctx);
    }
}

// UseEffect with no dep array will continuously re-run in an infinite loop


export const ParticleCanvas = ({particleCount = 500}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const particlesRef = useRef<Particle[]>([])

    const animationFrameIdRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();

        const bounds: Bounds = { width: canvas.width, height: canvas.height };
        particlesRef.current = getRandomParticleArray(particleCount, bounds);

        const animate = () => {
            const bounds: Bounds = {width: canvas.width, height: canvas.height};

            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animateParticles(particlesRef.current, bounds);
            drawParticles(particlesRef.current, ctx);

            animationFrameIdRef.current = requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('resize', setCanvasSize);

        return () => {
            if(animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            window.removeEventListener('resize', setCanvasSize);
        }
    }, [particleCount])

    return (
        <canvas ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 0
            }}
        />
    );
};