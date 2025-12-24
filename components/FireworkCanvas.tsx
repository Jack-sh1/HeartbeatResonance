
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

const FireworkCanvas: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  // Added initial value undefined to useRef to satisfy strict argument requirements
  const animationFrameId = useRef<number | undefined>(undefined);

  const createFirework = (x: number, y: number, color?: string) => {
    const particleCount = 60 + Math.random() * 40;
    const baseColor = color || `hsl(${Math.random() * 360}, 100%, 60%)`;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 5 + 2;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: baseColor,
        size: Math.random() * 2 + 1,
        decay: Math.random() * 0.015 + 0.005,
      });
    }
  };

  const createTrail = (x: number, targetY: number) => {
    const vy = -Math.random() * 5 - 10;
    const firework = {
      x,
      y: window.innerHeight,
      targetY,
      vy,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`
    };

    const updateTrail = () => {
      firework.y += firework.vy;
      firework.vy += 0.1; // Gravity on trail
      
      if (firework.vy >= 0 || firework.y <= firework.targetY) {
        createFirework(firework.x, firework.y, firework.color);
        return false;
      }
      return true;
    };
    
    return updateTrail;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let trails: (() => boolean)[] = [];

    const loop = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Handle active firework launching
      if (active && Math.random() < 0.05) {
        trails.push(createTrail(
          Math.random() * canvas.width,
          Math.random() * canvas.height * 0.5
        ));
      }

      trails = trails.filter(trail => trail());

      // Update and draw particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // Gravity
        p.vx *= 0.98; // Air resistance
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a slight glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationFrameId.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default FireworkCanvas;
