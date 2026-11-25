import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';

type NodeStatus = 'active' | 'drifting' | 'inactive' | 'reconnecting';

interface CustomerNode {
  angle: number;
  baseRadiusFactor: number;
  currentRadiusFactor: number;
  speed: number;
  size: number;
  status: NodeStatus;
  driftTimer: number;
  reconnectProgress: number;
  guestName?: string;
}

interface PulseWave {
  radius: number;
  alpha: number;
}

const GUEST_NAMES = ['Rohan', 'Ananya', 'Karan', 'Meera', 'Vikram'];

export function CustomerNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let isVisible = true;
    let width = container.clientWidth || 520;
    let height = container.clientHeight || 520;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isLowPower =
      typeof navigator !== 'undefined' &&
      typeof navigator.hardwareConcurrency === 'number' &&
      navigator.hardwareConcurrency <= 2;

    const nodeCount = isLowPower ? 18 : 26;
    const nodes: CustomerNode[] = Array.from({ length: nodeCount }, (_, idx) => {
      const ring = idx % 3;
      const baseRadiusFactor = ring === 0 ? 0.23 : ring === 1 ? 0.34 : 0.43;
      const initialStatus: NodeStatus =
        idx === 6 || idx === 18
          ? 'inactive'
          : idx === 12
            ? 'drifting'
            : 'active';
      // Space labeled nodes evenly across mid-angles away from top/bottom badge corners
      const isLabeled = idx === 2 || idx === 9 || idx === 16 || idx === 22;
      return {
        angle: (idx / nodeCount) * Math.PI * 2 + 0.35,
        baseRadiusFactor,
        currentRadiusFactor:
          initialStatus === 'inactive' ? baseRadiusFactor + 0.045 : baseRadiusFactor,
        speed: (0.00095 + (idx % 4) * 0.00028) * (idx % 2 === 0 ? 1 : -0.82),
        size: isLabeled ? 5.2 : 3.2 + (idx % 3) * 0.75,
        status: initialStatus,
        driftTimer: (idx * 37) % 320,
        reconnectProgress: 0,
        guestName: isLabeled
          ? GUEST_NAMES[Math.floor(idx / 6) % GUEST_NAMES.length]
          : undefined,
      };
    });

    const pulses: PulseWave[] = [{ radius: 28, alpha: 0.5 }];
    let frameTick = 0;

    const drawFrame = (advance: boolean) => {
      const dark = theme === 'dark';
      const emerald = dark ? '#22C55E' : '#15803D';
      const emeraldBright = dark ? '#86EFAC' : '#166534';
      const amber = dark ? '#F59E0B' : '#B45309';
      const muted = dark ? '#5F776A' : '#6F8678';
      const ringStroke = dark ? 'rgba(134, 239, 172, 0.11)' : 'rgba(21, 128, 61, 0.13)';
      const pillBg = dark ? 'rgba(8, 13, 11, 0.86)' : 'rgba(255, 255, 255, 0.92)';
      const pillBorder = dark ? 'rgba(38, 56, 45, 0.9)' : 'rgba(220, 229, 223, 0.95)';
      const textFill = dark ? '#F5F7F5' : '#102019';

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const maxDim = Math.min(width, height);

      // Ambient core glow
      const radial = ctx.createRadialGradient(cx, cy, 4, cx, cy, maxDim * 0.48);
      radial.addColorStop(0, dark ? 'rgba(34, 197, 94, 0.20)' : 'rgba(21, 128, 61, 0.12)');
      radial.addColorStop(0.55, dark ? 'rgba(34, 197, 94, 0.04)' : 'rgba(21, 128, 61, 0.03)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(cx, cy, maxDim * 0.48, 0, Math.PI * 2);
      ctx.fill();

      // Concentric orbit tracks
      [0.23, 0.34, 0.44].forEach((factor, i) => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxDim * factor, 0, Math.PI * 2);
        ctx.strokeStyle = ringStroke;
        ctx.lineWidth = 1;
        if (i === 2) ctx.setLineDash([4, 6]);
        else ctx.setLineDash([]);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Radar pulses from central Revist emblem
      if (advance) {
        frameTick += 1;
        if (frameTick % 145 === 0) {
          pulses.push({ radius: 26, alpha: 0.48 });
        }
      }

      for (let i = pulses.length - 1; i >= 0; i -= 1) {
        const p = pulses[i];
        if (advance) {
          p.radius += 1.35;
          p.alpha *= 0.985;
        }
        ctx.beginPath();
        ctx.arc(cx, cy, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = dark
          ? `rgba(34, 197, 94, ${p.alpha.toFixed(3)})`
          : `rgba(21, 128, 61, ${p.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        if (p.radius > maxDim * 0.45 || p.alpha < 0.02) {
          pulses.splice(i, 1);
        }
      }

      const labelQueue: Array<{ x: number; y: number; text: string; color: string }> = [];

      // Update & draw customer nodes
      nodes.forEach((node, idx) => {
        if (advance) {
          node.angle += node.speed;
          node.driftTimer += 1;

          if (node.status === 'active' && node.driftTimer > 380 && idx % 3 !== 0) {
            node.status = 'drifting';
            node.driftTimer = 0;
          } else if (node.status === 'drifting') {
            node.currentRadiusFactor +=
              (node.baseRadiusFactor + 0.055 - node.currentRadiusFactor) * 0.02;
            if (node.driftTimer > 150) {
              node.status = 'inactive';
              node.driftTimer = 0;
            }
          } else if (node.status === 'inactive') {
            if (node.driftTimer > 170) {
              node.status = 'reconnecting';
              node.reconnectProgress = 0;
              node.driftTimer = 0;
            }
          } else if (node.status === 'reconnecting') {
            node.reconnectProgress += 0.02;
            node.currentRadiusFactor += (node.baseRadiusFactor - node.currentRadiusFactor) * 0.04;
            if (node.reconnectProgress >= 1) {
              node.status = 'active';
              node.reconnectProgress = 0;
              node.driftTimer = 0;
            }
          } else {
            node.currentRadiusFactor += (node.baseRadiusFactor - node.currentRadiusFactor) * 0.03;
          }
        }

        const r = maxDim * node.currentRadiusFactor;
        const x = cx + Math.cos(node.angle) * r;
        const y = cy + Math.sin(node.angle) * r * 0.9;

        // Subtle baseline tether for active/reconnecting nodes
        if (node.status === 'active' || node.status === 'reconnecting') {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.strokeStyle =
            node.status === 'reconnecting'
              ? dark
                ? 'rgba(134, 239, 172, 0.45)'
                : 'rgba(21, 128, 61, 0.35)'
              : dark
                ? 'rgba(34, 197, 94, 0.11)'
                : 'rgba(21, 128, 61, 0.10)';
          ctx.lineWidth = node.status === 'reconnecting' ? 1.5 : 0.8;
          ctx.stroke();
        }

        // Animated WhatsApp reconnection packet along curve
        if (node.status === 'reconnecting') {
          const t = node.reconnectProgress;
          const ctrlX = (cx + x) * 0.5 + (y - cy) * 0.18;
          const ctrlY = (cy + y) * 0.5 - (x - cx) * 0.18;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.quadraticCurveTo(ctrlX, ctrlY, x, y);
          ctx.strokeStyle = emeraldBright;
          ctx.lineWidth = 1.6;
          ctx.stroke();

          const px = (1 - t) * (1 - t) * cx + 2 * (1 - t) * t * ctrlX + t * t * x;
          const py = (1 - t) * (1 - t) * cy + 2 * (1 - t) * t * ctrlY + t * t * y;
          ctx.beginPath();
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = emeraldBright;
          ctx.fill();
        }

        // Node halo
        if (node.status === 'active' || node.status === 'reconnecting' || node.status === 'inactive') {
          ctx.beginPath();
          ctx.arc(x, y, node.size * 2.1, 0, Math.PI * 2);
          ctx.fillStyle =
            node.status === 'inactive'
              ? dark
                ? 'rgba(245, 158, 11, 0.15)'
                : 'rgba(180, 83, 9, 0.13)'
              : dark
                ? 'rgba(34, 197, 94, 0.18)'
                : 'rgba(21, 128, 61, 0.14)';
          ctx.fill();
        }

        const nodeColor =
          node.status === 'inactive'
            ? amber
            : node.status === 'drifting'
              ? muted
              : node.status === 'reconnecting'
                ? emeraldBright
                : emerald;

        ctx.beginPath();
        ctx.arc(x, y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        if (node.guestName) {
          // Keep displayed day count strictly consistent with node status & legend
          const daySuffix =
            node.status === 'inactive'
              ? '26d'
              : node.status === 'drifting'
                ? '19d'
                : node.status === 'reconnecting'
                  ? 'opt-in'
                  : `${4 + (idx % 10)}d`;
          labelQueue.push({
            x,
            y,
            text: `${node.guestName} · ${daySuffix}`,
            color: nodeColor,
          });
        }
      });

      // Draw label pills AFTER all dots/lines so orbiting geometry never crosses over text
      ctx.font = '500 10.5px "JetBrains Mono", monospace';
      for (const item of labelQueue) {
        const metrics = ctx.measureText(item.text);
        const padX = 7;
        const boxW = metrics.width + padX * 2 + 8;
        const boxH = 20;
        // Clamp pill inside canvas bounds and away from corner badges
        const lx = Math.min(Math.max(item.x + 10, 8), width - boxW - 8);
        const ly = Math.min(Math.max(item.y - boxH / 2, 48), height - boxH - 48);

        ctx.beginPath();
        ctx.roundRect(lx, ly, boxW, boxH, 10);
        ctx.fillStyle = pillBg;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = pillBorder;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(lx + 9, ly + boxH / 2, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();

        ctx.fillStyle = textFill;
        ctx.textBaseline = 'middle';
        ctx.fillText(item.text, lx + 15, ly + boxH / 2 + 0.5);
        ctx.textBaseline = 'alphabetic';
      }

      // Central Revist Hub disk
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fillStyle = dark ? '#0C1712' : '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = emerald;
      ctx.stroke();

      ctx.fillStyle = emerald;
      ctx.font = '700 20px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('R', cx, cy + 1);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      ctx.restore();
    };

    const resize = () => {
      width = container.clientWidth || 520;
      height = container.clientHeight || 520;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      drawFrame(false);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const visObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    visObserver.observe(container);

    if (reducedMotion) {
      drawFrame(false);
      return () => {
        resizeObserver.disconnect();
        visObserver.disconnect();
      };
    }

    const renderLoop = () => {
      if (isVisible) {
        drawFrame(true);
      }
      animId = window.requestAnimationFrame(renderLoop);
    };

    animId = window.requestAnimationFrame(renderLoop);

    return () => {
      window.cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      visObserver.disconnect();
    };
  }, [theme, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[540px] select-none"
      role="img"
      aria-label="Illustrative customer network visualization showing active customers, customers drifting past 21 days of inactivity, and eligible reconnections via Revist"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />

      <div className="pointer-events-none absolute inset-x-2 top-2 sm:inset-x-4 sm:top-4 flex flex-wrap items-center justify-between gap-1.5">
        <div className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-[11px] font-mono-data text-[var(--text-secondary)] flex items-center gap-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)] shrink-0" />
          Active (&le; 21 days)
        </div>

        <div className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-[11px] font-mono-data text-[var(--text-secondary)] flex items-center gap-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--warning-amber)] shrink-0" />
          Inactive (&gt; 21 days)
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-2 bottom-2 sm:bottom-3 flex justify-center">
        <div className="max-w-full rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/92 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 text-center text-[10px] sm:text-[11px] leading-tight font-mono-data text-[var(--text-secondary)] shadow-sm">
          Illustrative network · Eligible opt-in reconnection
        </div>
      </div>
    </div>
  );
}
