"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const assets = {
  1: "/assets/raff-raff/1.png",
  2: "/assets/raff-raff/2.png",
  3: "/assets/raff-raff/3.png",
  4: "/assets/raff-raff/4.png",
  5: "/assets/raff-raff/5.png",
  6: "/assets/raff-raff/6.png",
  7: "/assets/raff-raff/7.png",
  8: "/assets/raff-raff/8.png",
  9: "/assets/raff-raff/9.png",
  10: "/assets/raff-raff/10.png",
  11: "/assets/raff-raff/11.png",
  12: "/assets/raff-raff/12.png",
  13: "/assets/raff-raff/13.png",
  14: "/assets/raff-raff/14.png",
  15: "/assets/raff-raff/15.png",
  16: "/assets/raff-raff/16.png",
  17: "/assets/raff-raff/17.png",
  18: "/assets/raff-raff/18.png",
  19: "/assets/raff-raff/19.png",
  20: "/assets/raff-raff/20.png"
};

const hotspots = {
  envelope: { x: 23.2, y: 32.4, width: 26.5, height: 21.6 },
  map: { x: 52.4, y: 33.4, width: 26.8, height: 19.4 },
  dossier: { x: 23.7, y: 55.5, width: 26.5, height: 35.6 },
  briefing: { x: 53.6, y: 55.1, width: 25.4, height: 35.9 }
};

type SequenceId = "envelope" | "map" | "dossier" | "briefing";
type SoundId =
  | "caseOpen"
  | "envelopeOpen"
  | "paperSlide"
  | "mapUnroll"
  | "dossierOpen"
  | "pageTurn"
  | "privateBriefingOpen"
  | "softClick";

type CompletedState = Record<SequenceId, boolean>;

const initialCompleted: CompletedState = {
  envelope: false,
  map: false,
  dossier: false,
  briefing: false
};

const sequenceScenes: Record<SequenceId, number[]> = {
  envelope: [3, 4, 5],
  map: [7, 8, 9],
  dossier: [11, 12, 13, 14, 15, 16],
  briefing: [18, 19]
};

const completedReviewScenes: Record<SequenceId, number> = {
  envelope: 5,
  map: 9,
  dossier: 13,
  briefing: 19
};

const soundPaths: Record<SoundId, string> = {
  caseOpen: "/sounds/case-open.mp3",
  envelopeOpen: "/sounds/envelope-open.mp3",
  paperSlide: "/sounds/paper-slide.mp3",
  mapUnroll: "/sounds/map-unroll.mp3",
  dossierOpen: "/sounds/dossier-open.mp3",
  pageTurn: "/sounds/page-turn.mp3",
  privateBriefingOpen: "/sounds/private-briefing-open.mp3",
  softClick: "/sounds/soft-click.mp3"
};

const steps: Array<{ id: SequenceId; label: string }> = [
  { id: "envelope", label: "Letter" },
  { id: "map", label: "Evidence Map" },
  { id: "dossier", label: "Dossier" },
  { id: "briefing", label: "Private Briefing" }
];

const caseScenes = new Set([2, 6, 10, 17, 20]);

function getCaseScene(completed: CompletedState) {
  if (completed.briefing) return 20;
  if (completed.dossier) return 17;
  if (completed.map) return 10;
  if (completed.envelope) return 6;
  return 2;
}

function getActiveItem(completed: CompletedState): SequenceId | null {
  if (!completed.envelope) return "envelope";
  if (!completed.map) return "map";
  if (!completed.dossier) return "dossier";
  if (!completed.briefing) return "briefing";
  return null;
}

function getLockedMessage(id: SequenceId) {
  if (id === "map") return "Review the personal letter first";
  if (id === "dossier") return "Review the evidence map first";
  if (id === "briefing") return "Complete the dossier first";
  return "Open the personal letter first";
}

function getCasePrompt(id: SequenceId | null) {
  if (id === "envelope") return "Open the personal letter first";
  if (id === "map") return "Review the evidence map";
  if (id === "dossier") return "Open the dossier";
  if (id === "briefing") return "Unlock the private briefing";
  return null;
}

