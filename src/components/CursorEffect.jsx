import { useEffect, useRef } from "react";

/**
 * The Follow-and-Trail Matrix
 *
 * The cursor is replaced by a primary 3D isometric cube.
 * As the user moves the mouse on desktop, or touches & swipes in mobile view,
 * a delayed stream of 3D cubes trails behind it with sequential stagger physics,
 * scaling down and fading away into a luminous digital path.
 *
 * Full responsive support for both Desktop (Mouse) and Mobile View (Touch/Swipe).
 * Dynamic theme adaptation for high contrast in both Dark and Light modes.
 */

// Dark Mode Cyber Palette (Cyan -> Azure -> Indigo -> Violet -> Purple -> Rose)
const DARK_PALETTES = [
  {
    top: "220, 250, 255",
    left: "0, 220, 255",
    right: "0, 140, 210",
    glow: "0, 242, 254",
    stroke: "255, 255, 255",
  },
  {
    top: "186, 230, 253",
    left: "56, 189, 248",
    right: "2, 132, 199",
    glow: "56, 189, 248",
    stroke: "255, 255, 255",
  },
  {
    top: "199, 210, 254",
    left: "99, 102, 241",
    right: "67, 56, 202",
    glow: "99, 102, 241",
    stroke: "255, 255, 255",
  },
  {
    top: "221, 214, 254",
    left: "139, 92, 246",
    right: "109, 40, 217",
    glow: "139, 92, 246",
    stroke: "255, 255, 255",
  },
  {
    top: "245, 208, 254",
    left: "192, 38, 211",
    right: "134, 25, 143",
    glow: "192, 38, 211",
    stroke: "255, 255, 255",
  },
  {
    top: "254, 205, 211",
    left: "244, 63, 94",
    right: "190, 18, 60",
    glow: "244, 63, 94",
    stroke: "255, 255, 255",
  },
];

// Light Mode High-Contrast Palette (Electric Sapphire -> Cyan -> Indigo -> Violet -> Purple -> Crimson)
const LIGHT_PALETTES = [
  {
    top: "96, 165, 250",
    left: "37, 99, 235",
    right: "29, 78, 216",
    glow: "37, 99, 235",
    stroke: "15, 23, 42",
  },
  {
    top: "56, 189, 248",
    left: "2, 132, 199",
    right: "3, 105, 161",
    glow: "2, 132, 199",
    stroke: "15, 23, 42",
  },
  {
    top: "129, 140, 248",
    left: "79, 70, 229",
    right: "67, 56, 202",
    glow: "79, 70, 229",
    stroke: "15, 23, 42",
  },
  {
    top: "167, 139, 250",
    left: "124, 58, 237",
    right: "109, 40, 217",
    glow: "124, 58, 237",
    stroke: "15, 23, 42",
  },
  {
    top: "192, 132, 252",
    left: "147, 51, 234",
    right: "126, 34, 206",
    glow: "147, 51, 234",
    stroke: "15, 23, 42",
  },
  {
    top: "251, 113, 133",
    left: "225, 29, 72",
    right: "190, 18, 60",
    glow: "225, 29, 72",
    stroke: "15, 23, 42",
  },
];

