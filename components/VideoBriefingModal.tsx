"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

type VideoBriefingModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function VideoBriefingModal({ open, onClose }: VideoBriefingModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!open || !videoRef.current || !canvasRef.current) return;
    let frame = 0;
    let cancelled = false;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const play = () => {
      video.play().catch(() => undefined);
    };

    const startFallback = () => {
      if (!canvas.captureStream) return;
      const started = performance.now();
      const rows = [
        ["7:42 PM", "Rear-end collision", "Answered live"],
        ["9:18 PM", "Slip and fall", "Qualified"],
        ["11:06 PM", "Rideshare injury", "Routed"],
        ["2:03 AM", "Pedestrian injury", "Summary sent"]
      ];

      const draw = () => {
        if (cancelled) return;
        const t = (performance.now() - started) / 1000;
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#17130f";
        ctx.fillRect(0, 0, w, h);

        const glow = ctx.createRadialGradient(w * 0.72, h * 0.16, 40, w * 0.72, h * 0.16, 720);
        glow.addColorStop(0, "rgba(199,164,87,.28)");
        glow.addColorStop(0.62, "rgba(199,164,87,.08)");
        glow.addColorStop(1, "rgba(199,164,87,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "rgba(199,164,87,.13)";
        ctx.lineWidth = 1;
        for (let x = -120 + ((t * 18) % 120); x < w + 120; x += 120) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x + 280, h);
          ctx.stroke();
        }

        ctx.fillStyle = "rgba(247,239,217,.08)";
        ctx.fillRect(72, 98, 472, 420);
        ctx.strokeStyle = "rgba(199,164,87,.25)";
        ctx.strokeRect(72, 98, 472, 420);

        ctx.fillStyle = "#f7efd9";
        ctx.font = "600 44px Georgia, serif";
        ctx.fillText("Raff & Raff", 112, 174);
        ctx.fillStyle = "#c7a457";
        ctx.font = "24px Arial, sans-serif";
        ctx.fillText("Private SaveCases briefing", 112, 218);

        ctx.fillStyle = "#c7a457";
        ctx.fillRect(112, 270, 280 + Math.sin(t * 1.4) * 28, 8);
        ctx.fillStyle = "rgba(247,239,217,.20)";
        ctx.fillRect(112, 306, 356, 8);
        ctx.fillRect(112, 340, 296, 8);

        ctx.fillStyle = "rgba(47,85,64,.78)";
        ctx.beginPath();
        ctx.arc(112, 430, 12 + Math.sin(t * 2.1) * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#d7cbb3";
        ctx.font = "22px Arial, sans-serif";
        ctx.fillText("After-hours intake line open", 142, 438);

        ctx.fillStyle = "rgba(247,239,217,.10)";
        ctx.fillRect(622, 116, 520, 366);
        ctx.strokeStyle = "rgba(199,164,87,.28)";
        ctx.strokeRect(622, 116, 520, 366);
        ctx.fillStyle = "#c7a457";
        ctx.font = "600 20px Arial, sans-serif";
        ctx.fillText("LIVE CALL FLOW", 658, 170);
        ctx.font = "22px Arial, sans-serif";
        rows.forEach((row, i) => {
          const y = 224 + i * 62;
          const active = Math.floor(t / 2) % rows.length === i;
          ctx.fillStyle = active ? "rgba(47,85,64,.30)" : "rgba(247,239,217,.06)";
          ctx.fillRect(656, y - 34, 448, 48);
          ctx.fillStyle = "#d7cbb3";
          ctx.fillText(row[0], 676, y);
          ctx.fillStyle = "#f7efd9";
          ctx.fillText(row[1], 806, y);
          ctx.fillStyle = active ? "#c7a457" : "#9db39c";
          ctx.fillText(row[2], 982, y);
        });

        ctx.fillStyle = "rgba(199,164,87,.24)";
        ctx.fillRect(0, h - 14, w, 14);
        ctx.fillStyle = "#c7a457";
        ctx.fillRect(0, h - 14, w * ((t % 12) / 12), 14);
        frame = requestAnimationFrame(draw);
      };

      draw();
      video.srcObject = canvas.captureStream(30);
      video.muted = true;
      play();
    };

    startFallback();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      video.pause();
      video.removeAttribute("src");
      video.srcObject = null;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/72 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            className="w-[min(1080px,94vw)] overflow-hidden rounded-[10px] border border-raff-brass/35 bg-raff-ink shadow-artifact"
            initial={{ y: 18, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 18, scale: 0.96 }}
          >
            <div className="flex items-center justify-between border-b border-raff-brass/20 px-5 py-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-raff-brass">
                  Private VSL
                </p>
                <h2 className="mt-1 font-serif text-2xl text-raff-paper">Raff & Raff x SaveCases</h2>
              </div>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-raff-brass/35 text-raff-paper transition hover:bg-raff-brass/15 focus-visible:ring-2 focus-visible:ring-raff-brass"
                onClick={onClose}
                aria-label="Close video briefing"
              >
                x
              </button>
            </div>
            <video
              ref={videoRef}
              className="aspect-video w-full bg-black"
              controls
              playsInline
              loop
              poster="/raff/vsl-poster.svg"
              aria-label="Private Raff and Raff SaveCases video briefing"
            />
            <canvas ref={canvasRef} width={1280} height={720} className="hidden" aria-hidden="true" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
