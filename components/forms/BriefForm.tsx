"use client";

import { useEffect, useId, useState } from "react";

export function BriefForm({
  variant = "dialog",
  onClose,
}: {
  variant?: "dialog" | "inline";
  onClose?: () => void;
}) {
  const titleId = useId();
  const [sent, setSent] = useState(false);
  const dialog = variant === "dialog";

  useEffect(() => {
    if (!dialog) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [dialog, onClose]);

  const box = dialog
    ? "mt-2 w-full border border-white/15 bg-obsidian px-3 py-3 text-sm text-ivory outline-none in-data-[theme=light]:border-ivory/20"
    : "mt-2 w-full border border-white/25 bg-white/[0.04] px-3 py-3 text-base text-ivory outline-none placeholder:text-stone focus:border-brass in-data-[theme=light]:border-ivory/25 in-data-[theme=light]:bg-ivory/[0.04]";

  const fields = sent ? (
    <p className="border border-white/15 bg-white/[0.04] px-5 py-6 text-base leading-7 text-ivory in-data-[theme=light]:border-ivory/20 in-data-[theme=light]:bg-ivory/[0.04]">
      Thank you. Your brief is saved on this page only. It is not emailed yet.
    </p>
  ) : (
    <form
      className={dialog ? "mt-8 space-y-4" : "grid gap-5 sm:grid-cols-2"}
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <Field label="Your name" name="name" placeholder="Name" box={box} />
      <Field label="Email" name="email" type="email" placeholder="name@email.com" box={box} />
      <Field label="City" name="city" placeholder="Where is the site?" box={box} />
      <label className="block text-sm text-ivory">
        What are you building?
        <select name="type" required defaultValue="" className={box}>
          <option value="" disabled>
            Choose one
          </option>
          <option>House</option>
          <option>Courtyard house</option>
          <option>Addition</option>
          <option>Workplace</option>
          <option>Other</option>
        </select>
      </label>
      <label className="block text-sm text-ivory sm:col-span-2">
        About the project
        <textarea
          name="note"
          required
          rows={3}
          placeholder="Plot, rooms, and what you need first."
          className={`${box} resize-none`}
        />
      </label>
      <button
        type="submit"
        className={
          dialog
            ? "w-full bg-brass py-4 text-sm text-obsidian"
            : "bg-brass px-8 py-4 text-sm text-obsidian transition-opacity hover:opacity-90 sm:col-span-2 sm:justify-self-start"
        }
      >
        Send the brief
      </button>
    </form>
  );

  if (!dialog) return fields;

  const panel = (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg border border-white/10 bg-concrete p-6 in-data-[theme=light]:border-ivory/15 md:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <h2 id={titleId} className="font-display text-3xl text-ivory">
            Project brief
          </h2>
          {onClose ? (
            <button type="button" onClick={onClose} className="text-[11px] tracking-[0.24em] text-stone uppercase">
              Close
            </button>
          ) : null}
        </div>
        {fields}
      </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 md:items-center" role="presentation">
      {panel}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  box,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  box: string;
}) {
  return (
    <label className="block text-sm text-ivory">
      {label}
      <input name={name} type={type} required placeholder={placeholder} className={box} />
    </label>
  );
}
