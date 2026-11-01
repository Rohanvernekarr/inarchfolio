"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { services } from "@/data/studio";
import { prefersReducedMotion, registerGsap } from "@/lib/animation";
import { ContactCTA } from "@/components/sections/ContactCTA";

const PAGE_COUNT = 2;

function Page({
  index,
  id,
  bare = false,
  children,
}: {
  index: number;
  id?: string;
  bare?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className="page-frame sticky top-0 h-svh overflow-hidden"
      style={{ zIndex: index + 2 }}
    >
      <div
        className={`page-sheet flex h-full flex-col bg-obsidian ${bare ? "justify-center overflow-hidden px-0 py-0" : "justify-start overflow-y-auto px-5 pt-28 pb-16 md:px-10"}`}
      >
        {bare ? null : (
          <p className="mb-8 text-[11px] tracking-[0.32em] text-stone uppercase">
            {String(index + 1).padStart(2, "0")} / {String(PAGE_COUNT).padStart(2, "0")}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

export function Story() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    registerGsap();

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".page-sheet").forEach((sheet) => {
        gsap.fromTo(
          sheet,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sheet.parentElement,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  let page = 0;

  return (
    <div ref={rootRef} className="relative">
      <Page index={page++} id="services" bare>
        <div className="grid h-full grid-cols-1 md:grid-cols-2">
          {services.map((service, index) => (
            <article
              key={service.number}
              className={`service-panel group relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-obsidian px-6 py-8 md:min-h-0 md:px-10 md:py-12 ${
                index < 2 || index === 2 ? "border-b border-white/10 md:border-b" : ""
              } ${index === 2 ? "md:border-b-0" : ""} ${index % 2 === 0 ? "md:border-r md:border-white/10" : ""} ${
                index === 0 ? "pt-24" : ""
              } ${index < 2 ? "md:pt-28" : ""}`}
            >
              <p className="relative font-display text-sm tracking-[0.22em] text-brass">{service.number}</p>
              <p
                aria-hidden
                className="service-num pointer-events-none absolute right-[-0.08em] bottom-[-0.28em] font-display text-[32vw] leading-none font-bold tracking-[-0.08em] text-white/[0.06] md:text-[13vw]"
              >
                {service.number}
              </p>
              <div className="relative max-w-md">
                <h2 className="font-display text-4xl leading-none text-ivory md:text-6xl">{service.title}</h2>
                <p className="mt-4 text-sm leading-6 text-stone md:text-base">{service.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Page>

      <Page index={page++} bare>
        <ContactCTA />
      </Page>
    </div>
  );
}
