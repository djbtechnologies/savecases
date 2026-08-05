"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

type EvidenceBoardProps = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
};

export default function EvidenceBoard({ opened, setOpened }: EvidenceBoardProps) {
  const ribbonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ribbonRef.current || opened) return;
    gsap.registerPlugin(Draggable);
    const instances = Draggable.create(ribbonRef.current, {
      type: "x,y",
      bounds: { minX: -70, maxX: 70, minY: -35, maxY: 35 },
      onDragEnd: function () {
        if (Math.abs(this.x) + Math.abs(this.y) > 28) {
          setOpened(true);
        }
        gsap.to(this.target, { x: 0, y: 0, duration: 0.28, ease: "power2.out" });
      }
    });

    return () => {
      instances.forEach((instance) => instance.kill());
    };
  }, [opened, setOpened]);

  return (
    <motion.div
      data-flip-id="roll"
      className="artifact-node relative w-[min(940px,92vw)] rounded-[10px] text-raff-ink shadow-artifact"
    >
      <motion.div
        className="relative overflow-hidden rounded-[10px] border border-raff-brass/35 bg-[#eee3cc]"
        animate={{ minHeight: opened ? 640 : 330 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute left-1/2 top-8 z-20 w-[min(420px,70vw)] -translate-x-1/2"
          animate={{ y: opened ? -170 : 0, opacity: opened ? 0 : 1, scale: opened ? 0.86 : 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src="/raff/evidence-roll.svg" alt="" width={440} height={210} />
        </motion.div>
        <motion.div
          ref={ribbonRef}
          className="absolute left-1/2 top-[128px] z-30 h-12 w-[min(410px,70vw)] -translate-x-1/2 cursor-grab rounded-full bg-raff-oxblood shadow-brass active:cursor-grabbing"
          onClick={() => setOpened(true)}
          animate={{
            rotate: opened ? 9 : 0,
            y: opened ? -126 : 0,
            opacity: opened ? 0.35 : 1,
            scaleX: opened ? 1.18 : 1
          }}
          transition={{ duration: 0.55 }}
          title="Ribbon"
        />
        <motion.div
          className="mx-auto grid h-full w-full gap-6 p-7 md:grid-cols-[.85fr_1.15fr]"
          initial={false}
          animate={{ clipPath: opened ? "inset(0% 0% 0% 0%)" : "inset(45% 3% 45% 3%)" }}
          transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
        >
          <section className="rounded-[8px] border border-raff-gold/30 bg-[#fbf1d8] p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-raff-oxblood">
              Evidence board
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              The after-hours intake window
            </h2>
            <p className="mt-5 text-sm leading-7 text-raff-ink/70">
              Injury callers do not wait for business hours. The board maps the moment
              between search intent, live response, qualification, and attorney review.
            </p>
          </section>
          <section className="relative min-h-[420px] rounded-[8px] border border-raff-gold/25 bg-[#211b16] p-6 text-raff-paper">
            <BoardPin className="left-[9%] top-[18%]" label="8:14 PM" />
            <BoardPin className="left-[54%] top-[12%]" label="Search" />
            <BoardPin className="left-[25%] top-[58%]" label="Live answer" />
            <BoardPin className="left-[68%] top-[68%]" label="Routed" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 420" aria-hidden="true">
              <path d="M75 86C174 48 277 47 390 62M142 255c80-88 171-144 274-170M142 255c94 28 172 38 250 23" fill="none" stroke="#c7a457" strokeOpacity=".58" strokeWidth="3" strokeDasharray="8 9"/>
            </svg>
            <div className="absolute bottom-6 left-6 right-6 rounded-[8px] border border-raff-brass/25 bg-black/22 p-5 backdrop-blur">
              <p className="font-serif text-2xl">30-day proof point</p>
              <p className="mt-2 text-sm leading-6 text-raff-paper/70">
                Count real after-hours demand, classify fit, and compare qualified opportunities
                against coverage cost.
              </p>
            </div>
          </section>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function BoardPin({ className, label }: { className: string; label: string }) {
  return (
    <div className={`absolute z-10 ${className}`}>
      <span className="block h-4 w-4 rounded-full bg-raff-oxblood shadow-[0_0_0_6px_rgba(124,36,31,.24)]" />
      <span className="mt-3 block rounded bg-raff-paper px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-raff-ink">
        {label}
      </span>
    </div>
  );
}
