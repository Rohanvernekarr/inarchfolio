"use client";

import { useEffect } from "react";

export function Go({ href }: { href: string }) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return (
    <main className="relative z-10 bg-obsidian px-5 pt-40 pb-24">
      <a href={href} className="text-[11px] tracking-[0.28em] text-brass uppercase">
        Continue
      </a>
    </main>
  );
}
