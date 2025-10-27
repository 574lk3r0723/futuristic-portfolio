// Fireworks.jsx
import React, { useEffect, useRef } from "react";

export default function Fireworks() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to parent container
    const setCanvasSize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const fireworks = [];
    const particles = [];

    class Firework {
      constructor() {
        this.x = Math.random() * canvas.width;
        // Spawn lower: from 25% to 75% of canvas height
        this.y = canvas.height * 0.25 + Math.random() * canvas.height * 0.5;
        this.exploded = false;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
      }
      explode() {
        this.exploded = true;
        for (let i = 0; i < 30; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 2 + Math.random() * 2;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.alpha = 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.02;
      }
      draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn fireworks randomly
      if (Math.random() < 0.03) fireworks.push(new Firework());

      // Update fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const f = fireworks[i];
        if (!f.exploded) f.explode();
        else fireworks.splice(i, 1);
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.alpha <= 0) particles.splice(i, 1);
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", setCanvasSize);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />;
}
