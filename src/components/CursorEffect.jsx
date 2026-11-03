import { useEffect, useRef, useState } from "react";

export function CursorEffect() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const canvasRef = useRef(null);
  const [show, setShow] = useState(false);
  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const sparks = useRef([]);
  const isHovered = useRef(false);
  const isClicked = useRef(false);
  const isVisible = useRef(false);
  const rafId = useRef(null);

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setShow(true);

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible.current) {
        isVisible.current = true;
        ring.current.x = e.clientX;
        ring.current.y = e.clientY;
      }

      // Add gentle stardust particle trail
      if (Math.random() > 0.45) {
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6,
          size: Math.random() * 2.8 + 1.2,
          alpha: 0.8,
          decay: 0.03,
        });
        if (sparks.current.length > 22) sparks.current.shift();
      }
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
          "a, button, [role=button], input, textarea, select, .project-card, .feature-card, .btn-primary, .btn-outline, .badge-chip, .contact-card"
        )
      ) {
        isHovered.current = true;
      }
    };

    const onOut = (e) => {
      if (
        e.target.closest(
          "a, button, [role=button], input, textarea, select, .project-card, .feature-card, .btn-primary, .btn-outline, .badge-chip, .contact-card"
        )
      ) {
        isHovered.current = false;
      }
    };

    const onDown = () => {
      isClicked.current = true;
    };

    const onUp = () => {
      isClicked.current = false;
    };

    const canvas = canvasRef.current;
    let ctx = null;
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (canvas) {
      ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
    }

    const onResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;
    };

    const animate = () => {
      // Ring follows mouse with smooth lerp physics
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;

      if (dotRef.current) {
        const dotScale = isClicked.current ? 0.6 : isHovered.current ? 0.35 : 1;
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
        dotRef.current.style.opacity = isVisible.current ? "1" : "0";
      }

      if (ringRef.current) {
        const ringScale = isClicked.current ? 0.85 : isHovered.current ? 1.55 : 1;
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        ringRef.current.style.opacity = isVisible.current ? "1" : "0";
      }

      // Draw particle sparks
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        const activeSparks = [];
        for (let i = 0; i < sparks.current.length; i++) {
          const s = sparks.current[i];
          s.x += s.vx;
          s.y += s.vy;
          s.alpha -= s.decay;

          if (s.alpha > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56, 189, 248, ${s.alpha * 0.65})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = "rgba(56, 189, 248, 0.7)";
            ctx.fill();
            ctx.restore();
            activeSparks.push(s);
          }
        }
        sparks.current = activeSparks;
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
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("resize", onResize);
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
          zIndex: 99997,
        }}
      />
      {/* Precision inner center dot */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: "var(--eg-primary)",
          boxShadow: "0 0 10px var(--eg-primary)",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          transition: "opacity 0.2s ease, transform 0.12s ease-out",
        }}
      />
      {/* Outer fluid trailing magnetic ring */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid var(--eg-primary)",
          backgroundColor: "var(--eg-primary-var)",
          boxShadow: "0 0 18px var(--eg-primary-var)",
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          transition: "opacity 0.2s ease, transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background-color 0.2s ease",
          backdropFilter: "blur(2px)",
        }}
      />
      <style>{`
        /* Hide default cursor only on devices with pointer */
        @media (pointer: fine) {
          body, a, button, [role=button], input, textarea, select {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
