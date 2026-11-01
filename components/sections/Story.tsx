"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/data/studio";
import { registerGsap, prefersReducedMotion } from "@/lib/animation";
import { ContactCTA } from "@/components/sections/ContactCTA";

const PAGE_COUNT = 10;
const email = "inarchstructuresandstudio@gmail.com";
const quote = `mailto:${email}?subject=Project%20enquiry%20for%20InArch`;
const pillars = [
  { title: "Architecture", description: "Purposeful plans, elevations and spaces designed around real life.", image: "/images/residence.jpg" },
  { title: "Structural engineering", description: "Technical thinking and coordinated drawings to support the design.", image: "/images/structure.jpg" },
  { title: "Interior design", description: "Material-led interiors shaped by how you live and work.", image: "/images/interior-design.jpg" },
];
const offerings = [
  ["Architectural planning", "2D plans, space planning, furniture layouts and elevation concepts."],
  ["Structural design", "Foundation, column, beam and slab layouts with technical detailing."],
  ["Interior design", "Kitchens, living spaces, bedrooms, wardrobes and material selection."],
  ["3D elevation & visualization", "Exterior concepts, interior views and material visualization."],
  ["Working drawings", "Architectural details, sections, schedules and coordinated layouts."],
  ["Construction consultancy", "Technical guidance, estimates, materials and site coordination."],
  ["Project execution", "Planning, procurement and progress coordination subject to agreed scope."],
] as const;

const stages = ["Consultation", "Planning & concept development", "Design & development", "Technical drawings & coordination", "Execution & project support"];
const reasons = ["Integrated design and engineering", "Functional and practical planning", "Attention to technical details", "Contemporary design approach", "Client-focused solutions", "Transparent communication"];

function Heading({ label, title, text }: { label: string; title: string; text?: string }) {
  return <div className="mb-8 md:mb-12"><p className="mb-3 text-[11px] tracking-[0.32em] text-brass uppercase">{label}</p><h2 className="max-w-5xl font-display text-5xl leading-[.95] tracking-[-0.04em] text-ivory md:text-7xl">{title}</h2>{text && <p className="mt-5 max-w-2xl text-sm leading-7 text-stone md:text-base">{text}</p>}</div>;
}

