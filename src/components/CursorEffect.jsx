import { useEffect, useRef, useState } from "react";

/**
 * Canvas UI Displacement Component with Velocity Physics & Chromatic Aberration
 *
 * Breaks the layout into a configurable pixel grid and distorts it dynamically
 * based on cursor velocity. As grid pieces drag, their edges split into red and
 * blue chromatic aberration fringes for a high-tech digital glass aesthetic.
 */
export function CursorEffect() {
  const canvasRef = useRef(null);
  const [show, setShow] = useState(false);

  // Mouse & physics tracking
  const mouse = useRef({
    x: -200,
    y: -200,
    prevX: -200,
    prevY: -200,
    vx: 0,
    vy: 0,
    speed: 0,
  });

  const reticle = useRef({
    x: -200,
    y: -200,
    scale: 1,
  });

  const isHovered = useRef(false);
  const isClicked = useRef(false);
  const isVisible = useRef(false);
  const rafId = useRef(null);

  // Active displaced cells map: key -> { origX, origY, x, y, vx, vy, chroma, alpha }
  const activeCells = useRef(new Map());

  // Shockwaves queue
  const shockwaves = useRef([]);

  useEffect(() => {
    // Only run on non-touch pointer devices
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

    // Configuration for pixel grid displacement
    const GRID_SIZE = 24; // Size of each square pixel cell in px
    const RADIUS = 110; // Influence radius around cursor
    const SPRING = 0.12; // Elastic return speed
    const DAMPING = 0.82; // Resistance / oscillation decay

    const stimulateGrid = (curX, curY, velX, velY, extraRadius = 0) => {
      const radius = (RADIUS + extraRadius) * (isHovered.current ? 1.25 : 1);
      const minCol = Math.max(0, Math.floor((curX - radius) / GRID_SIZE));
      const maxCol = Math.min(Math.floor(width / GRID_SIZE), Math.ceil((curX + radius) / GRID_SIZE));
      const minRow = Math.max(0, Math.floor((curY - radius) / GRID_SIZE));
      const maxRow = Math.min(Math.floor(height / GRID_SIZE), Math.ceil((curY + radius) / GRID_SIZE));

      const speed = Math.sqrt(velX * velX + velY * velY);

      for (let c = minCol; c <= maxCol; c++) {
        for (let r = minRow; r <= maxRow; r++) {
          const origX = c * GRID_SIZE;
          const origY = r * GRID_SIZE;
          const centerX = origX + GRID_SIZE / 2;
          const centerY = origY + GRID_SIZE / 2;

          const dx = centerX - curX;
          const dy = centerY - curY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius) {
            const factor = Math.pow(1 - dist / radius, 1.8);
            const key = `${c}_${r}`;

            let cell = activeCells.current.get(key);
            if (!cell) {
              cell = {
                origX,
                origY,
                x: origX,
                y: origY,
                vx: 0,
                vy: 0,
                chroma: 0,
                alpha: 0,
              };
              activeCells.current.set(key, cell);
            }

            // Combine velocity drag with radial lens displacement
            const dirX = dist > 0.001 ? dx / dist : 0;
            const dirY = dist > 0.001 ? dy / dist : 0;

            const dragForce = 0.42 * factor;
            const pushForce = Math.min(18, speed * 0.35 + 4) * factor;

            cell.vx += velX * dragForce + dirX * pushForce * 0.25;
            cell.vy += velY * dragForce + dirY * pushForce * 0.25;
            cell.alpha = Math.min(1, cell.alpha + factor * 0.85);
          }
        }
      }
    };

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

      const rawDx = curX - mouse.current.prevX;
      const rawDy = curY - mouse.current.prevY;

      // Filtered velocity with smooth lerp
      mouse.current.vx = mouse.current.vx * 0.4 + rawDx * 0.6;
      mouse.current.vy = mouse.current.vy * 0.4 + rawDy * 0.6;
      mouse.current.speed = Math.sqrt(
        mouse.current.vx * mouse.current.vx + mouse.current.vy * mouse.current.vy
      );

      mouse.current.x = curX;
      mouse.current.y = curY;

      stimulateGrid(curX, curY, mouse.current.vx, mouse.current.vy);

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

      // Create a high-energy chromatic aberration shockwave ripple
      shockwaves.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: 180,
        speed: 14,
        strength: 22,
        alpha: 1,
      });

      stimulateGrid(e.clientX, e.clientY, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, 60);
    };

    const onUp = () => {
      isClicked.current = false;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Process radial shockwaves
      const activeWaves = [];
      for (let i = 0; i < shockwaves.current.length; i++) {
        const sw = shockwaves.current[i];
        sw.radius += sw.speed;
        sw.alpha = 1 - sw.radius / sw.maxRadius;

        if (sw.alpha > 0.05 && sw.radius < sw.maxRadius) {
          // Stimulate grid along shockwave perimeter
          const count = 28;
          for (let a = 0; a < count; a++) {
            const angle = (a / count) * Math.PI * 2;
            const px = sw.x + Math.cos(angle) * sw.radius;
            const py = sw.y + Math.sin(angle) * sw.radius;
            const force = sw.strength * sw.alpha;
            stimulateGrid(px, py, Math.cos(angle) * force, Math.sin(angle) * force, 15);
          }
          activeWaves.push(sw);
        }
      }
      shockwaves.current = activeWaves;

      // 2. Update & render active displaced pixel grid cells with Chromatic Aberration
      const cellsToDelete = [];

      activeCells.current.forEach((cell, key) => {
        // Spring physics: pull toward origX, origY
        const ax = (cell.origX - cell.x) * SPRING;
        const ay = (cell.origY - cell.y) * SPRING;

        cell.vx = (cell.vx + ax) * DAMPING;
        cell.vy = (cell.vy + ay) * DAMPING;

        cell.x += cell.vx;
        cell.y += cell.vy;

        const dispX = cell.x - cell.origX;
        const dispY = cell.y - cell.origY;
        const dispDist = Math.sqrt(dispX * dispX + dispY * dispY);
        const velocity = Math.sqrt(cell.vx * cell.vx + cell.vy * cell.vy);

        // Chromatic aberration magnitude is proportional to displacement velocity
        cell.chroma = Math.min(12, velocity * 1.45 + dispDist * 0.4);
        cell.alpha *= 0.965;

        // Draw if visually active
        if (cell.alpha > 0.03 || dispDist > 0.25 || velocity > 0.15) {
          const s = GRID_SIZE - 2; // leave 2px gap between pixel grid pieces
          const px = cell.x + 1;
          const py = cell.y + 1;

          const renderAlpha = Math.min(1, Math.max(cell.alpha, dispDist / 18, velocity / 10));

          // Calculate normalized displacement vector for directional RGB split
          const len = dispDist > 0.001 ? dispDist : 1;
          const nx = (dispX / len) * cell.chroma;
          const ny = (dispY / len) * cell.chroma;

          // ── Chromatic Aberration: RED Channel Fringe ──
          if (cell.chroma > 0.5) {
            ctx.save();
            ctx.strokeStyle = `rgba(255, 30, 95, ${renderAlpha * 0.85})`;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(px + nx, py + ny, s, s);
            ctx.restore();
          }

          // ── Chromatic Aberration: BLUE/CYAN Channel Fringe ──
          if (cell.chroma > 0.5) {
            ctx.save();
            ctx.strokeStyle = `rgba(0, 240, 255, ${renderAlpha * 0.85})`;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(px - nx, py - ny, s, s);
            ctx.restore();
          }

          // ── Core Digital Glass Tile ──
          ctx.save();
          // Glass surface fill
          ctx.fillStyle = `rgba(255, 255, 255, ${renderAlpha * 0.06})`;
          ctx.fillRect(px, py, s, s);

          // Crisp White/Glass border
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, renderAlpha * 0.65)})`;
          ctx.lineWidth = 0.9;
          ctx.strokeRect(px, py, s, s);

          // Micro digital tech dot at cell center
          if (renderAlpha > 0.25) {
            ctx.fillStyle = `rgba(0, 240, 255, ${renderAlpha * 0.75})`;
            ctx.fillRect(px + s / 2 - 1, py + s / 2 - 1, 2, 2);
          }
          ctx.restore();
        } else {
          cellsToDelete.push(key);
        }
      });

      for (let i = 0; i < cellsToDelete.length; i++) {
        activeCells.current.delete(cellsToDelete[i]);
      }

      // 3. Render precision Digital Glass HUD reticle at pointer
      if (isVisible.current && mouse.current.x > 0 && mouse.current.y > 0) {
        reticle.current.x += (mouse.current.x - reticle.current.x) * 0.35;
        reticle.current.y += (mouse.current.y - reticle.current.y) * 0.35;

        const targetScale = isClicked.current ? 0.7 : isHovered.current ? 1.6 : 1;
        reticle.current.scale += (targetScale - reticle.current.scale) * 0.2;

        const rx = reticle.current.x;
        const ry = reticle.current.y;
        const sc = reticle.current.scale;

        const speed = mouse.current.speed;
        const reticleChroma = Math.min(8, speed * 0.35 + (isHovered.current ? 4 : 1));

        // Outer chromatic split rings on cursor reticle
        const ringRadius = 14 * sc;

        // Red split
        ctx.strokeStyle = `rgba(255, 30, 95, ${isHovered.current ? 0.9 : 0.65})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(rx + reticleChroma * 0.6, ry, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Cyan split
        ctx.strokeStyle = `rgba(0, 240, 255, ${isHovered.current ? 0.9 : 0.65})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(rx - reticleChroma * 0.6, ry, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Center glass lens ring
        ctx.strokeStyle = `rgba(255, 255, 255, ${isHovered.current ? 0.95 : 0.75})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rx, ry, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair reticle ticks [ + ]
        const tick = 4 * sc;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(rx - tick, ry);
        ctx.lineTo(rx + tick, ry);
        ctx.moveTo(rx, ry - tick);
        ctx.lineTo(rx, ry + tick);
        ctx.stroke();

        // Sharp precision center pointer dot
        ctx.fillStyle = isHovered.current ? "#00F2FE" : "#FFFFFF";
        ctx.beginPath();
        ctx.arc(mouse.current.x, mouse.current.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
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
