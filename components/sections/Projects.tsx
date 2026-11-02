"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { projects } from "@/data/projects";
import { prefersReducedMotion, registerGsap } from "@/lib/animation";
import { ProjectScene } from "@/components/scenes/ProjectScene";

export function Projects() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    registerGsap();

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".project-chapter").forEach((chapter) => {
        gsap.from(chapter.querySelector(".project-copy"), {
          y: 48,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: chapter,
            start: "top 70%",
          },
        });
      });
    }, root);

    return () => context.revert();
  }, []);

  if (projects.length === 0) return null;

  return (
    <section ref={rootRef} id="work" className="relative z-10 bg-obsidian">
      <div className="flex items-end justify-between px-5 pt-24 pb-8 md:px-10">
        <div>
          <p className="text-[11px] tracking-[0.38em] text-brass uppercase">03 — Work</p>
          <h2 className="mt-4 font-display text-4xl text-ivory md:text-6xl">Selected buildings</h2>
        </div>
        <Link href="/projects" className="text-[11px] tracking-[0.28em] text-stone uppercase hover:text-ivory">
          Index
        </Link>
      </div>
      {projects.map((project) => (
        <article key={project.slug} className="project-chapter border-t border-white/10 in-data-[theme=light]:border-ivory/15">
          <Link href={`/projects/${project.slug}`} className="grid md:grid-cols-2">
            <ProjectScene silhouette={project.silhouette} label={project.number} />
            <div className="project-copy flex flex-col justify-between px-5 py-10 md:px-12 md:py-16">
              <p className="font-display text-6xl text-white/15 in-data-[theme=light]:text-ivory/15 md:text-8xl">{project.number}</p>
              <div>
                <h3 className="font-display text-4xl text-ivory md:text-6xl">{project.name}</h3>
                <p className="mt-4 max-w-md text-sm leading-6 text-stone md:text-base">{project.summary}</p>
                <dl className="mt-8 grid grid-cols-2 gap-4 text-[11px] tracking-[0.22em] text-stone uppercase">
                  <div>
                    <dt className="text-brass">Location</dt>
                    <dd className="mt-2 text-ivory">{project.location}</dd>
                  </div>
                  <div>
                    <dt className="text-brass">Type</dt>
                    <dd className="mt-2 text-ivory">{project.type}</dd>
                  </div>
                  <div>
                    <dt className="text-brass">Year</dt>
                    <dd className="mt-2 text-ivory">{project.year}</dd>
                  </div>
                  <div>
                    <dt className="text-brass">Area</dt>
                    <dd className="mt-2 text-ivory">{project.area}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </section>
  );
}
