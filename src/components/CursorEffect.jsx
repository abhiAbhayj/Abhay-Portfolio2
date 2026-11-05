import { useEffect, useRef, useState } from "react";

/**
 * Pixel Grid Magnetic Cursor Animation Effect
 *
 * Combines:
 * 1. Pixel Grid Movement: In open space, a dynamic matrix of digital pixel blocks
 *    moves, flexes, and trails with velocity physics & chromatic aberration.
 * 2. Magnetic Element Snapping: When hovering over website elements (buttons, links,
 *    cards, badges), the pixel blocks magnetically fly and assemble into a digital
 *    pixel grid frame enclosing the target element with magnetic button parallax pull.
 * 3. Click Dispersal: Clicking triggers a high-energy pixel dispersal and snap-back.
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

  const activeElement = useRef(null);
  const isHovered = useRef(false);
  const isClicked = useRef(false);
  const isVisible = useRef(false);
  const rafId = useRef(null);

  // Pool of interactive digital pixel grid blocks
  const pixelBlocks = useRef([]);

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

    // ── Initialize Pixel Blocks Matrix (24 blocks) ──
    const BLOCK_COUNT = 24;
    const blocks = [];

    // Pre-calculate resting grid offsets around cursor (4x6 or circular grid matrix)
    for (let i = 0; i < BLOCK_COUNT; i++) {
      const angle = (i / BLOCK_COUNT) * Math.PI * 2;
      const ringRadius = (i % 2 === 0 ? 22 : 36) + (Math.random() - 0.5) * 6;
      blocks.push({
        id: i,
        x: -200,
        y: -200,
        vx: 0,
        vy: 0,
        // Free-space resting grid offsets
        gridOffsetX: Math.cos(angle) * ringRadius,
        gridOffsetY: Math.sin(angle) * ringRadius,
        size: i % 3 === 0 ? 10 : i % 2 === 0 ? 8 : 6,
        alpha: 0.85,
        energy: Math.random() * Math.PI * 2,
      });
    }
    pixelBlocks.current = blocks;

    const onMove = (e) => {
      const curX = e.clientX;
      const curY = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        mouse.current.prevX = curX;
        mouse.current.prevY = curY;
        // Initialize block positions
        for (let i = 0; i < pixelBlocks.current.length; i++) {
          pixelBlocks.current[i].x = curX + pixelBlocks.current[i].gridOffsetX;
          pixelBlocks.current[i].y = curY + pixelBlocks.current[i].gridOffsetY;
        }
      }

      const dx = curX - mouse.current.prevX;
      const dy = curY - mouse.current.prevY;

      mouse.current.vx = mouse.current.vx * 0.4 + dx * 0.6;
      mouse.current.vy = mouse.current.vy * 0.4 + dy * 0.6;
      mouse.current.speed = Math.sqrt(
        mouse.current.vx * mouse.current.vx + mouse.current.vy * mouse.current.vy
      );

      mouse.current.x = curX;
      mouse.current.y = curY;

      mouse.current.prevX = curX;
      mouse.current.prevY = curY;

      // ── Detect Magnetic Interactive Element ──
      const target = e.target.closest(
        "a, button, [role=button], .btn-primary, .btn-outline, .project-card, .feature-card, .badge-chip, .contact-card, .hero-tag, .scroll-hint, input, textarea, select"
      );

      if (target) {
        if (activeElement.current !== target) {
          if (activeElement.current) {
            activeElement.current.style.transform = "";
          }
          activeElement.current = target;
        }
        isHovered.current = true;

        // Apply tactile magnetic pull to hovered element
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.sqrt((curX - centerX) ** 2 + (curY - centerY) ** 2);
        const threshold = Math.max(rect.width, rect.height) * 1.3;

        if (dist < threshold) {
          const pullStrength = 0.24;
          const pullX = (curX - centerX) * pullStrength;
          const pullY = (curY - centerY) * pullStrength;
          target.style.transform = `translate3d(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px, 0)`;
          target.style.transition = "transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)";
        }
      } else {
        if (activeElement.current) {
          activeElement.current.style.transform = "";
          activeElement.current.style.transition = "transform 0.25s ease-out";
          activeElement.current = null;
        }
        isHovered.current = false;
      }
    };

    const onLeave = () => {
      isVisible.current = false;
      if (activeElement.current) {
        activeElement.current.style.transform = "";
        activeElement.current = null;
      }
    };

    const onEnter = () => {
      isVisible.current = true;
    };

    const onDown = () => {
      isClicked.current = true;

      // Click burst: fling blocks outward from cursor
      for (let i = 0; i < pixelBlocks.current.length; i++) {
        const b = pixelBlocks.current[i];
        const angle = Math.atan2(b.y - mouse.current.y, b.x - mouse.current.x);
        const force = Math.random() * 18 + 14;
        b.vx += Math.cos(angle) * force;
        b.vy += Math.sin(angle) * force;
      }
    };

    const onUp = () => {
      isClicked.current = false;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Decay free-space velocity
      mouse.current.vx *= 0.85;
      mouse.current.vy *= 0.85;
      mouse.current.speed = Math.sqrt(
        mouse.current.vx * mouse.current.vx + mouse.current.vy * mouse.current.vy
      );

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const speed = mouse.current.speed;

      // Calculate target slots for blocks: either around hovered element OR around cursor
      let elementRect = null;
      if (isHovered.current && activeElement.current) {
        elementRect = activeElement.current.getBoundingClientRect();
      }

      const blocks = pixelBlocks.current;
      const count = blocks.length;

      // ── Calculate Target Positions for Each Pixel Block ──
      for (let i = 0; i < count; i++) {
        const b = blocks[i];
        b.energy += 0.05;

        let targetX = 0;
        let targetY = 0;

        if (elementRect) {
          // ── MAGNETIC SNAP TO ELEMENT PERIMETER ──
          // Frame the hovered button with a digital pixel grid perimeter
          const pad = 8;
          const left = elementRect.left - pad;
          const top = elementRect.top - pad;
          const w = elementRect.width + pad * 2;
          const h = elementRect.height + pad * 2;
          const perimeter = 2 * (w + h);

          // Distribute the 24 blocks evenly along the perimeter of the button
          const distanceOnPerimeter = (i / count) * perimeter;

          if (distanceOnPerimeter < w) {
            // Top edge
            targetX = left + distanceOnPerimeter;
            targetY = top;
          } else if (distanceOnPerimeter < w + h) {
            // Right edge
            targetX = left + w;
            targetY = top + (distanceOnPerimeter - w);
          } else if (distanceOnPerimeter < 2 * w + h) {
            // Bottom edge
            targetX = left + w - (distanceOnPerimeter - (w + h));
            targetY = top + h;
          } else {
            // Left edge
            targetX = left;
            targetY = top + h - (distanceOnPerimeter - (2 * w + h));
          }

          // Subtle digital jitter while locked on
          targetX += Math.sin(b.energy + i) * 1.5;
          targetY += Math.cos(b.energy + i) * 1.5;
        } else {
          // ── FREE-SPACE PIXEL GRID CLUSTER WITH VELOCITY PHYSICS ──
          // Drag blocks opposite to movement vector with elastic stretch
          const dragX = -mouse.current.vx * 1.8;
          const dragY = -mouse.current.vy * 1.8;

          targetX = mx + b.gridOffsetX + dragX;
          targetY = my + b.gridOffsetY + dragY;
        }

        // Elastic Spring Physics
        const spring = elementRect ? 0.24 : 0.14;
        const damping = elementRect ? 0.78 : 0.82;

        b.vx += (targetX - b.x) * spring;
        b.vy += (targetY - b.y) * spring;

        b.vx *= damping;
        b.vy *= damping;

        b.x += b.vx;
        b.y += b.vy;
      }

      // ── Render Magnetic Connecting Pixel Grid Outline when hovering an element ──
      if (elementRect && isVisible.current) {
        const pad = 8;
        const left = elementRect.left - pad;
        const top = elementRect.top - pad;
        const w = elementRect.width + pad * 2;
        const h = elementRect.height + pad * 2;

        ctx.save();
        // Digital dashed grid frame around button
        ctx.strokeStyle = "rgba(0, 242, 254, 0.45)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(left, top, w, h);

        // Soft ambient magnetic aura
        ctx.fillStyle = "rgba(0, 242, 254, 0.05)";
        ctx.fillRect(left, top, w, h);
        ctx.restore();
      }

      // ── Render Each Digital Pixel Block with Chromatic Aberration ──
      if (isVisible.current && mx > -50 && my > -50) {
        for (let i = 0; i < count; i++) {
          const b = blocks[i];
          const s = isHovered.current ? b.size * 0.9 : b.size;

          const blockSpeed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          const chroma = Math.min(8, blockSpeed * 0.45 + (isHovered.current ? 1.5 : 0.8));

          const normX = blockSpeed > 0.001 ? (b.vx / blockSpeed) * chroma : 1;
          const normY = blockSpeed > 0.001 ? (b.vy / blockSpeed) * chroma : 0;

          // 1. Red Chromatic Edge
          if (chroma > 1) {
            ctx.save();
            ctx.strokeStyle = `rgba(255, 30, 86, ${isHovered.current ? 0.85 : 0.7})`;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(b.x - s / 2 + normX, b.y - s / 2 + normY, s, s);
            ctx.restore();
          }

          // 2. Cyan Chromatic Edge
          if (chroma > 1) {
            ctx.save();
            ctx.strokeStyle = `rgba(0, 240, 255, ${isHovered.current ? 0.85 : 0.7})`;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(b.x - s / 2 - normX, b.y - s / 2 - normY, s, s);
            ctx.restore();
          }

          // 3. Core Pixel Tile
          ctx.save();
          // Glass surface fill
          ctx.fillStyle = isHovered.current
            ? "rgba(0, 242, 254, 0.22)"
            : "rgba(56, 189, 248, 0.12)";
          ctx.fillRect(b.x - s / 2, b.y - s / 2, s, s);

          // Glowing border
          ctx.strokeStyle = isHovered.current ? "#00F2FE" : "rgba(255, 255, 255, 0.9)";
          ctx.lineWidth = 1.2;
          ctx.strokeRect(b.x - s / 2, b.y - s / 2, s, s);

          // Center pixel dot for blocks >= 8px
          if (s >= 8) {
            ctx.fillStyle = isHovered.current ? "#FFFFFF" : "#00F2FE";
            ctx.fillRect(b.x - 1, b.y - 1, 2, 2);
          }
          ctx.restore();
        }

        // ── Render Precision Crosshair Reticle at Pointer ──
        ctx.save();
        const reticleSize = isHovered.current ? 4 : 6;

        ctx.strokeStyle = "#00F2FE";
        ctx.lineWidth = 1.4;

        ctx.beginPath();
        ctx.moveTo(mx - reticleSize, my);
        ctx.lineTo(mx + reticleSize, my);
        ctx.moveTo(mx, my - reticleSize);
        ctx.lineTo(mx, my + reticleSize);
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(mx, my, 2.2, 0, Math.PI * 2);
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
    window.addEventListener("resize", setupCanvas);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("resize", setupCanvas);
      if (activeElement.current) {
        activeElement.current.style.transform = "";
        activeElement.current = null;
      }
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
