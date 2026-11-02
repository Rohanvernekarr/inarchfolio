"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { scene, setSceneRegion } from "@/lib/scene";
import { prefersReducedMotion, registerGsap } from "@/lib/animation";
import { useScrollTimeline } from "@/components/animations/useScrollTimeline";
import { fadeInBetween, fadeOutBetween } from "@/components/animations/useSceneTransition";

const ExperienceCanvas = dynamic(() => import("@/components/scenes/ExperienceCanvas"), {
  ssr: false,
});

const NAME = "INARCH";
const LINE = "Designing Spaces. Engineering Possibilities. Architecture, structural solutions and thoughtful interiors brought together.";
const STEPS = [
  { title: "Ground", note: "The plot is cleared." },
  { title: "Foundation", note: "Footings in the trench." },
  { title: "Plinth", note: "The base and the step." },
  { title: "Frame", note: "Posts around the court." },
  { title: "Walls", note: "Windows, jaali, doorway." },
  { title: "Roof", note: "Slab, jharokha, parapet." },
] as const;

export function Hero() {
  const stageRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const assemblyRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef<SVGSVGElement>(null);

  const linesRef = useRef<HTMLElement[]>([]);

  const stepsRef = useRef<HTMLElement[]>([]);
  const activeStep = useRef(-1);

  useScrollTimeline(stageRef, {
    end: "+=100%",
    pin: true,
    scrub: 0.22,
    onToggle: (active) => {
      setSceneRegion("opening", active);
      if (!active && stageRef.current) stageRef.current.dataset.intro = "complete";
    },
    onProgress: (progress) => {
      if (progress < 0.36) {
        scene.mode = "intro";
        scene.t = progress / 0.36;
      } else {
        scene.mode = "assembly";
        scene.t = (progress - 0.36) / 0.64;
      }

      fadeOutBetween(heroRef.current, progress, 0.26, 0.4);
      fadeInBetween(assemblyRef.current, progress, 0.34, 0.48);

      const lines = linesRef.current;
      for (let index = 0; index < lines.length; index += 1) {
        const start = 0.32 + index * 0.07;
        const local = Math.min(1, Math.max(0, (progress - start) / 0.1));
        const line = lines[index];
        line.style.transform = `translate3d(0, ${(1 - local) * 36}px, 0)`;
        line.style.opacity = String(local);
      }
    },
  });

  useLayoutEffect(() => {
    registerGsap();
    const root = stageRef.current;
    linesRef.current = root ? [...root.querySelectorAll<HTMLElement>(".asm-line")] : [];

    stepsRef.current = root ? [...root.querySelectorAll<HTMLElement>(".hero-step")] : [];

    const paint = () => {
      const played = scene.mode === "assembly" ? scene.t : scene.build;
      const active = Math.min(STEPS.length - 1, Math.floor(Math.min(0.999, played) * STEPS.length));
      if (active === activeStep.current) return;
      activeStep.current = active;
      const steps = stepsRef.current;
      for (let index = 0; index < steps.length; index += 1) {
        steps[index].classList.toggle("is-on", index <= active);
        steps[index].classList.toggle("is-current", index === active);
      }
    };
    gsap.ticker.add(paint);

    if (prefersReducedMotion()) {
      scene.reduced = true;
      scene.reveal = 1;
      scene.build = 1;
      scene.mode = "intro";
      scene.t = 1;
      gsap.set(introRef.current, { autoAlpha: 0 });
      if (root) root.dataset.intro = "complete";
      gsap.set(".hero-letter, .rise, .word-rise", { yPercent: 0 });
      gsap.set(".hero-step", { x: 0, autoAlpha: 1 });
      gsap.set(".hero-fade", { autoAlpha: 1 });
      paint();
      return () => {
        gsap.ticker.remove(paint);
      };
    }

    scene.build = 0;
    scene.reveal = 0;
    gsap.set(".hero-letter, .rise, .word-rise", { yPercent: 115 });
    gsap.set(".hero-step", { x: 36, autoAlpha: 0 });
    gsap.set(".hero-fade", { autoAlpha: 0 });

    const proxy = { reveal: 0, build: 0 };
    const timeline = gsap.timeline();
    timeline.fromTo(".intro-letter", { yPercent: 80, opacity: 0, rotateX: -45 }, { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.85, stagger: 0.11, ease: "power3.out" }, 0.1);
    timeline.fromTo(".intro-rule", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1, ease: "power3.inOut" }, 0.7);
    timeline.to(".intro-letter", { backgroundPosition: "0% 0%", duration: 1, stagger: 0.08, ease: "power2.inOut" }, 0.85);
    timeline.fromTo(".intro-spark", { y: 12, scale: 0.5, opacity: 0 }, { y: -15, scale: 1, opacity: 0.7, duration: 0.6, stagger: 0.13, ease: "power2.out" }, 0.9);
    timeline.to(".intro-spark", { y: -34, opacity: 0, duration: 0.55, stagger: 0.13, ease: "power2.in" }, 1.5);
    timeline.fromTo(".intro-subtitle", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 1);
    timeline.to(introRef.current, { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" }, 2);
    timeline.to(proxy, {
      reveal: 1,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => {
        scene.reveal = proxy.reveal;
        if (drawingRef.current) drawingRef.current.style.opacity = String(1 - proxy.reveal);
      },
    }, 2.15);
    timeline.to(proxy, {
      build: 1,
      duration: 2.6,
      ease: "power2.inOut",
      onUpdate: () => { scene.build = proxy.build; },
    }, 2.2);
    timeline.to(".hero-step", { x: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }, 2.8);
    timeline.to(".rise", { yPercent: 0, duration: 0.7, ease: "power3.out" }, 4.15);
    timeline.to(".hero-letter", { yPercent: 0, duration: 0.8, stagger: 0.05, ease: "power3.out" }, 4.25);
    timeline.to(".word-rise", { yPercent: 0, duration: 0.65, stagger: 0.025, ease: "power3.out" }, 4.6);
    timeline.to(".hero-fade", { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 5.05);
    timeline.call(() => { if (root) root.dataset.intro = "complete"; }, [], 4.95);

    return () => {
      timeline.kill();
      gsap.ticker.remove(paint);
    };
  }, []);

  return (
    <>
      <div className="hero-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden bg-obsidian" aria-hidden>
        <p className="absolute inset-x-0 top-[18%] px-[5vw] select-none font-display text-[13vw] leading-[0.9] font-bold tracking-[-0.08em] text-white/[0.12] md:top-[15%] md:px-[4vw] md:text-[11vw] md:text-white/[0.09]"><span className="block whitespace-nowrap">SHAPING</span><span className="block whitespace-nowrap">WHAT’S NEXT</span></p>
        <div className="absolute inset-0"><ExperienceCanvas /></div>
      </div>
      <section ref={stageRef} className="relative z-[1] h-svh" id="opening" data-intro="playing">
        <div ref={introRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-obsidian px-5 text-center">
          <span className="intro-word relative flex origin-center font-display text-[clamp(4.5rem,18vw,17rem)] leading-none font-bold tracking-[-0.075em] text-ivory">
            {NAME.split("").map((letter, index) => <span key={index} className="intro-letter">{letter}</span>)}
          </span>
          <span className="intro-rule" />
          <span className="intro-subtitle relative mt-5 text-[10px] tracking-[0.28em] text-brass uppercase sm:text-xs">Structures & Studio</span>
          <span aria-hidden="true" className="intro-spark" /><span aria-hidden="true" className="intro-spark" /><span aria-hidden="true" className="intro-spark" /><span aria-hidden="true" className="intro-spark" />
        </div>
        <svg
          ref={drawingRef}
          className="pointer-events-none absolute inset-0 m-auto h-[62vh] w-[70vw] max-w-3xl text-brass"
          viewBox="0 0 800 520"
          fill="none"
          aria-hidden
        >
          <rect x="140" y="70" width="520" height="380" stroke="currentColor" strokeWidth="1" />
          <rect x="250" y="160" width="300" height="200" stroke="currentColor" strokeWidth="0.8" />
          <path d="M140 250 H250 M550 250 H660 M400 70 V160 M400 360 V450" stroke="currentColor" strokeWidth="0.6" />
          <path d="M360 450 V390 H440 V450" stroke="currentColor" strokeWidth="0.9" />
        </svg>


        <div ref={heroRef} className="hero-content absolute inset-0 flex flex-col justify-end px-5 pb-16 md:px-10 md:pb-20">
          <p className="overflow-hidden text-[11px] tracking-[0.38em] text-brass uppercase">
            <span className="rise inline-block">Architecture · Structural engineering · Interior design</span>
          </p>
          <h1 className="mt-4 font-display text-[18vw] leading-[0.82] tracking-[-0.06em] text-ivory [text-shadow:0_20px_50px_rgba(0,0,0,0.65)] md:text-[12vw]">
            <span className="sr-only">INARCH</span>
            <span aria-hidden>
              {NAME.split("").map((letter) => (
                <span key={letter} className="inline-block overflow-hidden align-bottom">
                  <span className="hero-letter inline-block">{letter}</span>
                </span>
              ))}
            </span>
          </h1>
          <div className="mt-6 flex items-end justify-between gap-6">
            <p className="max-w-md text-sm leading-7 text-stone md:text-base">
              {LINE.split(" ").map((word, index) => (
                <span key={`${word}-${index}`} className="mr-[0.3em] inline-block overflow-hidden align-bottom">
                  <span className="word-rise inline-block">{word}</span>
                </span>
              ))}
            </p>
            <p className="hero-fade hidden text-[11px] tracking-[0.32em] text-stone uppercase md:block">
              Scroll
            </p>
          </div>
        </div>

        <ol className="pointer-events-none absolute top-28 right-6 hidden w-56 md:block lg:right-10">
          {STEPS.map((step, index) => (
            <li key={step.title} className="hero-step border-t border-white/10 py-3">
              <div className="flex items-baseline justify-between gap-4">
                <p className="step-title text-[11px] tracking-[0.28em] uppercase">{step.title}</p>
                <p className="text-[11px] tracking-[0.2em] text-stone">{String(index + 1).padStart(2, "0")}</p>
              </div>
              <p className="step-note mt-1 text-sm text-stone">{step.note}</p>
            </li>
          ))}
        </ol>

        <div
          ref={assemblyRef}
          className="pointer-events-none absolute inset-0 flex items-end px-5 pb-16 opacity-0 md:px-10 md:pb-20"
        >
          <div className="assembly-copy max-w-xl">
            <p className="asm-line text-[11px] tracking-[0.38em] text-brass uppercase">In order</p>
            <h2 className="mt-4 font-display text-4xl leading-[0.95] text-ivory md:text-6xl">
              {"Thoughtful design. Technical precision. Inspired spaces.".split(" ").map((word, index) => (
                <span key={`${word}-${index}`} className="asm-line mr-[0.25em] inline-block">
                  {word}
                </span>
              ))}
            </h2>
          </div>
        </div>
      </section>
    </>
  );
}
