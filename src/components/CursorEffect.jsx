import { useEffect, useRef, useState } from "react";

// Vibrant palettes for 3D isometric pixel cubes
const CUBE_PALETTES = [
  // Cyber Cyan
  {
    top: "140, 248, 255",
    left: "0, 210, 255",
    right: "0, 140, 220",
    glow: "0, 220, 255",
  },
  // Sky Azure
  {
    top: "190, 235, 255",
    left: "56, 189, 248",
    right: "2, 132, 199",
    glow: "56, 189, 248",
  },
  // Electric Violet
  {
    top: "225, 195, 255",
    left: "168, 85, 247",
    right: "109, 40, 217",
    glow: "168, 85, 247",
  },
  // Neon Mint
  {
    top: "175, 250, 220",
    left: "52, 211, 153",
    right: "5, 150, 105",
    glow: "52, 211, 153",
  },
];

// Helper to draw a crisp 3D isometric pixel cube on 2D canvas
function drawIsometricCube(ctx, x, y, size, palette, alpha, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  if (rot !== 0) ctx.rotate(rot);

  const s = size;
  const h = s * 0.58; // Isometric height ratio

  // Top face (highlighted)
  ctx.fillStyle = `rgba(${palette.top}, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(0, -h);
  ctx.lineTo(s, -h * 0.5);
  ctx.lineTo(0, 0);
  ctx.lineTo(-s, -h * 0.5);
  ctx.closePath();
  ctx.fill();

  // Left face (mid tone)
  ctx.fillStyle = `rgba(${palette.left}, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(-s, -h * 0.5);
  ctx.lineTo(0, 0);
  ctx.lineTo(0, h);
  ctx.lineTo(-s, h * 0.5);
  ctx.closePath();
  ctx.fill();

  // Right face (shadow tone)
  ctx.fillStyle = `rgba(${palette.right}, ${alpha})`;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(s, -h * 0.5);
  ctx.lineTo(s, h * 0.5);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Crisp pixel edge highlight
  ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 0.6)})`;
  ctx.lineWidth = 0.75;
  ctx.stroke();

  ctx.restore();
}

export function CursorEffect() {
  const canvasRef = useRef(null);
  const [show, setShow] = useState(false);
  const mouse = useRef({ x: -200, y: -200, prevX: -200, prevY: -200, speed: 0 });
  const reticle = useRef({ x: -200, y: -200, scale: 1 });
  const cubes = useRef([]);
  const isHovered = useRef(false);
  const isClicked = useRef(false);
  const isVisible = useRef(false);
  const rafId = useRef(null);

  useEffect(() => {
    // Only show on non-touch devices
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

    const spawnCube = (x, y, vx, vy, size, palette, lifetime = 35) => {
      cubes.current.push({
        x,
        y,
        vx,
        vy,
        size,
        baseSize: size,
        palette,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.12,
        alpha: 0.95,
        decay: 1 / lifetime,
      });
      // Cap maximum active cubes for optimal 60fps performance
      if (cubes.current.length > 70) {
        cubes.current.shift();
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

      const dx = curX - mouse.current.prevX;
      const dy = curY - mouse.current.prevY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      mouse.current.speed = dist;

      mouse.current.x = curX;
      mouse.current.y = curY;

      // Spawn pixel cubes along mouse trajectory with smooth interpolation
      const steps = Math.min(4, Math.max(1, Math.floor(dist / 14)));
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const interpX = mouse.current.prevX + dx * t + (Math.random() - 0.5) * 8;
        const interpY = mouse.current.prevY + dy * t + (Math.random() - 0.5) * 8;

        const palette = CUBE_PALETTES[Math.floor(Math.random() * CUBE_PALETTES.length)];
        const size = isHovered.current
          ? Math.random() * 4.5 + 4
          : Math.random() * 3.5 + 3.2;

        const vx = -dx * 0.08 + (Math.random() - 0.5) * 1.5;
        const vy = -dy * 0.08 + (Math.random() - 0.5) * 1.5 - 0.4; // gentle upward drift

        spawnCube(interpX, interpY, vx, vy, size, palette, Math.floor(Math.random() * 20 + 25));
      }

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
      // Burst of small pixel cubes dispersing outward on click
      const burstCount = 14;
      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 3.5 + 2.2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const palette = CUBE_PALETTES[i % CUBE_PALETTES.length];
        const size = Math.random() * 3.5 + 3.5;
        spawnCube(e.clientX, e.clientY, vx, vy, size, palette, 40);
      }
    };

    const onUp = () => {
      isClicked.current = false;
    };

    let leadRot = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly update reticle position
      reticle.current.x += (mouse.current.x - reticle.current.x) * 0.22;
      reticle.current.y += (mouse.current.y - reticle.current.y) * 0.22;

      const targetScale = isClicked.current ? 0.75 : isHovered.current ? 1.45 : 1;
      reticle.current.scale += (targetScale - reticle.current.scale) * 0.18;

      leadRot += isHovered.current ? 0.05 : 0.02;

      // Update & render trailing pixel cubes
      const activeCubes = [];
      for (let i = 0; i < cubes.current.length; i++) {
        const c = cubes.current[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vx *= 0.96; // air friction
        c.vy *= 0.96;
        c.rot += c.vrot;
        c.alpha -= c.decay;
        c.size = Math.max(1, c.baseSize * (c.alpha * 0.6 + 0.4));

        if (c.alpha > 0.02) {
          drawIsometricCube(ctx, c.x, c.y, c.size, c.palette, c.alpha, c.rot);
          activeCubes.push(c);
        }
      }
      cubes.current = activeCubes;

      // Draw primary cursor HUD & leading pixel cube if mouse is visible
      if (isVisible.current && mouse.current.x > 0 && mouse.current.y > 0) {
        const rx = reticle.current.x;
        const ry = reticle.current.y;
        const scale = reticle.current.scale;

        // 1. Floating pixel corner brackets around cursor [ · ]
        const bracketDist = 14 * scale;
        const armLen = 5 * scale;
        const bracketAlpha = isHovered.current ? 0.85 : 0.45;
        const bracketColor = isHovered.current ? "0, 242, 254" : "56, 189, 248";

        ctx.strokeStyle = `rgba(${bracketColor}, ${bracketAlpha})`;
        ctx.lineWidth = 1.2;

        // Top-Left bracket
        ctx.beginPath();
        ctx.moveTo(rx - bracketDist + armLen, ry - bracketDist);
        ctx.lineTo(rx - bracketDist, ry - bracketDist);
        ctx.lineTo(rx - bracketDist, ry - bracketDist + armLen);
        ctx.stroke();

        // Top-Right bracket
        ctx.beginPath();
        ctx.moveTo(rx + bracketDist - armLen, ry - bracketDist);
        ctx.lineTo(rx + bracketDist, ry - bracketDist);
        ctx.lineTo(rx + bracketDist, ry - bracketDist + armLen);
        ctx.stroke();

        // Bottom-Left bracket
        ctx.beginPath();
        ctx.moveTo(rx - bracketDist + armLen, ry + bracketDist);
        ctx.lineTo(rx - bracketDist, ry + bracketDist);
        ctx.lineTo(rx - bracketDist, ry + bracketDist - armLen);
        ctx.stroke();

        // Bottom-Right bracket
        ctx.beginPath();
        ctx.moveTo(rx + bracketDist - armLen, ry + bracketDist);
        ctx.lineTo(rx + bracketDist, ry + bracketDist);
        ctx.lineTo(rx + bracketDist, ry + bracketDist - armLen);
        ctx.stroke();

        // 2. Lead pixel cube right at pointer tip
        const leadPalette = isHovered.current ? CUBE_PALETTES[0] : CUBE_PALETTES[1];
        const leadSize = isClicked.current ? 3.5 : isHovered.current ? 6.5 : 4.8;
        drawIsometricCube(ctx, mouse.current.x, mouse.current.y, leadSize, leadPalette, 1, leadRot);
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
        /* Hide default cursor on desktop pointer devices */
        @media (pointer: fine) {
          body, a, button, [role=button], input, textarea, select {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
