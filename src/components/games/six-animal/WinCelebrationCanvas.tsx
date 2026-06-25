//src/components/games/six-animal/WinCelebrationCanvas.tsx

"use client";

import { useEffect, useRef } from "react";

type WinCelebrationCanvasProps = {
  enabled: boolean;
  effectKey: string;
  amountLabel?: string;
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
  type: "goldDust" | "petal" | "coin" | "ember";
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

export default function WinCelebrationCanvas({
  enabled,
  effectKey,
  amountLabel,
}: WinCelebrationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

const activeCanvas = canvasRef.current;
if (!activeCanvas) return;

const drawingContext = activeCanvas.getContext("2d", { alpha: true });
if (!drawingContext) return;

const canvas: HTMLCanvasElement = activeCanvas;
const ctx: CanvasRenderingContext2D = drawingContext;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const startTime = performance.now();
    const particles: Particle[] = [];

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();

    const centerX = width * 0.5;
    const centerY = height * 0.48;

    for (let index = 0; index < 220; index += 1) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const fountainAngle = randomBetween(-Math.PI * 0.88, -Math.PI * 0.18);
      const fountainSpeed = randomBetween(110, 430);

      const isCoin = index % 17 === 0;
      const isPetal = index % 4 === 0;
      const isEmber = index % 7 === 0;

      particles.push({
        x:
          index % 3 === 0
            ? centerX + side * randomBetween(width * 0.18, width * 0.48)
            : centerX + randomBetween(-width * 0.18, width * 0.18),
        y:
          index % 3 === 0
            ? height + randomBetween(0, 80)
            : centerY + randomBetween(-height * 0.1, height * 0.12),
        vx:
          index % 3 === 0
            ? Math.cos(fountainAngle) * fountainSpeed * side * 0.42
            : randomBetween(-150, 150),
        vy:
          index % 3 === 0
            ? Math.sin(fountainAngle) * fountainSpeed
            : randomBetween(-260, -60),
        size: isCoin
          ? randomBetween(5, 12)
          : isPetal
            ? randomBetween(5, 14)
            : randomBetween(2, 6),
        rotate: randomBetween(0, Math.PI * 2),
        spin: randomBetween(-4.5, 4.5),
        life: randomBetween(1900, 3400),
        delay: randomBetween(0, 820),
        type: isCoin
          ? "coin"
          : isPetal
            ? "petal"
            : isEmber
              ? "ember"
              : "goldDust",
      });
    }

    function drawRoomLight(progress: number) {
      const open = easeOutCubic(Math.min(progress / 0.34, 1));
      const fade = progress > 0.72 ? Math.max(0, 1 - (progress - 0.72) / 0.28) : 1;
      const alpha = open * fade;

      ctx.save();

      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        Math.max(width, height) * 0.72
      );

      glow.addColorStop(0, `rgba(255, 243, 208, ${0.34 * alpha})`);
      glow.addColorStop(0.22, `rgba(247, 210, 119, ${0.22 * alpha})`);
      glow.addColorStop(0.52, `rgba(182, 107, 32, ${0.11 * alpha})`);
      glow.addColorStop(1, "rgba(182, 107, 32, 0)");

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.translate(centerX, centerY + height * 0.04);
      ctx.globalAlpha = 0.2 * alpha;

      for (let ray = 0; ray < 28; ray += 1) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * ray) / 28 + progress * 0.42);

        const rayLength = height * randomBetween(0.42, 0.72);
        const rayWidth = width * randomBetween(0.012, 0.026);

        const rayGradient = ctx.createLinearGradient(0, 0, 0, -rayLength);
        rayGradient.addColorStop(0, "rgba(255, 243, 208, 0.52)");
        rayGradient.addColorStop(0.45, "rgba(247, 210, 119, 0.18)");
        rayGradient.addColorStop(1, "rgba(247, 210, 119, 0)");

        ctx.fillStyle = rayGradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(rayWidth, -rayLength);
        ctx.lineTo(-rayWidth, -rayLength);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      ctx.restore();
    }

    function drawRoyalSmoke(progress: number) {
      const smokeAlpha =
        progress < 0.22
          ? progress / 0.22
          : progress > 0.78
            ? Math.max(0, 1 - (progress - 0.78) / 0.22)
            : 1;

      ctx.save();
      ctx.globalAlpha = 0.24 * smokeAlpha;

      for (let index = 0; index < 9; index += 1) {
        const x = width * (0.12 + index * 0.1);
        const y =
          height * 0.68 +
          Math.sin(progress * 5 + index) * 18 -
          progress * 44;

        const radius = width * randomBetween(0.12, 0.22);

        const smoke = ctx.createRadialGradient(x, y, 0, x, y, radius);
        smoke.addColorStop(0, "rgba(255, 231, 157, 0.18)");
        smoke.addColorStop(0.48, "rgba(122, 53, 21, 0.08)");
        smoke.addColorStop(1, "rgba(122, 53, 21, 0)");

        ctx.fillStyle = smoke;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function drawParticle(particle: Particle, age: number) {
      const localAge = age - particle.delay;
      if (localAge < 0 || localAge > particle.life) return;

      const t = localAge / particle.life;
      const eased = easeOutCubic(t);
      const fade =
        t < 0.16 ? t / 0.16 : t > 0.72 ? Math.max(0, 1 - (t - 0.72) / 0.28) : 1;

      const gravity = particle.type === "coin" ? 360 : 250;
      const drift = Math.sin(t * Math.PI * 3 + particle.rotate) * 26;

      const x = particle.x + particle.vx * eased * 1.18 + drift;
      const y =
        particle.y +
        particle.vy * eased * 1.18 +
        0.5 * gravity * t * t;

      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(x, y);
      ctx.rotate(particle.rotate + particle.spin * t * 2.4);

      if (particle.type === "coin") {
        const coin = ctx.createRadialGradient(
          -particle.size * 0.38,
          -particle.size * 0.38,
          1,
          0,
          0,
          particle.size * 1.45
        );

        coin.addColorStop(0, "#fff7d7");
        coin.addColorStop(0.34, "#f7d277");
        coin.addColorStop(0.72, "#b66b20");
        coin.addColorStop(1, "#5a1808");

        ctx.fillStyle = coin;
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          particle.size,
          particle.size * 0.58,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 243, 208, 0.68)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (particle.type === "petal") {
        const petal = ctx.createLinearGradient(
          0,
          -particle.size * 1.4,
          0,
          particle.size * 1.4
        );

        petal.addColorStop(0, "rgba(255, 243, 208, 0.96)");
        petal.addColorStop(0.5, "rgba(247, 210, 119, 0.9)");
        petal.addColorStop(1, "rgba(138, 60, 24, 0.74)");

        ctx.fillStyle = petal;
        ctx.beginPath();
        ctx.moveTo(0, -particle.size * 1.45);
        ctx.bezierCurveTo(
          particle.size * 1.2,
          -particle.size * 0.42,
          particle.size * 1.08,
          particle.size * 0.84,
          0,
          particle.size * 1.42
        );
        ctx.bezierCurveTo(
          -particle.size * 1.08,
          particle.size * 0.84,
          -particle.size * 1.2,
          -particle.size * 0.42,
          0,
          -particle.size * 1.45
        );
        ctx.fill();
      }

      if (particle.type === "ember" || particle.type === "goldDust") {
        ctx.shadowColor = "rgba(247, 210, 119, 0.9)";
        ctx.shadowBlur = particle.type === "ember" ? 18 : 10;
        ctx.fillStyle =
          particle.type === "ember"
            ? "rgba(255, 231, 157, 0.86)"
            : "rgba(255, 243, 208, 0.76)";

        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 0.42, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function draw(now: number) {
      const age = now - startTime;
      const progress = Math.min(age / 3600, 1);

      ctx.clearRect(0, 0, width, height);

      drawRoomLight(progress);
      drawRoyalSmoke(progress);

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
    <div className="pointer-events-none fixed inset-0 z-[65] overflow-hidden">
      <div className="nagani-win-cinema-vignette absolute inset-0" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full mix-blend-screen"
        aria-hidden="true"
      />

      <div className="nagani-win-cinema-title absolute inset-x-0 top-[16%] mx-auto flex max-w-[420px] flex-col items-center px-6 text-center">
        <p className="text-[10px] font-black tracking-[0.32em] text-[#f7d277]/72 drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)]">
          နဂါးနီ ရွှေအိုး
        </p>

        <h2 className="mt-2 bg-[linear-gradient(180deg,#fff7d7_0%,#f7d277_42%,#b66b20_100%)] bg-clip-text text-[34px] font-black leading-none text-transparent drop-shadow-[0_5px_22px_rgba(0,0,0,0.88)]">
          အနိုင်ရပါသည်
        </h2>

        {amountLabel ? (
          <div className="mt-3 rounded-full border border-[#fff3d0]/34 bg-[linear-gradient(135deg,rgba(255,243,208,0.24),rgba(247,210,119,0.14),rgba(74,22,7,0.32))] px-6 py-2 shadow-[0_16px_42px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,243,208,0.2)] backdrop-blur-[2px]">
            <p className="text-[19px] font-black tracking-[0.02em] text-[#fff3d0] drop-shadow-[0_2px_12px_rgba(0,0,0,0.82)]">
              {amountLabel}
            </p>
          </div>
        ) : null}
      </div>

      <style>{`
        @keyframes naganiWinCinemaVignette {
          0% {
            opacity: 0;
          }

          22% {
            opacity: 1;
          }

          100% {
            opacity: 0.68;
          }
        }

        @keyframes naganiWinCinemaTitle {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.92);
            filter: blur(5px);
          }

          34% {
            opacity: 1;
            transform: translateY(0) scale(1.04);
            filter: blur(0);
          }

          58% {
            transform: translateY(0) scale(1);
          }

          100% {
            opacity: 0.96;
            transform: translateY(0) scale(1);
          }
        }

        .nagani-win-cinema-vignette {
          animation: naganiWinCinemaVignette 3.6s ease-out both;
          background:
            radial-gradient(circle at 50% 42%, rgba(255, 217, 122, 0.08), transparent 32%),
            radial-gradient(circle at 50% 50%, transparent 0%, transparent 44%, rgba(0, 0, 0, 0.34) 100%),
            linear-gradient(180deg, rgba(9, 2, 2, 0.12), rgba(9, 2, 2, 0.34));
        }

        .nagani-win-cinema-title {
          animation: naganiWinCinemaTitle 1.25s cubic-bezier(0.18, 0.92, 0.22, 1) both;
        }
      `}</style>
    </div>
  );
}