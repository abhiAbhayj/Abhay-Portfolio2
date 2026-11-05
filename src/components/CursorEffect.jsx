import { useEffect, useRef, useState } from "react";

/**
 * Premium Magnetic Cursor Effect
 *
 * Features:
 * - Fluid dual-element cursor: precision center dot + smooth magnetic follower ring.
 * - Magnetic Snapping & Morphing: Magnetically snaps to buttons, links, cards, and nav items,
 *   morphing its shape to hug the target with elastic spring physics.
 * - Magnetic Element Pull: Physically pulls the hovered button slightly toward the pointer
 *   for an ultra-tactile physical sensation.
 * - Velocity Stretching: Smoothly elongates along movement vector when sweeping fast.
 * - Click Spring Feedback: Elastic contraction on click.
 */
export function CursorEffect() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [show, setShow] = useState(false);

  // Position & Physics state
  const mouse = useRef({ x: -200, y: -200, prevX: -200, prevY: -200, vx: 0, vy: 0 });
  const ring = useRef({
    x: -200,
    y: -200,
    width: 42,
    height: 42,
    radius: 999,
    scale: 1,
    angle: 0,
    stretch: 1,
  });

  const activeElement = useRef(null);
  const isHovered = useRef(false);
  const isClicked = useRef(false);
  const isVisible = useRef(false);
  const rafId = useRef(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setShow(true);

    const onMove = (e) => {
      const curX = e.clientX;
      const curY = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        mouse.current.prevX = curX;
        mouse.current.prevY = curY;
        ring.current.x = curX;
        ring.current.y = curY;
      }

      const dx = curX - mouse.current.prevX;
      const dy = curY - mouse.current.prevY;

      mouse.current.vx = dx;
      mouse.current.vy = dy;
      mouse.current.x = curX;
      mouse.current.y = curY;

      mouse.current.prevX = curX;
      mouse.current.prevY = curY;

      // Check for magnetic interactive elements
      const target = e.target.closest(
        "a, button, [role=button], .btn-primary, .btn-outline, .project-card, .feature-card, .badge-chip, .contact-card, .hero-tag, .scroll-hint, input, textarea, select"
      );

      if (target) {
        if (activeElement.current !== target) {
          if (activeElement.current) {
            // Reset previous element
            activeElement.current.style.transform = "";
          }
          activeElement.current = target;
        }
        isHovered.current = true;

        // Apply tactile magnetic pull to the button itself
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distFromCenter = Math.sqrt((curX - centerX) ** 2 + (curY - centerY) ** 2);

        // Maximum magnetic influence threshold
        const maxThreshold = Math.max(rect.width, rect.height) * 1.2;
        if (distFromCenter < maxThreshold) {
          const pullStrength = 0.22;
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
    };

    const onUp = () => {
      isClicked.current = false;
    };

    const animate = () => {
      // 1. Position precision center dot
      if (dotRef.current) {
        const dotScale = isClicked.current ? 0.6 : isHovered.current ? 0 : 1;
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
        dotRef.current.style.opacity = isVisible.current ? "1" : "0";
      }

      // 2. Physics & Magnetic Snapping for Follower Ring
      let targetX = mouse.current.x;
      let targetY = mouse.current.y;
      let targetW = 42;
      let targetH = 42;
      let targetRadius = 999;
      let targetScale = isClicked.current ? 0.8 : 1;
      let targetAngle = 0;
      let targetStretch = 1;

      if (isHovered.current && activeElement.current) {
        const rect = activeElement.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Magnetically suck cursor toward element center
        targetX = centerX + (mouse.current.x - centerX) * 0.35;
        targetY = centerY + (mouse.current.y - centerY) * 0.35;

        // Morph follower to wrap around button
        const padding = 12;
        targetW = rect.width + padding;
        targetH = rect.height + padding;

        const computedBorderRadius = window.getComputedStyle(activeElement.current).borderRadius;
        targetRadius = parseFloat(computedBorderRadius) || 12;
        targetScale = isClicked.current ? 0.95 : 1.05;
      } else {
        // Velocity stretching when moving fast in free space
        const speed = Math.sqrt(mouse.current.vx ** 2 + mouse.current.vy ** 2);
        if (speed > 3) {
          targetAngle = Math.atan2(mouse.current.vy, mouse.current.vx);
          targetStretch = Math.min(1.5, 1 + speed * 0.018);
        }
      }

      // Smooth lerp physics
      const lerpSpeed = isHovered.current ? 0.22 : 0.16;
      ring.current.x += (targetX - ring.current.x) * lerpSpeed;
      ring.current.y += (targetY - ring.current.y) * lerpSpeed;
      ring.current.width += (targetW - ring.current.width) * 0.2;
      ring.current.height += (targetH - ring.current.height) * 0.2;
      ring.current.radius += (targetRadius - ring.current.radius) * 0.2;
      ring.current.scale += (targetScale - ring.current.scale) * 0.2;
      ring.current.stretch += (targetStretch - ring.current.stretch) * 0.2;

      // Apply to ring element
      if (ringRef.current) {
        const r = ring.current;
        let transformStr = `translate3d(${r.x}px, ${r.y}px, 0) translate(-50%, -50%) scale(${r.scale})`;
        if (!isHovered.current && r.stretch > 1.02) {
          transformStr += ` rotate(${targetAngle}rad) scaleX(${r.stretch}) scaleY(${1 / Math.sqrt(r.stretch)}) rotate(${-targetAngle}rad)`;
        }

        ringRef.current.style.transform = transformStr;
        ringRef.current.style.width = `${r.width}px`;
        ringRef.current.style.height = `${r.height}px`;
        ringRef.current.style.borderRadius = `${r.radius}px`;
        ringRef.current.style.opacity = isVisible.current ? "1" : "0";

        // Styling shift on hover
        if (isHovered.current) {
          ringRef.current.style.borderColor = "var(--eg-primary)";
          ringRef.current.style.backgroundColor = "rgba(0, 242, 254, 0.08)";
          ringRef.current.style.boxShadow = "0 0 24px rgba(0, 242, 254, 0.25)";
        } else {
          ringRef.current.style.borderColor = "var(--eg-primary)";
          ringRef.current.style.backgroundColor = "transparent";
          ringRef.current.style.boxShadow = "0 0 14px rgba(0, 242, 254, 0.18)";
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (activeElement.current) {
        activeElement.current.style.transform = "";
        activeElement.current = null;
      }
    };
  }, []);

  if (!show) return null;

  return (
    <>
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
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
          transition: "opacity 0.2s ease, transform 0.08s ease-out",
        }}
      />

      {/* Magnetic Follower Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 42,
          height: 42,
          borderRadius: "50%",
          border: "1.5px solid var(--eg-primary)",
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform, width, height, border-radius",
          transition: "border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
          backdropFilter: "blur(1.5px)",
        }}
      />

      <style>{`
        /* Hide native cursor only on desktop devices */
        @media (pointer: fine) {
          body, a, button, [role=button], input, textarea, select {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
