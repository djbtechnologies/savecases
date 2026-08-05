"use client";

import { motion } from "motion/react";

type LetterStage = "front" | "back" | "open";

type LetterProps = {
  stage: LetterStage;
  setStage: (stage: LetterStage) => void;
  markOpened: () => void;
};

export default function Letter({ stage, setStage, markOpened }: LetterProps) {
  const advance = () => {
    if (stage === "front") setStage("back");
    if (stage === "back") {
      setStage("open");
      markOpened();
    }
  };

  const isOpen = stage === "open";
  const isBack = stage === "back";

  return (
    <motion.div
      data-flip-id="letter"
      className="artifact-node relative w-[min(720px,88vw)] cursor-pointer rounded-[8px] text-raff-ink shadow-artifact outline-none focus-visible:ring-2 focus-visible:ring-raff-brass"
      role="button"
      tabIndex={0}
      onClick={advance}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") advance();
      }}
      initial={false}
      animate={{ rotateY: isBack ? 180 : 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="rounded-[8px] border border-raff-brass/35 bg-[#fff7e4] p-8"
        animate={{ minHeight: isOpen ? 620 : 470 }}
      >
        {!isOpen ? (
          <div className="[backface-visibility:hidden]">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-raff-oxblood">
              Personal correspondence
            </p>
            <h2 className="mt-5 font-serif text-5xl leading-none">Stephen T. Raff, Esq.</h2>
            <div className="mt-10 h-px bg-raff-brass/35" />
            <p className="mt-10 max-w-[46ch] font-serif text-2xl leading-10 text-raff-ink/72">
              Prepared privately for review of Raff & Raff&apos;s after-hours intake coverage.
            </p>
            <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.24em] text-raff-ink/45">
              Reverse side contains the note
            </p>
          </div>
        ) : (
          <article className="mx-auto max-w-[58ch]">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-raff-oxblood">
              Open letter
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight">
              Stephen,
            </h2>
            <div className="mt-6 space-y-5 text-[1rem] leading-8 text-raff-ink/78">
              <p>
                Raff & Raff already has the trust, history, and injury-case credibility that
                callers are looking for. The vulnerable moment is not persuasion. It is the
                first response after the office closes.
              </p>
              <p>
                SaveCases is built to answer those after-hours injury inquiries live, gather
                the facts your team needs, screen against your criteria, and route organized
                summaries for attorney review.
              </p>
              <p>
                This private box lays out a simple 30-day test: measure the calls, identify
                qualified opportunities, and decide from evidence whether ongoing coverage
                makes economic sense.
              </p>
            </div>
            <p className="mt-10 font-serif text-2xl italic text-raff-ink/70">Dario, SaveCases</p>
          </article>
        )}
      </motion.div>
      {isBack && !isOpen ? (
        <div
          className="pointer-events-none absolute inset-0 rounded-[8px] border border-raff-brass/35 bg-[#efe1bf] p-8 [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-raff-oxblood">
            Reverse
          </p>
          <p className="mt-16 font-serif text-3xl leading-10 text-raff-ink/72">
            One qualified missed injury matter can outweigh months of after-hours intake
            coverage.
          </p>
        </div>
      ) : null}
    </motion.div>
  );
}
