"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
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
      <div className="px-5 pt-14 md:px-10 md:pt-20">
        <div className="footer-col flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <Image src="/logo.jpeg" alt="InArch Structures & Studio logo" width={64} height={64} className="size-16 rounded-full object-cover" />
          <p className="max-w-sm text-sm leading-6 text-stone">Designing Spaces. Engineering Possibilities.<br />Architecture · Structures · Interiors</p>
        </div>
        <p
          aria-hidden
          className="footer-word pointer-events-none mx-auto mt-10 w-fit max-w-full select-none text-center font-display text-[clamp(3.5rem,20vw,22rem)] leading-none font-bold tracking-[-0.065em] whitespace-nowrap text-white/10 md:mt-0"
        >
          INARCH
        </p>
      </div>
      <div className="relative mt-8 flex flex-col gap-6 border-t border-white/10 px-5 py-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-8 md:gap-y-4 md:px-10">
        <p className="footer-col order-2 text-center text-[10px] leading-5 tracking-[0.13em] text-stone uppercase md:order-none md:text-left md:text-[11px] md:tracking-[0.22em]">© 2026 InArch Structures & Studio. All Rights Reserved.</p>
        <ul className="footer-col order-1 grid grid-cols-2 gap-x-5 md:order-none md:flex md:flex-wrap md:gap-x-8 md:gap-y-2">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="block border-b border-white/10 py-3 text-xs tracking-[0.2em] text-stone uppercase hover:text-ivory md:border-0 md:py-0 md:text-[11px] md:tracking-[0.28em]">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
