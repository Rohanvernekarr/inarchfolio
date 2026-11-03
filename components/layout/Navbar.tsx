"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { nav } from "@/data/studio";

function scrollToSection(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
  const id = href.split("#")[1];
  if (!id || window.location.pathname !== "/") return;
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const top = target.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  history.pushState(null, "", `/#${id}`);
}

function ThemeButton() {
  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    if (next === "light") root.dataset.theme = "light";
    else delete root.dataset.theme;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // The current page can still switch themes without storage access.
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch between light and dark themes"
      className="theme-switch inline-flex size-9 shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
    >
      <svg className="theme-switch-dark size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="theme-switch-light size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.5 14.4A8.5 8.5 0 0 1 9.6 3.5 8.5 8.5 0 1 0 20.5 14.4Z" />
      </svg>
    </button>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <>
    <header className="site-header fixed inset-x-0 top-0 z-40">
      <div className="flex items-center justify-between px-5 py-5 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-3 text-ivory"
          onClick={() => setOpen(false)}
        >
          <Image src="/logo.jpeg" alt="" width={44} height={44} className="size-11 rounded-full object-cover" priority />
          <span className="flex flex-col gap-1">
            <span className="font-display text-xl leading-none font-semibold tracking-[-0.05em] md:text-2xl">InArch<span className="text-brass">.</span></span>
            <span className="font-sans text-[8px] leading-none font-medium tracking-[0.13em] text-stone uppercase md:text-[9px]">Structures &amp; Studio</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-4 lg:gap-8 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                scrollToSection(event, item.href);
              }}
              className="text-[10px] tracking-[0.14em] text-stone uppercase transition-colors hover:text-ivory lg:text-[11px] lg:tracking-[0.22em]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 md:gap-5">
          <ThemeButton />
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
      </div>
    </header>
    {typeof document !== "undefined" ? createPortal(
      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-obsidian px-6 pb-8 md:hidden"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-obsidian py-5">
              <ThemeButton />
              <button
                type="button"
                className="text-[11px] tracking-[0.28em] text-stone uppercase"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="pt-6">
              {nav.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={reduced ? false : { y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * index, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={item.href}
                    className="block py-2 font-display text-4xl text-ivory sm:py-3 sm:text-5xl"
                    onClick={(event) => {
                      scrollToSection(event, item.href);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>, document.body) : null}
    </>
  );
}
