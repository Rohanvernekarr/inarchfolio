"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let current = window.scrollY;
    let destination = current;
    let previousTime = 0;

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      current = window.scrollY;
      destination = current;
    };

    const animate = (time: number) => {
      const elapsed = Math.min(time - previousTime, 50);
      previousTime = time;
      current += (destination - current) * (1 - Math.pow(0.8, elapsed / 16));

      if (Math.abs(destination - current) < 0.5) {
        window.scrollTo(0, destination);
        frame = 0;
        return;
      }

      window.scrollTo(0, current);
      frame = requestAnimationFrame(animate);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || reducedMotion.matches || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        stop();
        return;
      }

      const element = event.target instanceof Element ? event.target : null;
      if (element?.closest("#mobile-nav, [role='dialog'], input, select, textarea, [contenteditable='true']") ||
          (event.deltaMode === 0 && Math.abs(event.deltaY) < 40)) {
        stop();
        return;
      }

      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? window.innerHeight : 1);
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const step = Math.max(-120, Math.min(120, delta)) * 0.8;
      if (!frame) {
        current = window.scrollY;
        destination = current;
        previousTime = performance.now();
      }
      const limit = window.innerHeight * 0.8;
      destination = Math.max(0, Math.min(maxScroll, Math.max(current - limit, Math.min(current + limit, destination + step))));
      if (!frame) frame = requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", stop);
    window.addEventListener("pointerdown", stop);
    window.addEventListener("popstate", stop);
    window.addEventListener("hashchange", stop);
    reducedMotion.addEventListener("change", stop);

    return () => {
      stop();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("popstate", stop);
      window.removeEventListener("hashchange", stop);
      reducedMotion.removeEventListener("change", stop);
    };
  }, []);

  return null;
}
