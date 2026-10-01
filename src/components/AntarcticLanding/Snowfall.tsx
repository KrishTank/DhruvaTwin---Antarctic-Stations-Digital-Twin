/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DhruvaTwin Natural Multi-Layer Snowflake Canvas
 * Renders authentic, varied falling ❄️ snowflakes (❄, ❅, ❆) with natural
 * horizontal wind drifting, rotation, and 3-tier atmospheric depth.
 * 
 * Positioned behind UI content (z-index: 10) for maximum text readability.
 * 
 * National Centre for Polar and Ocean Research (NCPOR) / MoES
 * Smart India Hackathon 2026 - PS 26060 - Team HackFinity007
 */

import React, { useEffect, useRef } from 'react';

interface Snowflake {
  x: number;
  y: number;
  size: number;
  symbol: string;
  depth: 'bg' | 'mid' | 'fg';
  speedY: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayPhase: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}

const SNOWFLAKE_SYMBOLS = ['❄', '❅', '❆'];

export const Snowfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Desktop particle count: ~110-130 flakes for elegant, cinematic, clutter-free snowfall
    const flakeCount = prefersReducedMotion ? 30 : Math.min(130, Math.floor(width / 14));
    const flakes: Snowflake[] = [];

    for (let i = 0; i < flakeCount; i++) {
      // 3 Depth layers: 45% bg, 35% mid, 20% fg
      const randDepth = Math.random();
      let depth: 'bg' | 'mid' | 'fg' = 'mid';
      let size = 15;
      let opacity = 0.5;
      let speedY = 1.0;
      let color = '#E6F4FE';

      if (randDepth < 0.45) {
        depth = 'bg';
        size = 8 + Math.random() * 5; // 8 - 13px
        opacity = 0.18 + Math.random() * 0.18; // faint, distant
        speedY = 0.35 + Math.random() * 0.45;
        color = '#B4D5F0';
      } else if (randDepth < 0.8) {
        depth = 'mid';
        size = 13 + Math.random() * 6; // 13 - 19px
        opacity = 0.4 + Math.random() * 0.25;
        speedY = 0.75 + Math.random() * 0.65;
        color = '#E0F0FC';
      } else {
        depth = 'fg';
        size = 19 + Math.random() * 8; // 19 - 27px
        opacity = 0.6 + Math.random() * 0.25;
        speedY = 1.2 + Math.random() * 0.85;
        color = '#FFFFFF';
      }

      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        symbol: SNOWFLAKE_SYMBOLS[Math.floor(Math.random() * SNOWFLAKE_SYMBOLS.length)],
        depth,
        speedY,
        swaySpeed: 0.6 + Math.random() * 0.8,
        swayAmplitude: 0.8 + Math.random() * 1.5,
        swayPhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity,
        color,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let animationId: number;
    let time = 0;

    const render = () => {
      animationId = requestAnimationFrame(render);
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Polar prevailing wind gust (slow sinusoidal drift eastward)
      const windForce = Math.sin(time * 0.4) * 0.4 + 0.3;

      for (let i = 0; i < flakes.length; i++) {
        const flake = flakes[i];

        if (!prefersReducedMotion) {
          // Continuous vertical descent
          flake.y += flake.speedY;

          // Natural horizontal wind drift & sinusoidal sway
          const sway = Math.sin(time * flake.swaySpeed + flake.swayPhase) * flake.swayAmplitude;
          flake.x += sway + windForce * (flake.depth === 'fg' ? 1.3 : flake.depth === 'mid' ? 1.0 : 0.6);

          // Subtle rotational flutter
          flake.rotation += flake.rotationSpeed;

          // Continuous wrap-around
          if (flake.y > height + 35) {
            flake.y = -30;
            flake.x = Math.random() * width;
          }
          if (flake.x > width + 40) {
            flake.x = -40;
          } else if (flake.x < -40) {
            flake.x = width + 40;
          }
        }

        // Draw individual snowflake glyph
        ctx.save();
        ctx.translate(flake.x, flake.y);
        ctx.rotate(flake.rotation);
        ctx.globalAlpha = flake.opacity;
        ctx.fillStyle = flake.color;
        ctx.font = `${Math.round(flake.size)}px 'Segoe UI Symbol', 'Apple Symbols', 'Arial Unicode MS', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Soft subtle glow for foreground flakes
        if (flake.depth === 'fg') {
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(0, 224, 198, 0.35)';
        } else if (flake.depth === 'mid') {
          ctx.shadowBlur = 3;
          ctx.shadowColor = 'rgba(74, 158, 255, 0.2)';
        }

        ctx.fillText(flake.symbol, 0, 0);
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="dhruva-snow-canvas absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 4 }}
      aria-hidden="true"
    />
  );
};
