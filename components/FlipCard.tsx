"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { ArtifactId } from "./artifactTypes";

type FlipCardProps = {
  id: Extract<ArtifactId, "evidence" | "note">;
  image: string;
  title: string;
  eyebrow: string;
  front: string;
  backTitle: string;
  back: string;
  flipped: boolean;
  setFlipped: (flipped: boolean) => void;
  markOpened: () => void;
};

export default function FlipCard({
  id,
  image,
  title,
  eyebrow,
  front,
  backTitle,
  back,
  flipped,
  setFlipped,
  markOpened
}: FlipCardProps) {
  const flip = () => {
    setFlipped(!flipped);
    markOpened();
  };

  return (
    <motion.div
      data-flip-id={id}
      className="artifact-node relative h-[440px] w-[min(560px,86vw)] cursor-pointer text-raff-ink outline-none [perspective:1200px] focus-visible:ring-2 focus-visible:ring-raff-brass"
      role="button"
      tabIndex={0}
      onClick={flip}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") flip();
      }}
      whileTap={{ scale: 0.985 }}
    >
      <motion.div
        className="relative h-full w-full rounded-[8px] shadow-artifact [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 rounded-[8px] border border-raff-brass/35 bg-[#f8efd8] p-8 [backface-visibility:hidden]">
          <Image src={image} alt="" width={330} height={220} className="mx-auto h-44 w-auto" />
          <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.28em] text-raff-oxblood">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-none">{title}</h2>
          <p className="mt-5 text-sm leading-7 text-raff-ink/68">{front}</p>
        </div>
        <div
          className="absolute inset-0 rounded-[8px] border border-raff-brass/35 bg-[#17130f] p-8 text-raff-paper [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-raff-brass">
            Reverse analysis
          </p>
          <h2 className="mt-8 font-serif text-4xl leading-tight">{backTitle}</h2>
          <p className="mt-7 text-base leading-8 text-raff-paper/72">{back}</p>
          <div className="mt-10 h-px bg-raff-brass/40" />
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-raff-brass/80">
            Preserved in box state
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