export default function UnboxingScene() {
  const reducedMotion = useReducedMotion();
  const [currentSceneNumber, setCurrentSceneNumber] = useState(1);
  const [completed, setCompleted] = useState<CompletedState>(initialCompleted);
  const [activeSequence, setActiveSequence] = useState<SequenceId | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mapZoomed, setMapZoomed] = useState(false);
  const [tooltip, setTooltip] = useState<{ id: SequenceId; text: string } | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const audioBankRef = useRef<Partial<Record<SoundId, HTMLAudioElement>>>({});
  const soundAvailabilityRef = useRef<Partial<Record<SoundId, boolean>>>({});
  const soundsInitializedRef = useRef(false);

  const activeItem = useMemo(() => getActiveItem(completed), [completed]);
  const currentIndex = activeSequence
    ? sequenceScenes[activeSequence].indexOf(currentSceneNumber)
    : -1;

  const initializeSounds = useCallback(() => {
    soundsInitializedRef.current = true;
  }, []);

  const playSound = useCallback(
    (id: SoundId) => {
      if (!soundEnabled || !soundsInitializedRef.current || typeof Audio === "undefined") return;

      const playAvailableSound = () => {
        let audio = audioBankRef.current[id];
        if (!audio) {
          audio = new Audio(soundPaths[id]);
          audio.preload = "none";
          audio.volume = id === "softClick" ? 0.18 : 0.34;
          audioBankRef.current[id] = audio;
        }
        audio.currentTime = 0;
        audio.play().catch(() => undefined);
      };

      const availability = soundAvailabilityRef.current[id];
      if (availability === true) {
        playAvailableSound();
        return;
      }
      if (availability === false) return;

      fetch(soundPaths[id], { method: "HEAD", cache: "force-cache" })
        .then((response) => {
          soundAvailabilityRef.current[id] = response.ok;
          if (response.ok) playAvailableSound();
        })
        .catch(() => {
          soundAvailabilityRef.current[id] = false;
        });
    },
    [soundEnabled]
  );

  const markCompleted = useCallback((id: SequenceId) => {
    setCompleted((current) => (current[id] ? current : { ...current, [id]: true }));
  }, []);

  useEffect(() => {
    if (currentSceneNumber === 5) markCompleted("envelope");
    if (currentSceneNumber === 9) markCompleted("map");
    if (currentSceneNumber === 16) markCompleted("dossier");
    if (currentSceneNumber === 19) markCompleted("briefing");
  }, [currentSceneNumber, markCompleted]);

  const returnToCase = useCallback(() => {
    setActiveSequence(null);
    setMapZoomed(false);
    setTooltip(null);
    setCurrentSceneNumber(getCaseScene(completed));
    playSound("softClick");
  }, [completed, playSound]);

  const openCase = () => {
    initializeSounds();
    playSound("caseOpen");
    setCurrentSceneNumber(2);
  };

  const openSequence = (id: SequenceId) => {
    const firstScene = completed[id] ? completedReviewScenes[id] : sequenceScenes[id][0];
    setActiveSequence(id);
    setTooltip(null);
    setMapZoomed(false);
    setCurrentSceneNumber(firstScene);
    if (completed[id]) {
      playSound("paperSlide");
    } else {
      if (id === "envelope") playSound("envelopeOpen");
      if (id === "map") playSound("mapUnroll");
      if (id === "dossier") playSound("dossierOpen");
      if (id === "briefing") playSound("privateBriefingOpen");
    }
  };

  const handleHotspot = (id: SequenceId) => {
    if (completed[id] || activeItem === id) {
      openSequence(id);
      return;
    }
    setTooltip({ id, text: getLockedMessage(id) });
    playSound("softClick");
  };

  const goToScene = useCallback(
    (scene: number) => {
      setMapZoomed(false);
      setCurrentSceneNumber(scene);
      if (activeSequence === "dossier" && scene >= 13) {
        playSound("pageTurn");
      } else {
        playSound("paperSlide");
      }
    },
    [activeSequence, playSound]
  );

  const goNext = useCallback(() => {
    if (!activeSequence) return;
    const scenes = sequenceScenes[activeSequence];
    const index = scenes.indexOf(currentSceneNumber);
    if (index >= 0 && index < scenes.length - 1) {
      goToScene(scenes[index + 1]);
    }
  }, [activeSequence, currentSceneNumber, goToScene]);

  const goPrevious = useCallback(() => {
    if (!activeSequence) return;
    if (activeSequence === "dossier" && currentSceneNumber <= 13) return;
    const scenes = sequenceScenes[activeSequence];
    const index = scenes.indexOf(currentSceneNumber);
    if (index > 0) {
      goToScene(scenes[index - 1]);
    }
  }, [activeSequence, currentSceneNumber, goToScene]);

  const finishToCase = useCallback(() => {
    const nextCompleted = { ...completed };
    if (activeSequence) nextCompleted[activeSequence] = true;
    setCompleted(nextCompleted);
    setActiveSequence(null);
    setMapZoomed(false);
    setTooltip(null);
    setCurrentSceneNumber(getCaseScene(nextCompleted));
    playSound("softClick");
  }, [activeSequence, completed, playSound]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && currentSceneNumber !== 1) {
        event.preventDefault();
        returnToCase();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentSceneNumber, goNext, goPrevious, returnToCase]);

  const showHotspots = caseScenes.has(currentSceneNumber) && !activeSequence;
  const imageSrc = assets[currentSceneNumber as keyof typeof assets];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090706] text-raff-paper">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(199,164,87,.18),transparent_28%),radial-gradient(circle_at_50%_92%,rgba(79,43,25,.38),transparent_38%),linear-gradient(180deg,#0f0b09_0%,#050403_100%)]" />

      <button
        type="button"
        className="absolute right-4 top-4 z-30 rounded-full border border-raff-brass/25 bg-black/38 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-raff-paper/80 shadow-brass backdrop-blur-md transition hover:border-raff-brass/55 hover:text-raff-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raff-brass"
        onClick={() => setSoundEnabled((value) => !value)}
        aria-pressed={soundEnabled}
      >
        Sound: {soundEnabled ? "On" : "Off"}
      </button>

      <section
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-3 py-7 sm:px-5 lg:px-8"
        aria-label="Interactive Raff and Raff private case opening"
      >
        <div
          className="relative"
          style={{ width: "min(1448px, 96vw, calc((100vh - 190px) * 1.333333))" }}
        >
          <div className="relative aspect-[1448/1086] overflow-hidden rounded-[8px] border border-raff-brass/18 bg-black shadow-[0_42px_90px_rgba(0,0,0,.58)]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSceneNumber}
                src={imageSrc}
                alt=""
                className={`absolute inset-0 h-full w-full select-none object-contain ${
                  mapZoomed ? "cursor-zoom-out" : ""
                }`}
                draggable={false}
                initial={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 1.018, filter: "blur(8px)" }
                }
                animate={
                  reducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, filter: "blur(0px)" }
                }
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.992, filter: "blur(5px)" }
                }
                transition={{ duration: reducedMotion ? 0.08 : 0.62, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => {
                  if (currentSceneNumber === 9) setMapZoomed((value) => !value);
                }}
              />
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,.38)]" />

            {showHotspots ? (
              <div className="absolute inset-0">
                {(Object.keys(hotspots) as SequenceId[]).map((id) => {
                  const hot = hotspots[id];
                  const isCompleted = completed[id];
                  const isActive = activeItem === id;
                  const isLocked = !isCompleted && !isActive;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`absolute rounded-[6px] outline-none transition ${
                        isLocked ? "cursor-not-allowed" : "cursor-pointer"
                      } ${
                        isActive
                          ? "bg-raff-brass/[.035] shadow-[0_0_0_1px_rgba(199,164,87,.38),0_0_34px_rgba(199,164,87,.32)]"
                          : ""
                      } ${
                        isCompleted
                          ? "hover:bg-raff-brass/[.025] hover:shadow-[0_0_0_1px_rgba(199,164,87,.18),0_0_22px_rgba(199,164,87,.18)]"
                          : ""
                      } focus-visible:ring-2 focus-visible:ring-raff-brass`}
                      style={{
                        left: `${hot.x}%`,
                        top: `${hot.y}%`,
                        width: `${hot.width}%`,
                        height: `${hot.height}%`
                      }}
                      onClick={() => handleHotspot(id)}
                      onMouseEnter={() => {
                        if (isLocked) setTooltip({ id, text: getLockedMessage(id) });
                      }}
                      onMouseLeave={() => {
                        if (tooltip?.id === id) setTooltip(null);
                      }}
                      aria-label={`${isLocked ? "Locked" : isCompleted ? "Review" : "Open"} ${id}`}
                    >
                      {tooltip?.id === id ? (
                        <span className="pointer-events-none absolute left-1/2 top-[-2.6rem] w-max max-w-[220px] -translate-x-1/2 rounded-full border border-raff-brass/25 bg-black/72 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-raff-paper/82 shadow-brass backdrop-blur-md">
                          {tooltip.text}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {showHotspots && getCasePrompt(activeItem) ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-[3.4%] flex justify-center px-4">
                <span className="rounded-full border border-raff-brass/24 bg-black/46 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-raff-paper/78 shadow-brass backdrop-blur-md">
                  {getCasePrompt(activeItem)}
                </span>
              </div>
            ) : null}

            {currentSceneNumber === 1 ? (
              <div className="absolute inset-x-0 bottom-[9%] flex justify-center px-4">
                <button type="button" className="primary-action" onClick={openCase}>
                  Open the private case
                </button>
              </div>
            ) : null}

            {currentSceneNumber === 9 && mapZoomed ? (
              <button
                type="button"
                className="absolute inset-0 z-20 cursor-zoom-out bg-black/72 p-4 backdrop-blur-sm"
                onClick={() => setMapZoomed(false)}
                aria-label="Close enlarged evidence map"
              >
                <img
                  src={assets[9]}
                  alt=""
                  className="mx-auto h-full w-full object-contain shadow-[0_32px_80px_rgba(0,0,0,.65)]"
                  draggable={false}
                />
              </button>
            ) : null}

            {videoOpen ? (
              <div
                className="absolute inset-0 z-30 grid place-items-center bg-black/72 p-4 backdrop-blur-md"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) setVideoOpen(false);
                }}
              >
                <div className="w-[min(860px,92vw)] overflow-hidden rounded-[8px] border border-raff-brass/35 bg-[#0b0908] shadow-[0_38px_90px_rgba(0,0,0,.65)]">
                  <div className="flex items-center justify-between border-b border-raff-brass/20 px-5 py-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-raff-brass">
                        Private Walkthrough
                      </p>
                      <h2 className="mt-1 font-serif text-2xl text-raff-paper">
                        Raff & Raff x SaveCases
                      </h2>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-raff-brass/35 px-3 py-1 text-raff-paper/80 transition hover:bg-raff-brass/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raff-brass"
                      onClick={() => setVideoOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div className="grid aspect-video place-items-center bg-black text-center">
                    <button
                      type="button"
                      className="primary-action"
                      onClick={() => playSound("softClick")}
                    >
                      Watch the private walkthrough
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <SceneControls
          activeSequence={activeSequence}
          currentSceneNumber={currentSceneNumber}
          currentIndex={currentIndex}
          completed={completed}
          mapZoomed={mapZoomed}
          goNext={goNext}
          goPrevious={goPrevious}
          returnToCase={returnToCase}
          finishToCase={finishToCase}
          setMapZoomed={setMapZoomed}
          setVideoOpen={setVideoOpen}
          playSound={playSound}
        />

        {currentSceneNumber !== 1 ? (
          <ProgressStrip completed={completed} activeItem={activeItem} />
        ) : null}
      </section>
    </main>
  );
}

function SceneControls({
  activeSequence,
  currentSceneNumber,
  currentIndex,
  completed,
  mapZoomed,
  goNext,
  goPrevious,
  returnToCase,
  finishToCase,
  setMapZoomed,
  setVideoOpen,
  playSound
}: {
  activeSequence: SequenceId | null;
  currentSceneNumber: number;
  currentIndex: number;
  completed: CompletedState;
  mapZoomed: boolean;
  goNext: () => void;
  goPrevious: () => void;
  returnToCase: () => void;
  finishToCase: () => void;
  setMapZoomed: (value: boolean) => void;
  setVideoOpen: (value: boolean) => void;
  playSound: (id: SoundId) => void;
}) {
  if (!activeSequence && currentSceneNumber !== 20) return null;

  const finalSequenceScene =
    activeSequence && currentSceneNumber === sequenceScenes[activeSequence].at(-1);
  const isDossierSpread = activeSequence === "dossier" && currentSceneNumber >= 13;
  const canFinishDossier = completed.dossier || currentSceneNumber === 16;
  const allReviewed = Object.values(completed).every(Boolean);

  return (
    <div className="relative z-20 mt-4 flex min-h-[46px] flex-wrap items-center justify-center gap-3 px-2">
      {activeSequence && !finalSequenceScene && !isDossierSpread ? (
        <button type="button" className="primary-action" onClick={goNext}>
          Continue
        </button>
      ) : null}

      {activeSequence === "envelope" && currentSceneNumber === 5 ? (
        <>
          <button type="button" className="secondary-action" onClick={returnToCase}>
            Return to case
          </button>
          <button type="button" className="primary-action" onClick={finishToCase}>
            Continue to evidence map
          </button>
        </>
      ) : null}

      {activeSequence === "map" && currentSceneNumber === 9 ? (
        <>
          <button
            type="button"
            className="secondary-action"
            onClick={() => {
              setMapZoomed(!mapZoomed);
              playSound("softClick");
            }}
          >
            {mapZoomed ? "Close larger view" : "View larger"}
          </button>
          <button type="button" className="secondary-action" onClick={returnToCase}>
            Return to case
          </button>
          <button type="button" className="primary-action" onClick={finishToCase}>
            Continue to dossier
          </button>
        </>
      ) : null}

      {activeSequence === "dossier" && isDossierSpread ? (
        <>
          <button
            type="button"
            className="secondary-action"
            onClick={goPrevious}
            disabled={currentSceneNumber <= 13}
          >
            Previous page
          </button>
          {currentSceneNumber < 16 ? (
            <button type="button" className="primary-action" onClick={goNext}>
              Next page
            </button>
          ) : (
            <>
              <button type="button" className="secondary-action" onClick={returnToCase}>
                Return to case
              </button>
              <button type="button" className="primary-action" onClick={finishToCase}>
                Continue to private briefing
              </button>
            </>
          )}
          <button
            type="button"
            className="secondary-action"
            onClick={finishToCase}
            disabled={!canFinishDossier}
          >
            Finish dossier
          </button>
        </>
      ) : null}

      {activeSequence === "briefing" && currentSceneNumber === 19 ? (
        <>
          <button
            type="button"
            className="primary-action"
            onClick={() => {
              setVideoOpen(true);
              playSound("softClick");
            }}
          >
            Watch the private walkthrough
          </button>
          <button type="button" className="secondary-action" onClick={finishToCase}>
            Return to case
          </button>
        </>
      ) : null}

      {!activeSequence && currentSceneNumber === 20 && allReviewed ? (
        <>
          <span className="rounded-full border border-raff-brass/20 bg-black/36 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-raff-brass/90 backdrop-blur-md">
            All materials reviewed
          </span>
          <button
            type="button"
            className="primary-action"
            onClick={() => {
              setVideoOpen(true);
              playSound("softClick");
            }}
          >
            Watch the private walkthrough
          </button>
        </>
      ) : null}
    </div>
  );
}

function ProgressStrip({
  completed,
  activeItem
}: {
  completed: CompletedState;
  activeItem: SequenceId | null;
}) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-20 w-[min(760px,94vw)] -translate-x-1/2 rounded-full border border-raff-brass/18 bg-black/48 px-3 py-2 shadow-brass backdrop-blur-md">
      <div className="grid grid-cols-4 gap-1">
        {steps.map((step) => {
          const isCompleted = completed[step.id];
          const isActive = activeItem === step.id;
          return (
            <div
              key={step.id}
              className={`flex min-h-[32px] items-center justify-center rounded-full px-2 text-center font-mono text-[10px] uppercase tracking-[0.13em] transition sm:text-[11px] ${
                isCompleted
                  ? "text-raff-brass"
                  : isActive
                    ? "bg-raff-brass/12 text-raff-paper"
                    : "text-raff-paper/42"
              }`}
            >
              <span className="truncate">
                {isCompleted ? "✓ " : ""}
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
