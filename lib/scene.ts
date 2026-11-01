export type SceneMode = "intro" | "assembly" | "idle" | "close";

export const scene = {
  mode: "intro" as SceneMode,
  /** Scroll progress inside the active mode, 0–1. */
  t: 0,
  /** Load reveal, 0–1. Independent of scroll. */
  reveal: 0,
  /** Construction sequence on load, 0–1. Each sixth raises the next stage. */
  build: 0,
  reduced: false,
  solid: 0,
  wire: 1,
  explode: 0,
};

const listeners = new Set<(visible: boolean) => void>();
let opening = true;
let closing = false;

export function setSceneRegion(region: "opening" | "closing", active: boolean) {
  if (region === "opening") opening = active;
  else closing = active;
  const visible = opening || closing;
  listeners.forEach((listener) => listener(visible));
}

export function subscribeSceneVisible(listener: (visible: boolean) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function syncScene() {
  if (scene.reduced) {
    scene.solid = 1;
    scene.wire = 0.16;
    scene.explode = 0;
    scene.build = 1;
    return;
  }

  scene.solid = Math.min(1, scene.reveal);

  if (scene.mode === "assembly") {
    scene.wire = 0.34 + (0.06 - 0.34) * scene.t;
    scene.explode = scene.t;
    return;
  }

  if (scene.mode === "close") {
    scene.wire = 0.12;
    scene.explode = 0;
    return;
  }

  const reveal = Math.max(scene.reveal, scene.t);
  scene.wire = 0.95 + (0.3 - 0.95) * reveal;
  scene.explode = 0;
}
