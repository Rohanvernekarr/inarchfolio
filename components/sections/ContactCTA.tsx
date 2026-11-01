"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scene, setSceneRegion } from "@/lib/scene";
import { prefersReducedMotion, registerGsap } from "@/lib/animation";
import { contactChannels } from "@/data/studio";

export function ContactCTA() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (prefersReducedMotion()) {
      scene.reveal = 1;
      return;
    }

    registerGsap();
    const context = gsap.context(() => {
      const play = () => {
        if (element.dataset.played === "1") return;
        element.dataset.played = "1";
        gsap.to(".contact-word", { yPercent: 0, autoAlpha: 1, duration: 1.05, ease: "power3.out" });
        gsap.to(".contact-link", { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: "power3.out", delay: 0.12 });
      };

      gsap.set(".contact-word", { yPercent: 24, autoAlpha: 0 });
      gsap.set(".contact-link", { y: 18, autoAlpha: 0 });

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) play();
        },
        { threshold: 0.4 },
      );
      observer.observe(element);

      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        end: "bottom top",
        onToggle: (self) => {
          setSceneRegion("closing", self.isActive);
          if (!self.isActive && scene.mode === "close") scene.mode = "idle";
        },
        onUpdate: (self) => {
          scene.mode = "close";
          scene.t = self.progress;
        },
      });

      return () => observer.disconnect();
    }, element);

    return () => context.revert();
  }, []);

  return (
    <section ref={ref} id="contact" className="relative flex h-full flex-col items-center justify-center overflow-hidden">
      <h2 className="contact-word px-[2vw] text-center font-display text-[26vw] leading-[0.78] font-bold tracking-[-0.07em] whitespace-nowrap text-[#e10600]">
        CONTACT
      </h2>
      <p className="mt-5 px-5 text-center text-sm text-stone">Have a project in mind? Let’s design it together.</p>
      <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 px-5 md:mt-14 md:gap-16">
        {contactChannels.map((channel) => (
          <li key={channel.label}>
            <a
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              className="contact-link text-[11px] tracking-[0.34em] text-ivory uppercase md:text-xs"
            >
              {channel.label}
            </a>
          </li>
        ))}
      </ul>

    </section>
  );
}
