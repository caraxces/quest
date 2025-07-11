'use strict';

console.log("Particle script loaded: Refined Ribbons");

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;

const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
ctx.scale(dpr, dpr);

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    init();
});

const colorPalette = ['#5e2ff7', '#7b53f9', '#9d3dff', '#4acff9', '#3a68ec', '#8e6cff'];

class Ribbon {
    constructor(color) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        
        this.path = [{ x: this.x, y: this.y }];
        // Longer, more graceful tails
        this.pathMaxLength = 80 + Math.random() * 50;
        
        this.color = color;
        // Thinner ribbons
        this.width = 1 + Math.random() * 1;
        
        // Slower, more gentle movement
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.5 + Math.random() * 0.8;
        this.turnSpeed = Math.random() * 0.02 - 0.01; // Slower turns
        this.tick = Math.random() * 1000;
    }
    
    update() {
        this.tick++;
        
        // Slowly change direction
        this.angle += Math.sin(this.tick * 0.05) * this.turnSpeed;
        
        // Move forward based on angle
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        
        this.x += vx;
        this.y += vy;
        
        // Add new point to the beginning of the path
        this.path.unshift({ x: this.x, y: this.y });
        
        // Remove old points from the end if path is too long
        if (this.path.length > this.pathMaxLength) {
            this.path.pop();
        }
        
        // Wrap around screen edges if the ribbon goes completely off-screen
        if (this.path[this.path.length-1].x < -this.width * 2 && this.x < -this.width * 2) this.x = width + this.width;
        if (this.path[this.path.length-1].x > width + this.width * 2 && this.x > width + this.width * 2) this.x = -this.width;
        if (this.path[this.path.length-1].y < -this.width * 2 && this.y < -this.width * 2) this.y = height + this.width;
        if (this.path[this.path.length-1].y > height + this.width * 2 && this.y > height + this.width * 2) this.y = -this.width;
    }
    
    draw() {
        if (this.path.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(this.path[0].x, this.path[0].y);
        
        for (let i = 1; i < this.path.length; i++) {
            ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        
        // Use the ribbon's color with some transparency
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Add a subtle glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        
        ctx.stroke();
        
        // Reset shadow for next draw call
        ctx.shadowBlur = 0;
    }
}

let ribbonsArray = [];
// Drastically reduced number of ribbons for a cleaner look
const numberOfRibbons = 6;

function init() {
    ribbonsArray = [];
    for(let i = 0; i < numberOfRibbons; i++) {
        const color = colorPalette[i % colorPalette.length];
        ribbonsArray.push(new Ribbon(color));
    }
    console.log(`Initialized ${ribbonsArray.length} ribbons.`);
}

let lastTime = 0;
const fps = 45; // Can allow higher FPS for smoother lines
const frameTime = 1000 / fps;

function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    
    if (deltaTime > frameTime) {
        // Clear with a slightly higher alpha for faster fading trails
        ctx.fillStyle = 'rgba(12, 5, 26, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        for (const ribbon of ribbonsArray) {
            ribbon.update();
            ribbon.draw();
        }
        lastTime = timestamp;
    }
    
    requestAnimationFrame(animate);
}

init();
requestAnimationFrame(animate); 