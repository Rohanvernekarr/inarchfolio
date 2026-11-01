"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { nav } from "@/data/studio";
import { prefersReducedMotion, registerGsap } from "@/lib/animation";

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    registerGsap();

    const context = gsap.context(() => {
      const word = root.querySelector(".footer-word");
      const cols = root.querySelectorAll(".footer-col");
      if (word) gsap.set(word, { yPercent: 30, autoAlpha: 0 });
      gsap.set(cols, { y: 40, autoAlpha: 0 });

      const watch = () => {
        const view = window.innerHeight * 0.92;
        const rect = root.getBoundingClientRect();
        if (rect.top < view && rect.bottom > 0 && root.dataset.played !== "1") {
          root.dataset.played = "1";
          if (word) gsap.to(word, { yPercent: 0, autoAlpha: 1, duration: 1.15, ease: "power3.out" });
          gsap.to(cols, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" });
        }
      };

      watch();
      window.addEventListener("scroll", watch, { passive: true });
      const timer = window.setInterval(() => {
        watch();
        if (root.dataset.played === "1") window.clearInterval(timer);
      }, 160);
      return () => {
        window.clearInterval(timer);
        window.removeEventListener("scroll", watch);
      };
    }, root);

    return () => context.revert();
  }, []);

  return (
    <footer ref={rootRef} className="relative z-10 overflow-hidden bg-[#050505]">
      <div className="px-5 pt-20 md:px-10">
        <p
          aria-hidden
          className="footer-word pointer-events-none mx-auto w-fit max-w-full select-none text-center font-display text-[clamp(3.5rem,20vw,22rem)] leading-none font-bold tracking-[-0.065em] whitespace-nowrap text-white/10"
        >
          INARCH
        </p>
      </div>
      <div className="relative mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-white/10 px-5 py-6 md:px-10">
        <p className="footer-col text-[11px] tracking-[0.22em] text-stone uppercase">© 2026 INARCH</p>
        <ul className="footer-col flex flex-wrap gap-x-8 gap-y-2">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-[11px] tracking-[0.28em] text-stone uppercase hover:text-ivory">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