// Helper to draw a crisp 3D isometric cube
function drawIsometricCube(ctx, x, y, size, palette, alpha, rot = 0, isLead = false, isLight = false) {
  ctx.save();
  ctx.translate(x, y);
  if (rot !== 0) ctx.rotate(rot);

  const s = size;
  const h = s * 0.58; // Isometric height ratio

  if (isLead) {
    ctx.shadowBlur = isLight ? 10 : 16;
    ctx.shadowColor = isLight
      ? `rgba(37, 99, 235, 0.45)`
      : `rgba(${palette.glow}, 0.95)`;
  } else if (alpha > 0.3) {
    ctx.shadowBlur = isLight ? 6 : 8;
    ctx.shadowColor = isLight
      ? `rgba(37, 99, 235, ${alpha * 0.35})`
      : `rgba(${palette.glow}, ${alpha * 0.6})`;
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
  const strokeAlpha = Math.min(1, alpha * (isLight ? 0.95 : 0.9));
  ctx.strokeStyle = `rgba(${palette.stroke || "255, 255, 255"}, ${strokeAlpha})`;
  ctx.lineWidth = isLead ? (isLight ? 1.6 : 1.5) : (isLight ? 1.2 : 1);
  ctx.stroke();

  ctx.restore();
}

export function CursorEffect() {
  const canvasRef = useRef(null);

  // Pointer tracking
  const pointer = useRef({
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
  const isTouchActive = useRef(false);
  const fadeAlpha = useRef(1);
  const isLightMode = useRef(false);
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

    // Detect initial theme
    const checkTheme = () => {
      isLightMode.current = document.documentElement.getAttribute("data-theme") === "light";
    };
    checkTheme();

    const themeObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-theme") {
          checkTheme();
        }
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

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
        DARK_PALETTES.length - 1,
        Math.floor((i / TRAIL_LENGTH) * DARK_PALETTES.length)
      );
      cubes.push({
        x: -300,
        y: -300,
        vx: 0,
        vy: 0,
        rot: 0,
        paletteIdx: paletteIndex,
        lerpFactor: Math.max(0.24, 0.48 - (i / TRAIL_LENGTH) * 0.22),
      });
    }
    trailCubes.current = cubes;

    // Desktop mouse pointer update
    const updateMousePointer = (curX, curY) => {
      if (!isVisible.current || pointer.current.x < -100) {
        isVisible.current = true;
        fadeAlpha.current = 1;
        pointer.current.prevX = curX;
        pointer.current.prevY = curY;
        for (let i = 0; i < trailCubes.current.length; i++) {
          trailCubes.current[i].x = curX;
          trailCubes.current[i].y = curY;
        }
      }

      const dx = curX - pointer.current.prevX;
      const dy = curY - pointer.current.prevY;

      pointer.current.vx = dx;
      pointer.current.vy = dy;
      pointer.current.speed = Math.sqrt(dx * dx + dy * dy);

      pointer.current.x = curX;
      pointer.current.y = curY;

      pointer.current.prevX = curX;
      pointer.current.prevY = curY;
    };

    // Mobile touch pointer activation
    const activateTouch = (clientX, clientY) => {
      isTouchActive.current = true;
      isVisible.current = true;
      fadeAlpha.current = 1;

      pointer.current.x = clientX;
      pointer.current.y = clientY;
      pointer.current.prevX = clientX;
      pointer.current.prevY = clientY;
      pointer.current.vx = 0;
      pointer.current.vy = 0;
      pointer.current.speed = 10;

      // Teleport all trail cubes directly to touch point
      const cList = trailCubes.current;
      for (let i = 0; i < cList.length; i++) {
        cList[i].x = clientX;
        cList[i].y = clientY;
      }
    };

    const moveTouch = (clientX, clientY) => {
      isTouchActive.current = true;
      isVisible.current = true;
      fadeAlpha.current = 1;

      const dx = clientX - pointer.current.x;
      const dy = clientY - pointer.current.y;
      pointer.current.vx = dx;
      pointer.current.vy = dy;
      pointer.current.speed = Math.sqrt(dx * dx + dy * dy);

      pointer.current.x = clientX;
      pointer.current.y = clientY;
      pointer.current.prevX = clientX;
      pointer.current.prevY = clientY;
    };

    const endTouch = () => {
      isTouchActive.current = false;
      // Allow fadeAlpha to smoothly decay in animate loop
    };

    // Desktop Mouse Handlers
    const onMouseMove = (e) => {
      if (!isTouchActive.current) {
        updateMousePointer(e.clientX, e.clientY);
      }
    };

    const onMouseLeave = () => {
      if (!isTouchActive.current) isVisible.current = false;
    };

    const onMouseEnter = () => {
      isVisible.current = true;
      fadeAlpha.current = 1;
    };

    const onMouseDown = () => {
      isClicked.current = true;
    };

    const onMouseUp = () => {
      isClicked.current = false;
    };

    // Unified Pointer Events (works for touch, mouse, pen across mobile & desktop)
    const onPointerDown = (e) => {
      if (e.pointerType === "touch") {
        activateTouch(e.clientX, e.clientY);
      } else {
        isClicked.current = true;
        updateMousePointer(e.clientX, e.clientY);
      }
    };

    const onPointerMove = (e) => {
      if (e.pointerType === "touch") {
        moveTouch(e.clientX, e.clientY);
      } else {
        updateMousePointer(e.clientX, e.clientY);
      }
    };

    const onPointerUp = (e) => {
      if (e.pointerType === "touch") {
        endTouch();
      } else {
        isClicked.current = false;
      }
    };

    const onPointerCancel = () => {
      endTouch();
    };

    // Touch event fallbacks for older mobile WebKit / Android browsers
    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        activateTouch(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        moveTouch(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      endTouch();
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

      pointer.current.vx *= 0.88;
      pointer.current.vy *= 0.88;
      pointer.current.speed = Math.sqrt(
        pointer.current.vx * pointer.current.vx + pointer.current.vy * pointer.current.vy
      );

      // On mobile view / touch devices, smoothly decay fadeAlpha when touch ends
      if (!isTouchActive.current && window.matchMedia("(pointer: coarse)").matches) {
        fadeAlpha.current = Math.max(0, fadeAlpha.current - 0.025);
        if (fadeAlpha.current <= 0) {
          isVisible.current = false;
        }
      }

      leadAngle += isHovered.current ? 0.06 : 0.025 + pointer.current.speed * 0.005;

      const cubes = trailCubes.current;
      const len = cubes.length;
      const isLight = isLightMode.current;
      const activePalettes = isLight ? LIGHT_PALETTES : DARK_PALETTES;

      if (isVisible.current && pointer.current.x > -100 && pointer.current.y > -100 && fadeAlpha.current > 0.01) {
        // 1. Update sequential trail positions
        for (let i = 0; i < len; i++) {
          const c = cubes[i];
          const targetX = i === 0 ? pointer.current.x : cubes[i - 1].x;
          const targetY = i === 0 ? pointer.current.y : cubes[i - 1].y;

          c.x += (targetX - c.x) * c.lerpFactor;
          c.y += (targetY - c.y) * c.lerpFactor;

          c.rot = leadAngle - i * 0.18;
        }

        // 2. Draw connective digital matrix line along trail
        if (pointer.current.speed > 2) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cubes[0].x, cubes[0].y);
          for (let i = 1; i < len; i++) {
            ctx.lineTo(cubes[i].x, cubes[i].y);
          }
          ctx.strokeStyle = isLight
            ? `rgba(37, 99, 235, ${0.35 * fadeAlpha.current})`
            : `rgba(0, 242, 254, ${0.3 * fadeAlpha.current})`;
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
          const alpha = Math.max(0.2, alphaRatio) * fadeAlpha.current;

          const palette = activePalettes[c.paletteIdx % activePalettes.length];
          drawIsometricCube(ctx, c.x, c.y, size, palette, alpha, c.rot, isLead, isLight);
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    animate();

    // Attach Listeners
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    // Pointer Events (unifies Mouse & Touch for mobile view)
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerCancel, { passive: true });

    // Touch event fallbacks for mobile browsers
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    window.addEventListener("resize", setupCanvas);

    return () => {
      cancelAnimationFrame(rafId.current);
      themeObserver.disconnect();

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);

      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);

      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);

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
