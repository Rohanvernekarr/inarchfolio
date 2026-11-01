import type { ReactNode } from "react";

export function Chapter({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="relative z-10 bg-obsidian px-5 pt-32 pb-24 md:px-10">
      <p className="text-[11px] tracking-[0.38em] text-brass uppercase">{eyebrow}</p>
      <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.95] text-ivory md:text-7xl">{title}</h1>
      <div className="mt-12 max-w-3xl text-base leading-8 text-stone">{children}</div>
    </article>
  );
}
