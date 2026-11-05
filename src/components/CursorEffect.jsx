import { useEffect, useRef, useState } from "react";

/**
 * Canvas UI Displacement Component with Velocity Physics & Chromatic Aberration
 *
 * Breaks the layout into a visible, configurable pixel grid that stretches,
 * distorts, and drags based on cursor velocity. As pieces drag, their edges split
 * into vivid neon red and cyan chromatic aberration fringes for a high-tech
 * digital glass displacement effect.
 */
export function CursorEffect() {
  const canvasRef = useRef(null);
  const [show, setShow] = useState(false);

  // Mouse & physics tracking
  const mouse = useRef({
    x: -300,
    y: -300,
    prevX: -300,
    prevY: -300,
    vx: 0,
    vy: 0,
    speed: 0,
  });

  const reticle = useRef({
    x: -300,
    y: -300,
    scale: 1,
  });

  const isHovered = useRef(false);
  const isClicked = useRef(false);
  const isVisible = useRef(false);
  const rafId = useRef(null);

  // Persistent grid state map: `${c}_${r}` -> { origX, origY, dispX, dispY, vx, vy, alpha }
  const gridCells = useRef(new Map());

  // Shockwaves queue
  const shockwaves = useRef([]);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setShow(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx = canvas.getContext("2d");
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    // ── Grid Configuration ──
    const GRID_SIZE = 32; // Size of each square grid cell
    const TILE_PADDING = 3; // Space between grid tiles (gives clean individual pixel block look)
    const TILE_SIZE = GRID_SIZE - TILE_PADDING;
    const INFLUENCE_RADIUS = 220; // Radius around cursor where grid is active & visible

    const onMove = (e) => {
      const curX = e.clientX;
      const curY = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        mouse.current.prevX = curX;
        mouse.current.prevY = curY;
        reticle.current.x = curX;
        reticle.current.y = curY;
      }

      const dx = curX - mouse.current.prevX;
      const dy = curY - mouse.current.prevY;

      // Responsive velocity calculation with smoothing
      mouse.current.vx = mouse.current.vx * 0.35 + dx * 0.65;
      mouse.current.vy = mouse.current.vy * 0.35 + dy * 0.65;
      mouse.current.speed = Math.sqrt(
        mouse.current.vx * mouse.current.vx + mouse.current.vy * mouse.current.vy
      );

      mouse.current.x = curX;
      mouse.current.y = curY;

      mouse.current.prevX = curX;
      mouse.current.prevY = curY;
    };

    const onLeave = () => {
      isVisible.current = false;
    };

    const onEnter = () => {
      isVisible.current = true;
    };

    const onOver = (e) => {
      if (
        e.target.closest(
          "a, button, [role=button], input, textarea, select, .project-card, .feature-card, .btn-primary, .btn-outline, .badge-chip, .contact-card, .hero-profile"
        )
      ) {
        isHovered.current = true;
      }
    };

    const onOut = (e) => {
      if (
        e.target.closest(
          "a, button, [role=button], input, textarea, select, .project-card, .feature-card, .btn-primary, .btn-outline, .badge-chip, .contact-card, .hero-profile"
        )
      ) {
        isHovered.current = false;
      }
    };

    const onDown = (e) => {
      isClicked.current = true;

      // Explosive radial shockwave that ripples through the grid
      shockwaves.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 12,
        maxRadius: 260,
        speed: 16,
        strength: 38,
      });
    };

    const onUp = () => {
      isClicked.current = false;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Decay velocity naturally if mouse slows down
      mouse.current.vx *= 0.88;
      mouse.current.vy *= 0.88;
      mouse.current.speed = Math.sqrt(
        mouse.current.vx * mouse.current.vx + mouse.current.vy * mouse.current.vy
      );

      // Smooth reticle positioning
      reticle.current.x += (mouse.current.x - reticle.current.x) * 0.3;
      reticle.current.y += (mouse.current.y - reticle.current.y) * 0.3;

      const targetScale = isClicked.current ? 0.7 : isHovered.current ? 1.5 : 1;
      reticle.current.scale += (targetScale - reticle.current.scale) * 0.2;

      // ── Process Shockwaves ──
      const activeShockwaves = [];
      for (let i = 0; i < shockwaves.current.length; i++) {
        const sw = shockwaves.current[i];
        sw.radius += sw.speed;
        if (sw.radius < sw.maxRadius) {
          activeShockwaves.push(sw);
        }
      }
      shockwaves.current = activeShockwaves;

      // ── Process Grid Tiles around Cursor & Shockwaves ──
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const speed = mouse.current.speed;

      const radius = isHovered.current ? INFLUENCE_RADIUS * 1.3 : INFLUENCE_RADIUS;
      const minCol = Math.max(0, Math.floor((mx - radius) / GRID_SIZE));
      const maxCol = Math.min(Math.floor(width / GRID_SIZE), Math.ceil((mx + radius) / GRID_SIZE));
      const minRow = Math.max(0, Math.floor((my - radius) / GRID_SIZE));
      const maxRow = Math.min(Math.floor(height / GRID_SIZE), Math.ceil((my + radius) / GRID_SIZE));

      // Mark cells in current influence area
      const currentActiveKeys = new Set();

      if (isVisible.current && mx > -100 && my > -100) {
        for (let c = minCol; c <= maxCol; c++) {
          for (let r = minRow; r <= maxRow; r++) {
            const origX = c * GRID_SIZE;
            const origY = r * GRID_SIZE;
            const centerX = origX + GRID_SIZE / 2;
            const centerY = origY + GRID_SIZE / 2;

            const dx = centerX - mx;
            const dy = centerY - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius) {
              const key = `${c}_${r}`;
              currentActiveKeys.add(key);

              let cell = gridCells.current.get(key);
              if (!cell) {
                cell = {
                  origX,
                  origY,
                  dispX: 0,
                  dispY: 0,
                  vx: 0,
                  vy: 0,
                  alpha: 0,
                };
                gridCells.current.set(key, cell);
              }

              // Distance falloff (smooth cubic curve)
              const factor = Math.pow(1 - dist / radius, 1.5);

              // 1. Velocity Drag (drags the grid squares strongly with mouse direction)
              const dragMultiplier = 2.4;
              const dragX = mouse.current.vx * dragMultiplier * factor;
              const dragY = mouse.current.vy * dragMultiplier * factor;

              // 2. Convex Lens Push (pushes grid blocks outward from cursor center)
              const dirX = dist > 0.001 ? dx / dist : 0;
              const dirY = dist > 0.001 ? dy / dist : 0;
              const pushMultiplier = Math.min(30, speed * 1.8 + 8);
              const pushX = dirX * pushMultiplier * factor;
              const pushY = dirY * pushMultiplier * factor;

              // 3. Shockwave impulse
              let shockX = 0;
              let shockY = 0;
              for (let w = 0; w < shockwaves.current.length; w++) {
                const sw = shockwaves.current[w];
                const swDist = Math.sqrt((centerX - sw.x) ** 2 + (centerY - sw.y) ** 2);
                const diff = Math.abs(swDist - sw.radius);
                if (diff < 35) {
                  const swFactor = (1 - diff / 35) * (1 - sw.radius / sw.maxRadius);
                  const swDirX = swDist > 0 ? (centerX - sw.x) / swDist : 0;
                  const swDirY = swDist > 0 ? (centerY - sw.y) / swDist : 0;
                  shockX += swDirX * sw.strength * swFactor;
                  shockY += swDirY * sw.strength * swFactor;
                }
              }

              const targetDispX = dragX + pushX + shockX;
              const targetDispY = dragY + pushY + shockY;

              // Spring physics: pull toward target displacement
              cell.vx += (targetDispX - cell.dispX) * 0.22;
              cell.vy += (targetDispY - cell.dispY) * 0.22;

              // Target visibility alpha (clearly visible ambient grid + active illumination)
              const targetAlpha = Math.min(0.95, factor * 0.65 + (speed / 15) * 0.4 + 0.15);
              cell.alpha += (targetAlpha - cell.alpha) * 0.25;
            }
          }
        }
      }

      // ── Update and Render All Active Grid Cells ──
      const keysToRemove = [];

      gridCells.current.forEach((cell, key) => {
        // Natural elastic decay toward origin
        if (!currentActiveKeys.has(key)) {
          cell.vx += (0 - cell.dispX) * 0.15;
          cell.vy += (0 - cell.dispY) * 0.15;
          cell.alpha *= 0.88;
        }

        cell.vx *= 0.82; // damping / friction
        cell.vy *= 0.82;
        cell.dispX += cell.vx;
        cell.dispY += cell.vy;

        const dispMag = Math.sqrt(cell.dispX * cell.dispX + cell.dispY * cell.dispY);

        if (cell.alpha < 0.02 && dispMag < 0.2) {
          keysToRemove.push(key);
          return;
        }

        // Draw this grid tile with Chromatic Aberration
        const px = cell.origX + cell.dispX + TILE_PADDING / 2;
        const py = cell.origY + cell.dispY + TILE_PADDING / 2;
        const s = TILE_SIZE;

        // Chromatic Aberration Offset (splits proportional to displacement & velocity)
        const chromaDist = Math.min(14, dispMag * 0.55 + speed * 0.35 + 1.2);
        const normX = dispMag > 0.001 ? cell.dispX / dispMag : 1;
        const normY = dispMag > 0.001 ? cell.dispY / dispMag : 0;

        const redShiftX = normX * chromaDist;
        const redShiftY = normY * chromaDist;

        // 1. ── VIVID RED FRINGE (Leading Edge) ──
        ctx.save();
        ctx.strokeStyle = `rgba(255, 30, 86, ${cell.alpha * 0.95})`;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(px + redShiftX, py + redShiftY, s, s);
        ctx.restore();

        // 2. ── VIVID CYAN/BLUE FRINGE (Trailing Edge) ──
        ctx.save();
        ctx.strokeStyle = `rgba(0, 240, 255, ${cell.alpha * 0.95})`;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(px - redShiftX, py - redShiftY, s, s);
        ctx.restore();

        // 3. ── CORE DIGITAL GLASS PIXEL TILE ──
        ctx.save();
        // Translucent glass fill
        ctx.fillStyle = `rgba(0, 242, 254, ${cell.alpha * 0.08})`;
        ctx.fillRect(px, py, s, s);

        // Crisp white/cyan primary border
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, cell.alpha * 0.85)})`;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(px, py, s, s);

        // Digital micro tech coordinate dot in tile center
        ctx.fillStyle = `rgba(0, 240, 255, ${cell.alpha * 0.9})`;
        ctx.fillRect(px + s / 2 - 1.5, py + s / 2 - 1.5, 3, 3);

        ctx.restore();
      });

      for (let i = 0; i < keysToRemove.length; i++) {
        gridCells.current.delete(keysToRemove[i]);
      }

      // ── Render Precision Digital Glass Reticle at Pointer ──
      if (isVisible.current && mx > -50 && my > -50) {
        const rx = reticle.current.x;
        const ry = reticle.current.y;
        const sc = reticle.current.scale;

        const reticleChroma = Math.min(10, speed * 0.45 + 2);
        const radiusRing = 16 * sc;

        // Red chromatic ring
        ctx.save();
        ctx.strokeStyle = "rgba(255, 30, 86, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rx + reticleChroma, ry, radiusRing, 0, Math.PI * 2);
        ctx.stroke();

        // Cyan chromatic ring
        ctx.strokeStyle = "rgba(0, 240, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(rx - reticleChroma, ry, radiusRing, 0, Math.PI * 2);
        ctx.stroke();

        // White core glass ring
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(rx, ry, radiusRing, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair reticle ticks
        const tLen = 6 * sc;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(rx - tLen, ry);
        ctx.lineTo(rx + tLen, ry);
        ctx.moveTo(rx, ry - tLen);
        ctx.lineTo(rx, ry + tLen);
        ctx.stroke();

        // Lead pointer dot
        ctx.fillStyle = "#00F2FE";
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafId.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("resize", setupCanvas);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("resize", setupCanvas);
    };
  }, []);

  if (!show) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 99999,
        }}
      />
      <style>{`
        /* Hide default browser cursor on fine pointer devices */
        @media (pointer: fine) {
          body, a, button, [role=button], input, textarea, select {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
