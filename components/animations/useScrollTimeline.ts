"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, registerGsap } from "@/lib/animation";

type TimelineOptions = {
  end?: string;
  scrub?: number;
  pin?: boolean;
  onProgress: (progress: number) => void;
  onToggle?: (active: boolean) => void;
};

export function useScrollTimeline(
  ref: RefObject<HTMLElement | null>,
  options: TimelineOptions,
) {
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      optionsRef.current.onProgress(1);
      optionsRef.current.onToggle?.(true);
      return;
    }

    registerGsap();
    let target = 0;
    let progress = 0;
    let active = false;
    let visible = true;
    let ticking = false;

    const tick = () => {
      const difference = target - progress;
      if (Math.abs(difference) < 0.001) {
        if (difference !== 0) {
          progress = target;
          optionsRef.current.onProgress(progress);
        }
        if (!active && visible) {
          visible = false;
          optionsRef.current.onToggle?.(false);
        }
        gsap.ticker.remove(tick);
        ticking = false;
        return;
      }

      const seconds = Math.max(0.01, optionsRef.current.scrub ?? 0.2);
      const frame = gsap.ticker.deltaRatio(60) / 60;
      progress += difference * (1 - Math.exp(-frame / seconds));
      optionsRef.current.onProgress(progress);
    };

    const startTicking = () => {
      if (ticking) return;
      ticking = true;
      gsap.ticker.add(tick);
    };

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: "top top",
        end: window.matchMedia("(max-width: 767px)").matches ? "bottom top" : (optionsRef.current.end ?? "+=100%"),
        pin: (optionsRef.current.pin ?? false) && window.matchMedia("(min-width: 768px)").matches,
        anticipatePin: 1,
        onToggle: (self) => {
          active = self.isActive;
          if (active && !visible) {
            visible = true;
            optionsRef.current.onToggle?.(true);
          }
          startTicking();
        },
        onUpdate: (self) => {
          target = self.progress;
          if (!visible) {
            visible = true;
            optionsRef.current.onToggle?.(true);
          }
          startTicking();
        },
      });
    }, element);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const timeout = window.setTimeout(refresh, 200);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(timeout);
      gsap.ticker.remove(tick);
      context.revert();
    };
  }, [ref]);
}
