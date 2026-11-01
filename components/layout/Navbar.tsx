"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/animation";
import { nav } from "@/data/studio";

function scrollToSection(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
  const id = href.split("#")[1];
  if (!id || window.location.pathname !== "/") return;
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const top = target.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: "auto" });
  registerGsap();
  ScrollTrigger.update();
  history.pushState(null, "", `/#${id}`);
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="flex items-center justify-between px-5 py-5 md:px-10">
        <Link
          href="/"
          className="font-display text-sm tracking-[0.42em] text-ivory"
          onClick={() => setOpen(false)}
        >
          INARCH
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                scrollToSection(event, item.href);
              }}
              className="text-[11px] tracking-[0.28em] text-stone uppercase transition-colors hover:text-ivory"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="text-[11px] tracking-[0.28em] text-stone uppercase md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            className="fixed inset-0 z-40 flex flex-col justify-end bg-obsidian/95 px-6 pb-16 backdrop-blur-md md:hidden"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <button
              type="button"
              className="absolute top-5 right-5 text-[11px] tracking-[0.28em] text-stone uppercase"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            {nav.map((item, index) => (
              <motion.div
                key={item.href}
                initial={reduced ? false : { y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href={item.href}
                  className="block py-3 font-display text-5xl text-ivory"
                  onClick={(event) => {
                    scrollToSection(event, item.href);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </a>
              </motion.div>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
