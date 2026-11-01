type ProjectSceneProps = {
  silhouette: number[];
  label: string;
};

export function ProjectScene({ silhouette, label }: ProjectSceneProps) {
  const peak = Math.max(...silhouette);

  return (
    <div className="relative h-full min-h-[52vh] overflow-hidden bg-concrete">
      <div className="blueprint-grid absolute inset-0 opacity-70" />
      <div className="absolute inset-6 border border-brass/25 md:inset-10" />
      <div className="absolute right-8 top-8 font-display text-[11px] tracking-[0.32em] text-brass uppercase">
        {label}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-2 px-10 pb-16 md:gap-3 md:px-20">
        {silhouette.map((height, index) => (
          <div
            key={`${height}-${index}`}
            className="w-8 bg-stone/80 md:w-12"
            style={{ height: `${(height / peak) * 46}vh` }}
          />
        ))}
      </div>
      <div className="absolute bottom-8 left-8 h-px w-24 bg-brass" />
    </div>
  );
}
