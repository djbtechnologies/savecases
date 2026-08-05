"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { ArtifactId } from "./artifactTypes";

type ArtifactProps = {
  id: ArtifactId;
  title: string;
  subtitle: string;
  image: string;
  className?: string;
  opened?: boolean;
  onSelect: (id: ArtifactId) => void;
};

export default function Artifact({
  id,
  title,
  subtitle,
  image,
  className = "",
  opened = false,
  onSelect
}: ArtifactProps) {
  return (
    <motion.button
      type="button"
      data-flip-id={id}
      className={`artifact-node group relative isolate flex h-full min-h-[132px] w-full flex-col items-start justify-end overflow-hidden rounded-[8px] border border-raff-brass/25 bg-raff-paper/95 p-4 text-left text-raff-ink shadow-artifact outline-none transition-colors focus-visible:ring-2 focus-visible:ring-raff-brass ${className}`}
      onClick={() => onSelect(id)}
      whileHover={{ y: -8, rotate: id === "roll" ? -2 : 1.4, scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
    >
      <Image
        src={image}
        alt=""
        width={440}
        height={300}
        className="pointer-events-none absolute inset-x-0 top-0 z-0 mx-auto h-[78%] w-[92%] object-contain drop-shadow-xl"
        priority={id === "dossier"}
      />
      <span className="absolute right-3 top-3 rounded-full border border-raff-brass/30 bg-raff-ink/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-raff-brass">
        {opened ? "Opened" : "Sealed"}
      </span>
      <span className="relative z-10 block font-serif text-[1.05rem] leading-tight text-raff-ink">
        {title}
      </span>
      <span className="relative z-10 mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-raff-ink/60">
        {subtitle}
      </span>
    </motion.button>
  );
}
