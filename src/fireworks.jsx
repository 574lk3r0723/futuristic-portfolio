import React, { useRef, useEffect } from "react";

export default function Fireworks({ intensity = 0.6, particleCount = 40, className = "" }) {
  const canvasRef = useRef(null);
  const rockets = useRef([]);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    const random = (min, max) => Math.random() * (max - min) + min;

    function Rocket() {
      this.x = canvas.width / 2 + random(-50, 50); // wider spread
      this.y = canvas.height;
      this.vx = random(-1, 1);
      this.vy = random(-8, -12);
      this.exploded = false;
    }

    function Particle(x, y) {
      this.x = x;
      this.y = y;
      this.vx = random(-3, 3);
      this.vy = random(-3, 3);
      this.alpha = 1;
    }

    const createRocket = () => {
      if (rockets.current.length < intensity * 5) rockets.current.push(new Rocket());
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rockets.current.forEach((r, i) => {
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.2;

        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(r.x, r.y, 2, 4);

        if (r.vy >= 0 && !r.exploded) {
          r.exploded = true;
          for (let j = 0; j < particleCount; j++) {
            particles.current.push(new Particle(r.x, r.y));
          }
          rockets.current.splice(i, 1);
        }
      });

      particles.current = particles.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.alpha -= 0.02;
        ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
        ctx.fillRect(p.x, p.y, 2, 2);
        return p.alpha > 0;
      });

      requestAnimationFrame(update);
    };

    update();
    const interval = setInterval(createRocket, 400);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", setSize);
    };
  }, [intensity, particleCount]);

  return <canvas ref={canvasRef} className={`pointer-events-none ${className}`} />;
}
