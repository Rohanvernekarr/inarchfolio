"use client";

import { useEffect, useState } from "react";
import { processStages } from "@/data/studio";

export function Process() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.stage);
        if (!Number.isNaN(index)) setActive(index);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.2, 0.6] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" className="relative z-10 bg-obsidian">
      <div className="grid md:grid-cols-2">
        <div className="relative hidden md:block">
          <div className="sticky top-0 flex h-screen items-center px-10">
            <div className="relative h-[68vh] w-full overflow-hidden border border-white/10 bg-concrete">
              <Plate stage={active} />
            </div>
          </div>
        </div>
        <div className="px-5 py-24 md:px-12 md:py-0">
          <div className="md:pt-[28vh]">
            <p className="text-[11px] tracking-[0.38em] text-brass uppercase">04 — Process</p>
            <h2 className="mt-4 max-w-md font-display text-4xl leading-none text-ivory md:text-6xl">
              From a line to a building.
            </h2>
          </div>
          <div className="mt-16 md:mt-[18vh]">
            {processStages.map((stage, index) => (
              <article
                key={stage.id}
                data-stage={index}
                className="border-t border-white/10 py-16 md:min-h-[70vh] md:py-24"
              >
                <p className="text-[11px] tracking-[0.28em] text-brass uppercase">{stage.number}</p>
                <h3 className="mt-4 font-display text-3xl text-ivory md:text-5xl">{stage.title}</h3>
                <p className="mt-5 max-w-md text-sm leading-7 text-stone md:text-base">{stage.text}</p>
                <div className="mt-8 h-56 border border-white/10 md:hidden">
                  <Plate stage={index} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Plate({ stage }: { stage: number }) {
  if (stage === 1) {
    return (
      <div className="flex h-full items-end bg-[#171717] p-8">
        <div className="flex w-full items-end gap-2">
          {[40, 68, 100, 82, 54].map((height) => (
            <div key={height} className="flex-1 bg-stone/80" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (stage === 2) {
    return (
      <div className="relative h-full bg-[#10100f]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(214,183,122,0.28),transparent_42%),linear-gradient(160deg,#2a2826,#0c0c0c_70%)]" />
        <div className="absolute bottom-8 left-8 text-[11px] tracking-[0.28em] text-brass uppercase">
          Built work
        </div>
      </div>
    );
  }

  return (
    <svg className="h-full w-full text-brass" viewBox="0 0 400 520" fill="none" aria-hidden>
      <rect x="40" y="36" width="320" height="448" stroke="currentColor" strokeWidth="1" />
      <path d="M40 140 H360 M40 250 H360 M40 360 H360 M120 36 V484 M200 36 V484 M280 36 V484" stroke="currentColor" strokeWidth="0.6" />
      <rect x="150" y="360" width="100" height="124" stroke="currentColor" />
    </svg>
  );
}
