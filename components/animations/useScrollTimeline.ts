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
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: "top top",
        end: optionsRef.current.end ?? "+=100%",
        pin: optionsRef.current.pin ?? false,
        scrub: optionsRef.current.scrub ?? 0.65,
        anticipatePin: 1,
        onToggle: (self) => optionsRef.current.onToggle?.(self.isActive),
        onUpdate: (self) => optionsRef.current.onProgress(self.progress),
      });
    }, element);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const timeout = window.setTimeout(refresh, 200);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(timeout);
      context.revert();
    };
  }, [ref]);
}
