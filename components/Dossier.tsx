"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";

type DossierProps = {
  opened: boolean;
  markOpened: () => void;
};

export default function Dossier({ opened, markOpened }: DossierProps) {
  useEffect(() => {
    if (opened) return;
    const timer = window.setTimeout(markOpened, 280);
    return () => window.clearTimeout(timer);
  }, [markOpened, opened]);

  return (
    <motion.div
      data-flip-id="dossier"
      className="artifact-node relative w-[min(760px,88vw)] rounded-[10px] border border-raff-brass/35 bg-[#f8efd8] p-7 text-raff-ink shadow-artifact"
      initial={false}
      animate={{ rotateX: 0 }}
    >
      <div className="relative min-h-[430px] overflow-hidden rounded-[8px] border border-raff-gold/30 bg-[#fff6df]">
        <motion.div
          className="absolute inset-x-0 top-0 z-20 origin-top border-b border-raff-gold/30 bg-[#e9d8b5] p-8 shadow-xl"
          animate={{ rotateX: opened ? -78 : 0, y: opened ? -12 : 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Image
            src="/raff/dossier-envelope.svg"
            alt=""
            width={420}
            height={290}
            className="mx-auto h-44 w-auto"
          />
        </motion.div>
        <div className="grid gap-6 px-8 pb-8 pt-40 md:grid-cols-[1.05fr_.95fr]">
          <section>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-raff-oxblood">
              Partner intake review
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-none text-raff-ink">
              Raff & Raff after-hours opportunity file
            </h2>
            <p className="mt-5 text-sm leading-7 text-raff-ink/70">
              A private SaveCases review prepared around injury inquiries that happen after
              office hours, when caller urgency is high and response time decides who gets
              the conversation.
            </p>
          </section>
          <section className="rounded-[8px] border border-raff-gold/25 bg-white/45 p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-raff-ink/55">
              Contents
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-raff-ink/78">
              <li>Personal letter for Stephen T. Raff, Esq.</li>
              <li>Evidence board for missed-call risk</li>
              <li>Two short case cards for partner review</li>
              <li>Private briefing video</li>
            </ul>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
