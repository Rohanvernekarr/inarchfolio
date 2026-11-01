import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-[70vh] flex-col justify-end bg-obsidian px-5 pt-32 pb-20 md:px-10">
      <p className="text-[11px] tracking-[0.38em] text-brass uppercase">404</p>
      <h1 className="mt-4 font-display text-5xl text-ivory md:text-7xl">This room is not on the plan.</h1>
      <Link href="/" className="mt-8 text-[11px] tracking-[0.28em] text-stone uppercase">
        Back to the building
      </Link>
    </main>
  );
}
