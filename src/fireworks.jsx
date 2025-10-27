// Fireworks.jsx
import React from "react";


/**
 * Simple canvas fireworks effect.
 * - Place inside the hero section (which must be `relative`) so canvas covers it.
 * - The canvas uses pointer-events: none so it doesn't block user interaction.
 */

export default function Fireworks({
  intensity = 0.6,    // overall frequency multiplier (0 = off, 1 = normal)
  maxRockets = 3,     // concurrent ascenders before explosion
  rocketSpeed = 6,    // initial rocket speed multiplier
  particleCount = 45, // particles per explosion
}) {
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const rocketsRef = React.useRef([]);
  const particlesRef = React.useRef([]);
  const lastLaunchRef = React.useRef(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    let width = 0;
    let height = 0;

    function resize() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Vector helpers
    const rand = (min, max) => Math.random() * (max - min) + min;
    const hexColor = () =>
      `hsl(${Math.floor(rand(0, 360))}deg ${Math.floor(rand(60, 90))}% ${Math.floor(rand(50, 65))}%)`;

    function spawnRocket() {
      if (rocketsRef.current.length >= maxRockets) return;
      const x = rand(width * 0.15, width * 0.85);
      const y = height + 10;
      const vx = rand(-0.8, 0.8);
      const vy = -rand(rocketSpeed * 0.8, rocketSpeed * 1.2);
      rocketsRef.current.push({
        x,
        y,
        vx,
        vy,
        size: rand(2, 3.5),
        hue: hexColor(),
        age: 0,
        ttl: rand(700, 1200), // ms-ish before forced explode
      });
    }

    function explode(rocket) {
      const hueBase = Math.random() * 360;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + rand(-0.1, 0.1);
        const speed = rand(1.5, 6);
        particlesRef.current.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed + rocket.vx * 0.5,
          vy: Math.sin(angle) * speed + rocket.vy * 0.5,
          friction: rand(0.985, 0.995),
          gravity: 0.035 + Math.random() * 0.03,
          alpha: 1,
          decay: rand(0.005, 0.02),
          size: rand(1, 3.2),
          color: `hsl(${Math.floor(hueBase + rand(-30, 30))}deg 85% ${rand(45, 65)}%)`,
        });
      }
    }

    let lastTime = performance.now();

    function frame(now) {
      const dt = now - lastTime;
      lastTime = now;

      // clear with slight alpha for trail effect
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(0,0,0,0)"; // fully transparent; we use clearRect above

      // Launch rockets periodically based on intensity
      if (Math.random() < 0.02 * intensity && now - lastLaunchRef.current > 300) {
        spawnRocket();
        lastLaunchRef.current = now;
      }

      // Update rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        r.age += dt;
        // simple physics
        r.vy += -0.02; // slight lift while ascending (gives a more dramatic arc)
        r.x += r.vx * (dt / 16.67);
        r.y += r.vy * (dt / 16.67);
        r.vx *= 0.999;

        // Draw rocket trail
        ctx.beginPath();
        ctx.fillStyle = r.hue;
        ctx.globalAlpha = 0.9;
        ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
        ctx.fill();

        // Condition to explode:
        const heightPct = r.y / height;
        const randomExplode = Math.random() < 0.002 * intensity;
        if (r.vy >= -1.2 || heightPct < 0.45 || randomExplode || r.age > r.ttl) {
          explode(r);
          rocketsRef.current.splice(i, 1);
        }
      }

      // Update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.vx *= p.friction;
        p.vy = p.vy * p.friction + p.gravity * (dt / 16.67);
        p.x += p.vx * (dt / 16.67);
        p.y += p.vy * (dt / 16.67);
        p.alpha -= p.decay * (dt / 16.67);
        p.size *= 0.997;

        if (p.alpha <= 0.02 || p.y > height + 30 || p.size < 0.2) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        // draw particle
        ctx.beginPath();
        ctx.globalCompositeOperation = "lighter"; // additive blend for glow
        ctx.globalAlpha = Math.min(1, p.alpha);
        // radial gradient for smoother glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(6, p.size * 6));
        grad.addColorStop(0, p.color);
        grad.addColorStop(0.5, p.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, Math.max(1, p.size * 2), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      // subtle overlay glow for atmosphere (optional)
      if (Math.random() < 0.02 * intensity && rocketsRef.current.length < maxRockets) {
        // spawn small extra rocket occasionally
        if (Math.random() < 0.4) spawnRocket();
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    // start
    resize();
    window.addEventListener("resize", resize);
    lastTime = performance.now();
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rocketsRef.current = [];
      particlesRef.current = [];
    };
  }, [intensity, maxRockets, rocketSpeed, particleCount]);

  // style: absolute cover of parent, pointer-events none, sits behind content via negative zIndex
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -5 }}
    />
  );
}
