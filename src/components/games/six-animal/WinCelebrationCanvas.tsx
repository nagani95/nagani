//src/components/games/six-animal/WinCelebrationCanvas.tsx

"use client";

import { useEffect, useRef } from "react";

type WinCelebrationCanvasProps = {
  enabled: boolean;
  effectKey: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotate: number;
  spin: number;
  life: number;
  delay: number;
  type: "petal" | "coin" | "dust";
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function WinCelebrationCanvas({
  enabled,
  effectKey,
}: WinCelebrationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let startTime = performance.now();

    const particles: Particle[] = [];

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();

    const centerX = width * 0.5;
    const centerY = height * 0.48;

    for (let index = 0; index < 92; index += 1) {
      const angle = randomBetween(-Math.PI * 0.92, Math.PI * 0.08);
      const speed = randomBetween(70, 260);
      const side = Math.random() > 0.5 ? 1 : -1;

      particles.push({
        x: centerX + randomBetween(-72, 72),
        y: centerY + randomBetween(-30, 48),
        vx: Math.cos(angle) * speed * side * randomBetween(0.45, 1),
        vy: Math.sin(angle) * speed - randomBetween(20, 120),
        size: randomBetween(3, 9),
        rotate: randomBetween(0, Math.PI * 2),
        spin: randomBetween(-3, 3),
        life: randomBetween(1200, 2200),
        delay: randomBetween(0, 420),
        type:
          index % 5 === 0
            ? "coin"
            : index % 3 === 0
              ? "petal"
              : "dust",
      });
    }

    function drawRoyalAura(progress: number) {
      const auraAlpha =
        progress < 0.45 ? progress / 0.45 : Math.max(0, 1 - progress) * 0.7;

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        Math.max(width, height) * 0.48
      );

      gradient.addColorStop(0, `rgba(255, 231, 157, ${0.23 * auraAlpha})`);
      gradient.addColorStop(0.36, `rgba(214, 168, 79, ${0.16 * auraAlpha})`);
      gradient.addColorStop(1, "rgba(214, 168, 79, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalAlpha = 0.18 * auraAlpha;
      ctx.translate(centerX, centerY + 10);

      for (let ray = 0; ray < 18; ray += 1) {
        ctx.rotate((Math.PI * 2) / 18);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width * 0.015, -height * 0.42);
        ctx.lineTo(-width * 0.015, -height * 0.42);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 221, 132, 0.55)";
        ctx.fill();
      }

      ctx.restore();
    }

    function drawParticle(particle: Particle, age: number) {
      const localAge = age - particle.delay;
      if (localAge < 0 || localAge > particle.life) return;

      const t = localAge / particle.life;
      const fade = t < 0.18 ? t / 0.18 : Math.max(0, 1 - t);
      const gravity = 260;

      const x = particle.x + particle.vx * t * 1.65;
      const y =
        particle.y +
        particle.vy * t * 1.35 +
        0.5 * gravity * t * t;

      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(x, y);
      ctx.rotate(particle.rotate + particle.spin * t * 2);

      if (particle.type === "coin") {
        const coinGradient = ctx.createRadialGradient(
          -particle.size * 0.35,
          -particle.size * 0.35,
          1,
          0,
          0,
          particle.size * 1.4
        );

        coinGradient.addColorStop(0, "#fff3d0");
        coinGradient.addColorStop(0.45, "#f7d277");
        coinGradient.addColorStop(1, "#8a3c18");

        ctx.fillStyle = coinGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, particle.size, particle.size * 0.62, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 243, 208, 0.58)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (particle.type === "petal") {
        ctx.fillStyle = "rgba(247, 210, 119, 0.92)";
        ctx.beginPath();
        ctx.moveTo(0, -particle.size * 1.4);
        ctx.quadraticCurveTo(
          particle.size * 1.1,
          0,
          0,
          particle.size * 1.4
        );
        ctx.quadraticCurveTo(
          -particle.size * 1.1,
          0,
          0,
          -particle.size * 1.4
        );
        ctx.fill();
      }

      if (particle.type === "dust") {
        ctx.fillStyle = "rgba(255, 243, 208, 0.9)";
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 0.42, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = "rgba(247, 210, 119, 0.9)";
        ctx.shadowBlur = 12;
        ctx.fill();
      }

      ctx.restore();
    }

    function draw(now: number) {
      const age = now - startTime;
      const progress = Math.min(age / 2400, 1);

      ctx.clearRect(0, 0, width, height);

      drawRoyalAura(progress);

      particles.forEach((particle) => {
        drawParticle(particle, age);
      });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      animationRef.current = null;
    }

    animationRef.current = requestAnimationFrame(draw);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      ctx.clearRect(0, 0, width, height);
    };
  }, [enabled, effectKey]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[60] h-full w-full"
      aria-hidden="true"
    />
  );
}