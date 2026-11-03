import { useEffect, useRef, useState } from "react";

export function CursorEffect() {
  const dotRef  = useRef(null);
  const [show, setShow] = useState(false);
  const mouse  = useRef({ x: -200, y: -200 });
  const dot    = useRef({ x: -200, y: -200 });
  const rafId  = useRef(null);
  const isHovering = useRef(false);
  const isMouseDown = useRef(false);

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setShow(true);

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const updateTransform = () => {
      if (!dotRef.current) return;
      
      let scale = 1;
      if (isHovering.current) scale = 3.5;
      if (isMouseDown.current) scale = isHovering.current ? 3 : 0.6;
      
      dotRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    const onOver = (e) => {
      // Look for clickable elements
      if (e.target.closest("a, button, [role=button], input, textarea, select")) {
        isHovering.current = true;
        updateTransform();
      }
    };
    
    const onOut = (e) => {
      if (e.target.closest("a, button, [role=button], input, textarea, select")) {
        isHovering.current = false;
        updateTransform();
      }
    };
    
    const onDown = () => {
      isMouseDown.current = true;
      updateTransform();
    };
    
    const onUp = () => {
      isMouseDown.current = false;
      updateTransform();
    };

    const animate = () => {
      // Lerp for smooth following
      dot.current.x += (mouse.current.x - dot.current.x) * 0.25;
      dot.current.y += (mouse.current.y - dot.current.y) * 0.25;

      if (dotRef.current) {
        dotRef.current.style.left = `${dot.current.x}px`;
        dotRef.current.style.top  = `${dot.current.y}px`;
      }
      
      rafId.current = requestAnimationFrame(animate);
    };
    
    animate();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  if (!show) return null;

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 20, height: 20,
          borderRadius: "50%",
          backgroundColor: "#fff",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 99999,
          // We set transform in JS, but we want the scale to animate smoothly
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          willChange: "transform, left, top",
        }}
      />
      <style>{`
        /* Hide default cursor to make custom cursor feel native */
        body, a, button, [role=button], input, textarea, select {
          cursor: none !important;
        }
        
        /* Ensure difference blend mode has contrasting text to invert */
        ::selection {
          background-color: var(--eg-primary);
          color: #fff;
        }
      `}</style>
    </>
  );
}