function Photo({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  return <Image src={src} alt={alt} fill sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-105" />;
}

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
      className={`page-frame min-h-svh ${index === 0 || index === 2 ? "relative" : "sticky top-0"} ${index === 3 ? "overflow-x-clip" : ""}`}
      style={{ zIndex: index + 2 }}
    >
      <div
        className={`page-sheet flex min-h-svh flex-col bg-obsidian ${index === 1 ? "border-t border-brass/30" : ""} ${index === 3 ? "border-l border-brass/30" : ""} ${bare ? "justify-center px-0 py-0" : "justify-start px-5 pt-20 pb-10 md:px-10 md:pt-28 md:pb-16"}`}
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
    if (!root) return;
    const frames = [...root.querySelectorAll<HTMLElement>(".page-frame")];
    const updateStacking = () => {
      for (const frame of frames) {
        if (frame.id === "services" || frame.id === "expertise") continue;
        // Only viewport-sized pages stack; longer pages must remain fully readable.
        frame.style.top = "0px";
        frame.style.position = frame.offsetHeight > window.innerHeight + 1 ? "relative" : "";
      }
    };

    const observer = new ResizeObserver(updateStacking);
    frames.forEach((frame) => observer.observe(frame));
    window.addEventListener("resize", updateStacking);
    updateStacking();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateStacking);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const servicesPage = root.querySelector<HTMLElement>("#services");
    const aboutPage = root.querySelector<HTMLElement>("#about");
    const aboutSheet = aboutPage?.querySelector<HTMLElement>(".page-sheet");
    const expertisePage = root.querySelector<HTMLElement>("#expertise");
    const offeringsPage = root.querySelector<HTMLElement>("#offerings");
    const offeringsSheet = offeringsPage?.querySelector<HTMLElement>(".page-sheet");
    if (!servicesPage || !aboutPage || !aboutSheet || !expertisePage || !offeringsPage || !offeringsSheet || prefersReducedMotion()) return;
    registerGsap();

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: servicesPage,
        start: "bottom bottom",
        end: "+=100%",
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });

      gsap.fromTo(aboutSheet, { y: () => Math.min(window.innerHeight * 0.3, 240) }, {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: aboutPage,
          start: "top bottom",
          end: "top top",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.create({
        trigger: expertisePage,
        start: "bottom bottom",
        end: "+=100%",
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });

      gsap.fromTo(offeringsSheet, { xPercent: 100, rotateY: -5, scale: 0.985, transformOrigin: "left center" }, {
        xPercent: 0,
        rotateY: 0,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: offeringsPage,
          start: "top bottom",
          end: "top top",
          scrub: 0.75,
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  let page = 0;

  return (
    <div ref={rootRef} className="relative">
      <Page index={page++} id="services" bare>
        <div className="grid min-h-svh grid-cols-1 md:grid-cols-2">
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

      <Page index={page++} id="about">
        <div className="flex min-h-full flex-col justify-center py-8 md:py-12">
          <Heading label="The studio / 01" title="Where design meets engineering." />
          <div className="grid gap-8 border-t border-white/15 pt-8 md:grid-cols-2 md:gap-20">
            <p className="font-display text-3xl leading-tight text-ivory md:text-5xl">Thoughtful design. Technical precision. Inspired spaces.</p>
            <div className="max-w-xl space-y-5 text-sm leading-7 text-stone md:text-base"><p>InArch Structures & Studio is an architectural and engineering design studio focused on creating functional spaces through thoughtful planning, technical precision and contemporary design.</p><p>We bring architectural design, structural engineering and interior solutions together to deliver coordinated outcomes for residential and commercial projects.</p><a className="contact-link text-xs tracking-[.2em] text-ivory uppercase" href={quote}>Discover InArch ↗</a></div>
          </div>
        </div>
      </Page>

      <Page index={page++} id="expertise">
        <Heading label="Our expertise / 02" title="Three disciplines. One vision." text="Design and technical thinking working together from the first conversation." />
        <div className="grid gap-5 md:grid-cols-3">{pillars.map((pillar, index) => <article key={pillar.title} className="group border border-white/15 bg-concrete"><div className="relative h-36 overflow-hidden sm:h-40 md:h-44"><Photo src={pillar.image} alt={`Illustrative ${pillar.title.toLowerCase()} photograph`} sizes="(max-width: 768px) 100vw, 33vw" /></div><div className="p-5 md:p-7"><p className="text-xs tracking-[.25em] text-brass">0{index + 1} / 03</p><h3 className="mt-4 font-display text-3xl text-ivory md:text-4xl">{pillar.title}</h3><p className="mt-2 text-sm leading-6 text-stone">{pillar.description}</p><Link className="contact-link mt-5 text-xs tracking-[.2em] text-ivory uppercase" href="/#offerings">Learn more ↗</Link></div></article>)}</div>
        <p className="mt-5 text-xs text-stone">Photography is illustrative, not InArch project work.</p>
      </Page>

      <Page index={page++} id="offerings">
        <Heading label="Our services / 03" title="From first idea to final detail." text="The right services for your project, its stage and the support you need." />
        <div className="grid gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {offerings.map(([title, description], index) => (
            <article key={title} className="flex min-h-56 flex-col bg-obsidian p-5 transition-colors hover:bg-concrete md:p-7">
              <span className="text-xs tracking-[.22em] text-brass">0{index + 1}</span>
              <div className="mt-6 flex flex-1 flex-col">
                <h3 className="font-display text-2xl leading-none text-ivory md:min-h-14 md:text-3xl">{title}</h3>
                <p className="mt-3 text-xs leading-6 text-stone">{description}</p>
                <a className="contact-link mt-auto pt-4 text-[11px] tracking-[.16em] text-ivory uppercase" href={`mailto:${email}?subject=${encodeURIComponent(`Enquiry: ${title}`)}`}>Enquire ↗</a>
              </div>
            </article>
          ))}
          <article className="flex min-h-56 flex-col bg-concrete p-5 md:p-7">
            <span className="text-xs tracking-[.22em] text-brass uppercase">Your project / Next</span>
            <div className="mt-6 flex flex-1 flex-col">
              <h3 className="font-display text-2xl leading-none text-ivory md:min-h-14 md:text-3xl">Let’s design yours.</h3>
              <p className="mt-3 text-xs leading-6 text-stone">Tell us what you’re planning. We’ll help define the right scope for your project.</p>
              <a className="contact-link mt-auto pt-4 text-[11px] tracking-[.16em] text-ivory uppercase" href={quote}>Get a quote ↗</a>
            </div>
          </article>
        </div>
        <p className="mt-5 text-xs text-stone">Scope and deliverables depend on project requirements and applicable professional qualifications.</p>
      </Page>

      <Page index={page++} id="work">
        <Heading label="Featured projects / 04" title="Work worth sharing." text="Residential architecture, structures, interiors and 3D visualizations — a place for verified InArch project stories as they become available." />
        <div className="grid overflow-hidden border border-white/15 md:grid-cols-2"><div className="relative min-h-64 md:min-h-[45vh]"><Photo src="/images/residence.jpg" alt="Illustrative contemporary home, not an InArch project" sizes="(max-width: 768px) 100vw, 50vw" /></div><div className="flex flex-col justify-center bg-concrete p-7 md:p-12"><p className="text-xs tracking-[.25em] text-brass uppercase">Portfolio / Coming soon</p><h3 className="mt-5 font-display text-4xl leading-none text-ivory md:text-6xl">Every project has a story.</h3><p className="mt-5 max-w-md text-sm leading-7 text-stone">Project details, drawings and completed photographs will be shared here when approved for publication. We don’t present conceptual imagery as completed work.</p><a className="contact-link mt-7 w-fit text-xs tracking-[.2em] text-ivory uppercase" href={quote}>Discuss your project ↗</a></div></div>
        <p className="mt-4 text-xs text-stone">Preview photograph is illustrative only.</p>
      </Page>


      <Page index={page++} id="process">
        <div className="grid min-h-full content-center gap-8 py-8 md:grid-cols-2 md:gap-16"><Heading label="Our process / 05" title="A clear path from idea to reality." text="Five connected stages, shaped by your brief and the level of support agreed for your project." /><ol className="border-t border-white/15">{stages.map((stage, index) => <li key={stage} className="flex items-center gap-6 border-b border-white/15 py-5 md:py-6"><span className="text-xs tracking-[.2em] text-brass">0{index + 1}</span><h3 className="font-display text-2xl text-ivory md:text-3xl">{stage}</h3></li>)}</ol></div>
      </Page>

      <Page index={page++} id="approach">
        <Heading label="Why choose InArch / 06" title="Design with purpose. Detail with care." text="A coordinated approach to thoughtful design, engineering and execution." />
        <div className="grid gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-3">{reasons.map((reason, index) => <div key={reason} className="flex min-h-36 flex-col justify-between bg-obsidian p-6 md:min-h-44 md:p-8"><span className="text-xs tracking-[.2em] text-brass">0{index + 1}</span><h3 className="max-w-xs font-display text-2xl leading-tight text-ivory md:text-3xl">{reason}</h3></div>)}</div>
      </Page>

      <Page index={page++} id="packages">
        <Heading label="Packages / 07" title="The right scope for your project." text="Every project is different. Start with a direction, then request a custom quotation based on your needs." />
        <div className="grid gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-5">{["Basic planning", "Architectural complete", "Structural design", "Interior design", "Complete project solution"].map((name, index) => <div key={name} className="flex min-h-48 flex-col justify-between bg-obsidian p-6"><span className="text-xs tracking-[.2em] text-brass">0{index + 1}</span><div><h3 className="font-display text-3xl leading-none text-ivory">{name}</h3><a className="contact-link mt-5 text-[11px] tracking-[.16em] text-ivory uppercase" href={`mailto:${email}?subject=${encodeURIComponent(`Custom quote: ${name}`)}`}>Request custom quote ↗</a></div></div>)}</div>
        <p className="mt-5 text-xs leading-6 text-stone">Deliverables, revisions, add-ons and timelines are confirmed in your custom quotation. Project execution is subject to agreed scope.</p>
      </Page>

      <Page index={page++} id="testimonials">
        <div className="flex min-h-full flex-col justify-center py-8"><Heading label="Client testimonials / 08" title="The best stories come from our clients." /><div className="max-w-3xl border-l-2 border-brass pl-6 md:pl-10"><p className="font-display text-3xl leading-tight text-ivory md:text-5xl">We’re making space for genuine feedback from the people we work with.</p><p className="mt-6 text-sm leading-7 text-stone">Verified client reviews will appear here when available. No sample or fabricated testimonials.</p><a className="contact-link mt-6 text-xs tracking-[.2em] text-ivory uppercase" href={`mailto:${email}?subject=Feedback%20for%20InArch`}>Share your experience ↗</a></div></div>
      </Page>

      <Page index={page++} bare>
        <ContactCTA />
      </Page>
    </div>
  );
}
