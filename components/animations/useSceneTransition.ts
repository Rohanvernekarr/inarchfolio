import { clamp } from "@/lib/animation";

/** Fade an element out across a progress window. Progress is 0–1. */
export function fadeOutBetween(
  element: HTMLElement | null,
  progress: number,
  start: number,
  end: number,
) {
  if (!element) return;
  const opacity =
    progress <= start ? 1 : progress >= end ? 0 : 1 - (progress - start) / (end - start);
  element.style.opacity = String(clamp(opacity));
  element.style.visibility = opacity < 0.02 ? "hidden" : "visible";
}

/** Fade an element in across a progress window. */
export function fadeInBetween(
  element: HTMLElement | null,
  progress: number,
  start: number,
  end: number,
) {
  if (!element) return;
  const opacity =
    progress <= start ? 0 : progress >= end ? 1 : (progress - start) / (end - start);
  element.style.opacity = String(clamp(opacity));
  element.style.visibility = opacity < 0.02 ? "hidden" : "visible";
}
