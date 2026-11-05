import { useEffect, useRef } from "react";

/**
 * The Follow-and-Trail Matrix
 *
 * The cursor is replaced by a primary 3D isometric cube.
 * As the user moves the mouse or swipes on mobile, a delayed stream of smaller 3D
 * cubes trails behind it with sequential stagger physics, scaling down and fading away
 * into a luminous digital path.
 *
 * Full support for both Desktop (Mouse) and Mobile/Tablet (Touch).
 */

// Cyber color gradient for the trail stream
const TRAIL_PALETTES = [
  // Primary Lead: Pure Cyber Cyan
  {
    top: "220, 250, 255",
    left: "0, 220, 255",
    right: "0, 140, 210",
    glow: "0, 242, 254",
  },
  // Sky Azure
  {
    top: "186, 230, 253",
    left: "56, 189, 248",
    right: "2, 132, 199",
    glow: "56, 189, 248",
  },
  // Electric Blue-Violet
  {
    top: "199, 210, 254",
    left: "99, 102, 241",
    right: "67, 56, 202",
    glow: "99, 102, 241",
  },
  // Vivid Violet
  {
    top: "221, 214, 254",
    left: "139, 92, 246",
    right: "109, 40, 217",
    glow: "139, 92, 246",
  },
  // Neon Purple
  {
    top: "245, 208, 254",
    left: "192, 38, 211",
    right: "134, 25, 143",
    glow: "192, 38, 211",
  },
  // Neon Rose
  {
    top: "254, 205, 211",
    left: "244, 63, 94",
    right: "190, 18, 60",
    glow: "244, 63, 94",
  },
];

// Helper to draw a crisp 3D isometric cube
function drawIsometricCube(ctx, x, y, size, palette, alpha, rot = 0, isLead = false) {
  ctx.save();
  ctx.translate(x, y);
  if (rot !== 0) ctx.rotate(rot);

  const s = size;
  const h = s * 0.58; // Isometric height ratio

  if (isLead) {
    ctx.shadowBlur = 16;
    ctx.shadowColor = `rgba(${palette.glow}, 0.95)`;
  } else if (alpha > 0.3) {
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgba(${palette.glow}, ${alpha * 0.6})`;
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

  // 4. Crisp Pixel Edge Stroke
  ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 0.9)})`;
  ctx.lineWidth = isLead ? 1.5 : 1;
  ctx.stroke();

  ctx.restore();
}

export function CursorEffect() {
  const canvasRef = useRef(null);

  // Mouse & Touch tracking
  const mouse = useRef({
    x: -300,
    y: -300,
    prevX: -300,
    prevY: -300,
    vx: 0,
    vy: 0,
    speed: 0,
  });

  const isHovered = useRef(false);
  const isClicked = useRef(false);
  const isVisible = useRef(false);
  const rafId = useRef(null);

  // Trailing cubes chain (14 cubes)
  const trailCubes = useRef([]);

  useEffect(() => {
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

    // ── Initialize Sequential Trailing Cubes Chain ──
    const TRAIL_LENGTH = 14;
    const cubes = [];

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const paletteIndex = Math.min(
        TRAIL_PALETTES.length - 1,
        Math.floor((i / TRAIL_LENGTH) * TRAIL_PALETTES.length)
      );
      cubes.push({
        x: -300,
        y: -300,
        vx: 0,
        vy: 0,
        rot: 0,
        vrot: 0,
        palette: TRAIL_PALETTES[paletteIndex],
        lerpFactor: Math.max(0.24, 0.48 - (i / TRAIL_LENGTH) * 0.22),
      });
    }
    trailCubes.current = cubes;

    // Pointer update helper
    const updatePointer = (curX, curY) => {
      if (!isVisible.current) {
        isVisible.current = true;
        mouse.current.prevX = curX;
        mouse.current.prevY = curY;
        for (let i = 0; i < trailCubes.current.length; i++) {
          trailCubes.current[i].x = curX;
          trailCubes.current[i].y = curY;
        }
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

    // Desktop Mouse Handlers
    const onMouseMove = (e) => {
      updatePointer(e.clientX, e.clientY);
    };

    const onMouseLeave = () => {
      isVisible.current = false;
    };

    const onMouseEnter = () => {
      isVisible.current = true;
    };

    const onMouseDown = () => {
      isClicked.current = true;
    };

    const onMouseUp = () => {
      isClicked.current = false;
    };

    // Mobile / Touch Handlers
    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        isVisible.current = true;
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      setTimeout(() => {
        if (!isClicked.current) isVisible.current = false;
      }, 1000);
    };

    // Hover detection for interactive targets
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

    // ── Animation Loop: Sequential Stagger Trailing ──
    let leadAngle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.current.vx *= 0.88;
      mouse.current.vy *= 0.88;
      mouse.current.speed = Math.sqrt(
        mouse.current.vx * mouse.current.vx + mouse.current.vy * mouse.current.vy
      );

      leadAngle += isHovered.current ? 0.06 : 0.025 + mouse.current.speed * 0.005;

      const cubes = trailCubes.current;
      const len = cubes.length;

      if (isVisible.current && mouse.current.x > -100 && mouse.current.y > -100) {
        // 1. Update sequential trail positions
        for (let i = 0; i < len; i++) {
          const c = cubes[i];
          const targetX = i === 0 ? mouse.current.x : cubes[i - 1].x;
          const targetY = i === 0 ? mouse.current.y : cubes[i - 1].y;

          c.x += (targetX - c.x) * c.lerpFactor;
          c.y += (targetY - c.y) * c.lerpFactor;

          c.rot = leadAngle - i * 0.18;
        }

        // 2. Draw connective digital matrix line along trail
        if (mouse.current.speed > 2) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cubes[0].x, cubes[0].y);
          for (let i = 1; i < len; i++) {
            ctx.lineTo(cubes[i].x, cubes[i].y);
          }
          ctx.strokeStyle = "rgba(0, 242, 254, 0.25)";
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.restore();
        }

        // 3. Draw cubes from tail to head
        for (let i = len - 1; i >= 0; i--) {
          const c = cubes[i];
          const isLead = i === 0;

          const baseSize = isHovered.current ? 18 : 14;
          const clickScale = isClicked.current ? 0.8 : 1;
          const sizeRatio = 1 - (i / len) * 0.72;
          const size = Math.max(3.5, baseSize * sizeRatio * clickScale);

          const alphaRatio = 1 - (i / len) * 0.78;
          const alpha = Math.max(0.2, alphaRatio);

          drawIsometricCube(ctx, c.x, c.y, size, c.palette, alpha, c.rot, isLead);
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    animate();

    // Desktop Listeners
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    // Mobile Touch Listeners (passive for smooth 60fps scrolling)
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    window.addEventListener("resize", setupCanvas);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);

      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      window.removeEventListener("resize", setupCanvas);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 99999,
          display: "block",
        }}
      />
      <style>{`
        /* Hide default native cursor ONLY on desktop devices with fine pointer (mouse) */
        @media (pointer: fine) {
          body, a, button, [role=button], input, textarea, select {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
