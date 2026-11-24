"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { GalleryImage } from "@/data/projects";
import { cn } from "@/lib/utils";

export function Gallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length]);

  const desktop = images.filter((i) => i.kind === "desktop");
  const mobile = images.filter((i) => i.kind === "mobile");
  const current = index !== null ? images[index] : null;

  const thumb = (img: GalleryImage) => {
    const i = images.indexOf(img);
    return (
      <figure key={img.src} className={cn(img.kind === "mobile" && "max-w-[15rem]")}>
        <button
          type="button"
          onClick={() => setIndex(i)}
          className="group relative block w-full overflow-hidden rounded-xl border border-border bg-surface-2 text-left"
          aria-label={`Enlarge screenshot: ${img.caption ?? img.alt}`}
        >
          <span className={cn("relative block", img.kind === "mobile" ? "aspect-[390/844]" : "aspect-[16/10]")}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={img.kind === "mobile" ? "240px" : "(min-width: 1024px) 50vw, 100vw"}
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </span>
          <span className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full bg-bg/80 text-fg opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 size={14} aria-hidden="true" />
          </span>
        </button>
        {img.caption && <figcaption className="mt-2 text-xs text-fg-subtle">{img.caption}</figcaption>}
      </figure>
    );
  };

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">{desktop.map(thumb)}</div>
      {mobile.length > 0 && <div className="mt-6 flex flex-wrap gap-5">{mobile.map(thumb)}</div>}

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setIndex(null);
        }}
        aria-label={`${title} screenshots`}
        className="m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        {current && index !== null && (
          <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-4 p-4 sm:p-10">
            <div className={cn("pointer-events-auto relative w-full", current.kind === "mobile" ? "h-[80vh] max-w-[24rem]" : "aspect-[16/10] max-h-[80vh] max-w-6xl")}>
              <Image src={current.src} alt={current.alt} fill sizes="100vw" className="rounded-xl object-contain" />
            </div>
            <div className="pointer-events-auto flex items-center gap-3 text-sm text-white/80">
              <button type="button" onClick={() => setIndex((index - 1 + images.length) % images.length)} className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 hover:bg-white/10" aria-label="Previous screenshot">
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <span className="min-w-28 text-center">
                {current.caption ?? title} · {index + 1}/{images.length}
              </span>
              <button type="button" onClick={() => setIndex((index + 1) % images.length)} className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 hover:bg-white/10" aria-label="Next screenshot">
                <ChevronRight size={18} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setIndex(null)} className="ml-2 inline-flex size-10 items-center justify-center rounded-full border border-white/20 hover:bg-white/10" aria-label="Close" autoFocus>
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
