import React, {useRef, useEffect} from 'react';

import { Vector2D } from './Vector2D';


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
        public color: string,
        public blinkColor: string,
        public randomControlChance: number,
        public randomControlMaxMagnitude: number,
        public randomControlDuration: number
    ) {
        this.currentColor = color;
        this.drag = 0.9995;
    }

    private control: Vector2D | undefined;
    private controlEnergy: number | undefined;
    private currentColor: string;
    private drag: number;
    

    generateRandomControl(): void {
        if (!this.control) {
            const value: number = Math.random();
            if (value < this.randomControlChance) {
                const controlMagnitude: number = this.randomControlMaxMagnitude;
                this.control = getRandomVelocity(controlMagnitude);
                this.controlEnergy = this.randomControlDuration;
            }
        }

        if(this.controlEnergy) {
            this.controlEnergy -= 1;
            this.currentColor = this.blinkColor;
            this.radius = 4.0

            if (this.controlEnergy <= 0) {
                this.radius = 2.0
                this.currentColor = this.color;
                this.control = undefined;
                this.controlEnergy = undefined;
            }
        }
    }

    update(bounds: Bounds): void {
        if (this.control) {
            this.vel.add(this.control);
        }
        this.vel.multiplyScalar(this.drag);
        this.pos.add(this.vel);

        const epsilon: number = 0.1;

        // X bounds
        const xClampResult = clamp(this.pos.x, 0 + this.radius + epsilon, bounds.width - this.radius - epsilon);
        this.pos.x = xClampResult.val

        if (xClampResult.clamped) {
            this.vel.x *= -1.0;
        }

        // Y bounds
        const yClampResult = clamp(this.pos.y, 0 + this.radius + epsilon, bounds.height - this.radius - epsilon);
        this.pos.y = yClampResult.val

        if (yClampResult.clamped) {
            this.vel.y *= -1.0;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.currentColor;
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
            getRandomVelocity(0.2),
            2,
            'rgba(32, 32, 32, 1)',
            'rgba(255, 190, 49, 1)',
            0.001,
            0.01,
            100.0
        ));
    }

    return particleArray;
}

function animateParticles(particles: Particle[], bounds: Bounds): void {
    for (const particle of particles) {
        particle.generateRandomControl();
        particle.update(bounds);
    }
}


function drawParticles(particles: Particle[], ctx: CanvasRenderingContext2D): void {
    for (const particle of particles) {
        particle.draw(ctx);
    }
}

// UseEffect with no dep array will continuously re-run in an infinite loop


export const ParticleCanvas = ({density = 4000}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const particlesRef = useRef<Particle[]>([])

    const animationFrameIdRef = useRef<number | null>(null);

    const frameCount = useRef<number>(0);

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

        const particleCount = Math.floor(canvas.width * canvas.height / density)

        const bounds: Bounds = { width: canvas.width, height: canvas.height };
        particlesRef.current = getRandomParticleArray(particleCount, bounds);

        ctx.fillStyle = 'rgba(5, 5, 5, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        const animate = () => {
            const bounds: Bounds = {width: canvas.width, height: canvas.height};
            frameCount.current += 1;


            ctx.fillStyle = 'rgba(50, 50, 50, 0.1)';
            
            if (frameCount.current % 5 == 0) {
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }


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
    }, [density])

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