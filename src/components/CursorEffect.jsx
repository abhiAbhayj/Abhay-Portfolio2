import { useEffect, useRef, useState } from "react";

/**
 * The Interactive Scatter & Dispel (Magnetic Repulsion)
 *
 * A grid/cloud of small 3D isometric cubes floats calmly in the background.
 * When the cursor passes over them, the cubes push away from the mouse like
 * magnets with matching poles (magnetic repulsion). Once the cursor leaves,
 * they gently drift back to their original position using spring physics.
 */

// Palettes for the 3D isometric cubes
const CUBE_PALETTES = [
  // Cyber Cyan
  {
    top: "160, 248, 255",
    left: "0, 210, 255",
    right: "0, 130, 200",
    glow: "0, 242, 254",
  },
  // Sky Azure
  {
    top: "200, 235, 255",
    left: "56, 189, 248",
    right: "2, 132, 199",
    glow: "56, 189, 248",
  },
  // Electric Violet
  {
    top: "230, 205, 255",
    left: "168, 85, 247",
    right: "109, 40, 217",
    glow: "168, 85, 247",
  },
];

// Helper to draw a small 3D isometric cube
function drawIsometricCube(ctx, x, y, size, palette, alpha, rot = 0, isRepelled = false) {
  ctx.save();
  ctx.translate(x, y);
  if (rot !== 0) ctx.rotate(rot);

  const s = size;
  const h = s * 0.58; // Isometric height ratio

  if (isRepelled) {
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(${palette.glow}, ${alpha * 0.8})`;
  }

  // 1. Top Face (Highlight)
  ctx.fillStyle = `rgba(${palette.top}, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(0, -h);
  ctx.lineTo(s, -h * 0.5);
  ctx.lineTo(0, 0);
  ctx.lineTo(-s, -h * 0.5);
  ctx.closePath();
  ctx.fill();

  // 2. Left Face (Mid-tone)
  ctx.fillStyle = `rgba(${palette.left}, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(-s, -h * 0.5);
  ctx.lineTo(0, 0);
  ctx.lineTo(0, h);
  ctx.lineTo(-s, h * 0.5);
  ctx.closePath();
  ctx.fill();

  // 3. Right Face (Shadow tone)
  ctx.fillStyle = `rgba(${palette.right}, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(s, -h * 0.5);
  ctx.lineTo(s, h * 0.5);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // 4. Crisp Pixel Edge Outline
  ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 0.75)})`;
  ctx.lineWidth = 0.85;
  ctx.stroke();

  ctx.restore();
}

export function CursorEffect() {
  const canvasRef = useRef(null);
  const [show, setShow] = useState(false);

  // Mouse tracking
  const mouse = useRef({
    x: -500,
    y: -500,
    prevX: -500,
    prevY: -500,
    vx: 0,
    vy: 0,
    speed: 0,
  });

  const isClicked = useRef(false);
  const isVisible = useRef(false);
  const rafId = useRef(null);

  // Grid / Cloud of small 3D cubes
  const cubes = useRef([]);

  useEffect(() => {
    // Only run on desktop pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setShow(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx = canvas.getContext("2d");
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // ── Generate Grid / Cloud of 3D Cubes ──
    const initGrid = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      const SPACING = 54; // Distance between cubes
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const newCubes = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Staggered isometric lattice offset
          const offsetX = (r % 2 === 1 ? SPACING * 0.5 : 0) + (Math.random() - 0.5) * 6;
          const origX = c * SPACING + offsetX;
          const origY = r * SPACING + (Math.random() - 0.5) * 6;

          newCubes.push({
            origX,
            origY,
            x: origX,
            y: origY,
            vx: 0,
            vy: 0,
            size: Math.random() * 2 + 5.5, // 5.5px to 7.5px small 3D cubes
            palette: CUBE_PALETTES[(r + c) % CUBE_PALETTES.length],
            rot: 0,
            vrot: 0,
            phase: Math.random() * Math.PI * 2,
            floatSpeed: Math.random() * 0.02 + 0.015,
            isRepelled: false,
            alpha: Math.random() * 0.2 + 0.35, // calm resting opacity
          });
        }
      }

      cubes.current = newCubes;
    };

    initGrid();

    const onMove = (e) => {
      const curX = e.clientX;
      const curY = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        mouse.current.prevX = curX;
        mouse.current.prevY = curY;
      }

      const dx = curX - mouse.current.prevX;
      const dy = curY - mouse.current.prevY;

      mouse.current.vx = dx;
      mouse.current.vy = dy;
      mouse.current.speed = Math.sqrt(dx * dx + dy * dy);

      mouse.current.x = curX;
      mouse.current.y = curY;

      mouse.current.prevX = curX;
      mouse.current.prevY = curY;
    };

    const onLeave = () => {
      isVisible.current = false;
      mouse.current.x = -500;
      mouse.current.y = -500;
    };

    const onEnter = () => {
      isVisible.current = true;
    };

    const onDown = (e) => {
      isClicked.current = true;

      // Click Blast: Repel all nearby cubes outward with high velocity
      const BLAST_RADIUS = 260;
      const BLAST_FORCE = 32;

      for (let i = 0; i < cubes.current.length; i++) {
        const cube = cubes.current[i];
        const dx = cube.x - e.clientX;
        const dy = cube.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < BLAST_RADIUS && dist > 0.001) {
          const factor = Math.pow(1 - dist / BLAST_RADIUS, 1.4);
          const nx = dx / dist;
          const ny = dy / dist;

          cube.vx += nx * BLAST_FORCE * factor;
          cube.vy += ny * BLAST_FORCE * factor;
          cube.vrot += (Math.random() - 0.5) * 0.4 * factor;
        }
      }
    };

    const onUp = () => {
      isClicked.current = false;
    };

    // ── Animation Loop: Physics & Rendering ──
    const REPEL_RADIUS = 150; // Distance where cubes push away like magnets
    const REPEL_STRENGTH = 18; // Magnetic repulsion force
    const SPRING = 0.052; // Hooke's law spring constant to drift back
    const DAMPING = 0.88; // Friction / decay to settle smoothly

    let frameTime = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      frameTime += 0.03;

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const allCubes = cubes.current;

      for (let i = 0; i < allCubes.length; i++) {
        const cube = allCubes[i];

        // 1. Calm Ambient Floating (Gentle subtle sine wave drift at rest)
        const ambientFloatY = Math.sin(frameTime + cube.phase) * 3;
        const targetHomeX = cube.origX;
        const targetHomeY = cube.origY + ambientFloatY;

        // 2. Magnetic Repulsion Calculation
        const dx = cube.x - mx;
        const dy = cube.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let isRepelledThisFrame = false;

        if (isVisible.current && dist < REPEL_RADIUS && dist > 0.001) {
          isRepelledThisFrame = true;

          // Push away like matching magnetic poles
          const normX = dx / dist;
          const normY = dy / dist;
          const repelFactor = Math.pow(1 - dist / REPEL_RADIUS, 1.6);

          // Force scales with cursor speed and closeness
          const dynamicForce = REPEL_STRENGTH * repelFactor;
          cube.vx += normX * dynamicForce * 0.45;
          cube.vy += normY * dynamicForce * 0.45;

          // Add a subtle tumble rotation when repelled
          cube.vrot += (Math.random() - 0.5) * 0.03 * repelFactor;
        }

        cube.isRepelled = isRepelledThisFrame;

        // 3. Spring Physics: Pull gently back to original resting position
        const springX = (targetHomeX - cube.x) * SPRING;
        const springY = (targetHomeY - cube.y) * SPRING;

        cube.vx = (cube.vx + springX) * DAMPING;
        cube.vy = (cube.vy + springY) * DAMPING;

        cube.x += cube.vx;
        cube.y += cube.vy;

        // Rotational decay back to neutral
        cube.vrot *= 0.94;
        cube.rot += cube.vrot;

        // Opacity bloom: glows brighter when repelled
        const targetAlpha = isRepelledThisFrame ? 0.95 : 0.38;
        cube.alpha += (targetAlpha - cube.alpha) * 0.15;

        // 4. Draw the 3D isometric cube
        drawIsometricCube(
          ctx,
          cube.x,
          cube.y,
          cube.size,
          cube.palette,
          cube.alpha,
          cube.rot,
          isRepelledThisFrame
        );
      }

      // ── Draw Magnetic Repulsion Field Ring & Pointer Dot ──
      if (isVisible.current && mx > -100 && my > -100) {
        ctx.save();

        // Subtle glowing magnetic field perimeter around cursor
        const pulse = Math.sin(frameTime * 2) * 2;
        ctx.strokeStyle = "rgba(0, 242, 254, 0.28)";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(mx, my, REPEL_RADIUS * 0.45 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Precision center pointer dot
        ctx.fillStyle = "#00F2FE";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00F2FE";
        ctx.beginPath();
        ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
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
    window.addEventListener("resize", initGrid);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("resize", initGrid);
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
        /* Hide default native cursor on desktop pointer devices */
        @media (pointer: fine) {
          body, a, button, [role=button], input, textarea, select {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
