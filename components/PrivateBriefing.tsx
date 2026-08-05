"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { RecipientBriefing } from "@/lib/recipients";

const chapters = [
  { id: "access", label: "Private Access" },
  { id: "invisible-case", label: "The Invisible Case" },
  { id: "after-hours", label: "The After-Hours Window" },
  { id: "briefing", label: "The Briefing" },
  { id: "test", label: "The Test" }
] as const;

type AnalyticsEvent =
  | "briefing_opened"
  | "case_sequence_completed"
  | "evidence_reached"
  | "video_started"
  | "video_25"
  | "video_50"
  | "video_75"
  | "video_90"
  | "cta_viewed"
  | "cta_selected"
  | "return_visit";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function track(event: AnalyticsEvent, slug: string, detail: Record<string, unknown> = {}) {
  const payload = { event, briefing_slug: slug, ...detail };
  window.dataLayer?.push(payload);
  window.dispatchEvent(new CustomEvent("savecases:analytics", { detail: payload }));
}

export default function PrivateBriefing({ briefing }: { briefing: RecipientBriefing }) {
  const reducedMotion = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeChapter, setActiveChapter] = useState("access");
  const [videoRevealed, setVideoRevealed] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [resumeChapter, setResumeChapter] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoMilestones = useRef(new Set<number>());
  const trackedSections = useRef(new Set<string>());

  const playSound = useCallback(
    (src: string) => {
      if (!soundEnabled) return;
      audioRef.current?.pause();
      const audio = new Audio(src);
      audio.volume = 0.22;
      audioRef.current = audio;
      audio.play().catch(() => undefined);
    },
    [soundEnabled]
  );

  useEffect(() => {
    const visited = window.localStorage.getItem(`savecases:${briefing.slug}:opened`);
    if (visited) track("return_visit", briefing.slug);
    const savedChapter = window.localStorage.getItem(`savecases:${briefing.slug}:chapter`);
    if (savedChapter && savedChapter !== "access") setResumeChapter(savedChapter);

    const observers = chapters.map(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveChapter(id);
            window.localStorage.setItem(`savecases:${briefing.slug}:chapter`, id);
            if (!trackedSections.current.has(id)) {
              trackedSections.current.add(id);
              if (id === "after-hours") track("evidence_reached", briefing.slug);
              if (id === "test") track("cta_viewed", briefing.slug);
            }
          }
        },
        { rootMargin: "-42% 0px -50% 0px" }
      );
      observer.observe(element);
      return observer;
    });

    return () => observers.forEach((observer) => observer?.disconnect());
  }, [briefing.slug]);

  const openCase = () => {
    setOpened(true);
    window.localStorage.setItem(`savecases:${briefing.slug}:opened`, "true");
    track("briefing_opened", briefing.slug, {
      device: window.matchMedia("(max-width: 720px)").matches ? "mobile" : "desktop"
    });
    playSound("/sounds/case-open.mp3");
    window.setTimeout(
      () => document.getElementById("case-opening")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }),
      reducedMotion ? 0 : 280
    );
  };

  const revealVideo = () => {
    setVideoRevealed(true);
    playSound("/sounds/private-briefing-open.mp3");
    window.setTimeout(() => videoRef.current?.focus(), 120);
  };

  const resumeBriefing = () => {
    setOpened(true);
    window.setTimeout(
      () => document.getElementById(resumeChapter ?? "invisible-case")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }),
      reducedMotion ? 0 : 180
    );
  };

  const onVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const percentage = (video.currentTime / video.duration) * 100;
    ([25, 50, 75, 90] as const).forEach((milestone) => {
      if (percentage >= milestone && !videoMilestones.current.has(milestone)) {
        videoMilestones.current.add(milestone);
        track(`video_${milestone}` as AnalyticsEvent, briefing.slug);
      }
    });
  };

  return (
    <main className={`briefing-site ${opened ? "is-open" : ""}`}>
      <a className="skip-link" href="#invisible-case">Skip to the briefing</a>

      <section id="access" className="arrival" aria-labelledby="arrival-title">
        <div className="arrival-grain" />
        <motion.div
          className="arrival-inner"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
        >
          <p className="kicker brass">Private briefing</p>
          <div className="hairline" />
          <p className="prepared">Prepared for</p>
          <h1 id="arrival-title">{briefing.recipientName}</h1>
          <p className="firm-name">{briefing.firmName}</p>
          <dl className="arrival-meta">
            <div><dt>Briefing</dt><dd>{briefing.briefingNumber ?? "Recipient file"}</dd></div>
            <div><dt>Prepared</dt><dd>{briefing.letterDate ?? "For private review"}</dd></div>
            <div><dt>Office</dt><dd>{briefing.officeLocation ?? "Selected office"}</dd></div>
          </dl>
          <button className="seal-button" type="button" onClick={openCase}>
            <span className="seal-mark" aria-hidden="true">SC</span>
            <span>Open the case</span>
          </button>
          {resumeChapter ? <button className="resume-button" type="button" onClick={resumeBriefing}>Resume previous chapter</button> : null}
          <p className="access-note">Recipient-specific access · Not intended for public distribution</p>
        </motion.div>
      </section>

      <AnimatePresence>
        {opened ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
            <ProgressNav activeChapter={activeChapter} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />

            <section id="case-opening" className="case-opening scene-dark" aria-labelledby="case-opening-title">
              <div className="case-plate" aria-hidden="true">
                <Image src="/briefing-assets/scene-2.jpg" alt="" fill priority sizes="100vw" />
              </div>
              <motion.div
                className="case-ident"
                initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: 0.8 }}
              >
                {briefing.logoUrl ? (
                  <img className="recipient-logo" src={briefing.logoUrl} alt={`${briefing.firmName} logo`} />
                ) : (
                  <p className="recipient-wordmark">{briefing.firmShortName ?? briefing.firmName}</p>
                )}
                <p className="kicker brass">Case file · {briefing.briefingNumber ?? "Private review"}</p>
                <h2 id="case-opening-title">Prepared for {briefing.firmShortName ?? briefing.firmName}</h2>
                <p>{briefing.recipientName}{briefing.recipientTitle ? ` · ${briefing.recipientTitle}` : ""}</p>
              </motion.div>
              <a className="scroll-cue" href="#letter">Continue to the letter <span>↓</span></a>
            </section>

            <section id="letter" className="paper-field" aria-labelledby="letter-title">
              <motion.article
                className="letter-sheet"
                initial={reducedMotion ? false : { opacity: 0, y: 60, rotate: -0.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9 }}
                onViewportEnter={() => track("case_sequence_completed", briefing.slug)}
              >
                <header className="letter-head">
                  <span>SaveCases</span><span>{briefing.briefingNumber ?? "Private file"}</span>
                </header>
                <p className="kicker oxblood">A continuation of the letter</p>
                <h2 id="letter-title">{briefing.recipientName.split(" ")[0]},</h2>
                <div className="letter-copy">
                  <p>{briefing.openingObservation ?? `${briefing.firmName} has built the kind of trust injured people look for when the next step matters.`}</p>
                  <p>This briefing concerns a narrower moment: what happens when someone reaches for that trust after the office has closed.</p>
                  <p>The problem is not simply whether the telephone is answered. It is whether the caller receives a credible next step before continuing the search.</p>
                  <p>The material below was prepared to make that invisible window visible.</p>
                </div>
                {briefing.secondaryObservation ? (
                  <aside className="margin-note">
                    <span>Observation 01</span>
                    <p>{briefing.secondaryObservation}</p>
                  </aside>
                ) : null}
                {briefing.practiceAreas?.length ? (
                  <div className="practice-line" aria-label="Practice areas">
                    {briefing.practiceAreas.map((area) => <span key={area}>{area}</span>)}
                  </div>
                ) : null}
                <footer className="letter-signoff"><span>Respectfully,</span><strong>Dario · SaveCases</strong></footer>
              </motion.article>
            </section>

            <section id="invisible-case" className="timeline-section scene-dark" aria-labelledby="invisible-title">
              <div className="section-shell">
                <header className="section-intro">
                  <p className="kicker brass">An illustrative after-hours inquiry</p>
                  <h2 id="invisible-title">The invisible case.</h2>
                  <p>A common pattern—not a claim about a specific call to {briefing.firmShortName ?? briefing.firmName}.</p>
                </header>
                <div className="caller-timeline">
                  {[
                    ["8:47 PM", "Caller reaches the firm", "A potential client calls after a serious collision."],
                    ["8:49 PM", "A message is recorded", "The interaction is captured, but no intake path begins."],
                    ["8:53 PM", "The search resumes", "Uncertainty remains, so the caller keeps looking."],
                    ["8:57 PM", "Another firm answers", "The caller reaches someone prepared to advance the inquiry."],
                    ["9:06 PM", "A consultation is scheduled", "The opportunity may disappear before morning."]
                  ].map(([time, title, copy], index) => (
                    <motion.article
                      className="timeline-event"
                      key={time}
                      initial={reducedMotion ? false : { opacity: 0, x: -24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.65 }}
                      transition={{ delay: index * 0.08, duration: 0.55 }}
                    >
                      <time>{time}</time><div><h3>{title}</h3><p>{copy}</p></div>
                    </motion.article>
                  ))}
                </div>
                <blockquote>The firm may never know the call was commercially meaningful.</blockquote>
              </div>
            </section>

            <section id="after-hours" className="evidence-section" aria-labelledby="evidence-title">
              <div className="evidence-art" aria-hidden="true">
                <Image src="/briefing-assets/scene-8.jpg" alt="" fill sizes="(max-width: 800px) 100vw, 50vw" />
              </div>
              <div className="evidence-copy">
                <p className="kicker oxblood">Evidence board · Decision point</p>
                <h2 id="evidence-title">The issue begins after the greeting.</h2>
                <p className="lead">Courtesy matters. Continuity determines whether the caller reaches a next step.</p>
                <div className="decision-flow" role="list" aria-label="After-hours call progression">
                  {["Injury occurs", "Caller searches", "Firm is reached", "Message is captured", "Search continues", "Consultation happens elsewhere"].map((label, index) => (
                    <div role="listitem" key={label}><span>{String(index + 1).padStart(2, "0")}</span><p>{label}</p></div>
                  ))}
                </div>
                {briefing.afterHoursObservation ? (
                  <aside className="research-note">
                    <span>Optional research note · {briefing.afterHoursObservation.callTime ?? "After hours"}</span>
                    <p>{briefing.afterHoursObservation.summary ?? "The interaction was captured professionally; the review concerns the intake structure that follows."}</p>
                    {briefing.statedOfficeHours ? <small>Publicly stated hours: {briefing.statedOfficeHours}</small> : null}
                  </aside>
                ) : null}
                <p className="pull-quote">The call being answered is not the same as the opportunity being advanced.</p>
              </div>
            </section>

            <section className="comparison-section" aria-labelledby="comparison-title">
              <div className="section-shell">
                <header className="section-intro dark-copy">
                  <p className="kicker oxblood">Two caller journeys</p>
                  <h2 id="comparison-title">The difference is a next step.</h2>
                </header>
                <div className="journey-compare">
                  <Journey title="Without dedicated intake" tone="muted" steps={["Incoming call", "Message or voicemail", "Delayed follow-up", "Caller uncertainty", "Continued search", "Unknown outcome"]} />
                  <Journey title="With SaveCases" tone="resolved" steps={["Incoming call", "Answered in the firm’s name", "Relevant facts gathered", "Urgency assessed", "Consultation scheduled", "Structured summary delivered"]} />
                </div>
              </div>
            </section>

            <section className="service-section scene-dark" aria-labelledby="service-title">
              <div className="section-shell service-grid">
                <div>
                  <p className="kicker brass">What SaveCases does</p>
                  <h2 id="service-title">Built for the window before attorney involvement.</h2>
                  <p className="lead">SaveCases provides after-hours intake coverage for personal-injury law firms. It advances the information—not legal judgment.</p>
                </div>
                <div className="service-ledger">
                  {[
                    ["Answer", "In the firm’s name, with a consistent approved greeting."],
                    ["Identify", "New potential clients are separated from existing clients, vendors, insurers, spam, and unrelated matters."],
                    ["Gather", "Incident, injury, treatment, timing, and contact facts are captured against firm-approved criteria."],
                    ["Advance", "Urgent calls are escalated and appropriate consultations are scheduled according to protocol."],
                    ["Report", "The firm receives an organized summary and status—not a bare voicemail."]
                  ].map(([label, copy]) => <article key={label}><h3>{label}</h3><p>{copy}</p></article>)}
                </div>
                <p className="legal-note">SaveCases does not provide legal advice, replace an attorney’s judgment, or assume that every caller is a viable case.</p>
              </div>
            </section>

            <section className="operations-section" aria-labelledby="operations-title">
              <div className="section-shell">
                <header className="section-intro dark-copy">
                  <p className="kicker oxblood">Operating protocol</p>
                  <h2 id="operations-title">From coverage to morning handoff.</h2>
                </header>
                <ol className="operations-line">
                  {[
                    ["5:00 PM", "Coverage begins", "The approved after-hours protocol becomes active."],
                    ["Incoming", "Answered live", "The caller is greeted in the firm’s name."],
                    ["Intake", "Facts gathered", "Relevant details are captured using approved criteria."],
                    ["Urgency", "Protocol applied", "Designated circumstances are escalated."],
                    ["Next step", "Consultation offered", "Qualified callers receive an appropriate path forward."],
                    ["Morning", "Context delivered", "The team begins with a structured summary and status."]
                  ].map(([time, title, copy]) => <li key={title}><time>{time}</time><h3>{title}</h3><p>{copy}</p></li>)}
                </ol>
              </div>
            </section>

            <section id="briefing" className="video-section scene-dark" aria-labelledby="video-title">
              <div className="video-ambient" aria-hidden="true"><Image src="/briefing-assets/scene-18.jpg" alt="" fill sizes="100vw" /></div>
              <div className="section-shell video-shell">
                <AnimatePresence mode="wait">
                  {!videoRevealed ? (
                    <motion.div className="briefing-card" key="card" exit={{ opacity: 0, y: -24 }}>
                      <p className="kicker oxblood">Private briefing</p>
                      <h2 id="video-title">Why the window exists—and how SaveCases is designed to address it.</h2>
                      <p>A direct explanation from the founder, prepared for selected personal-injury firms.</p>
                      <button className="ink-button" type="button" onClick={revealVideo}><span>▶</span> Watch the private briefing</button>
                      <small>6 minutes 48 seconds · Captions available</small>
                    </motion.div>
                  ) : (
                    <motion.div className="integrated-video" key="video" initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }}>
                      <div className="video-label"><span>Private briefing</span><span>{briefing.firmShortName ?? briefing.firmName} × SaveCases</span></div>
                      <video
                        ref={videoRef}
                        controls
                        playsInline
                        preload="metadata"
                        poster={briefing.videoPosterUrl}
                        onPlay={() => track("video_started", briefing.slug)}
                        onTimeUpdate={onVideoTimeUpdate}
                        aria-label={`SaveCases private briefing for ${briefing.firmName}`}
                        tabIndex={-1}
                      >
                        <source src={briefing.videoUrl} type="video/mp4" />
                        {briefing.captionsUrl ? <track kind="captions" src={briefing.captionsUrl} srcLang="en" label="English" /> : null}
                        Your browser does not support HTML video.
                      </video>
                      <button className="transcript-toggle" type="button" onClick={() => setTranscriptOpen((value) => !value)} aria-expanded={transcriptOpen}>
                        {transcriptOpen ? "Close transcript" : "Read transcript"}
                      </button>
                      {transcriptOpen ? <Transcript /> : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <section id="test" className="test-section" aria-labelledby="test-title">
              <div className="section-shell test-grid">
                <div>
                  <p className="kicker oxblood">A controlled next step</p>
                  <h2 id="test-title">The thirty-day missed-opportunity test.</h2>
                  <p className="lead">Observe what kinds of inquiries occur, how callers respond to immediate intake, and what opportunities may otherwise remain invisible.</p>
                </div>
                <ul className="test-terms">
                  <li>Defined after-hours coverage period</li>
                  <li>Firm-approved intake criteria</li>
                  <li>Controlled escalation rules</li>
                  <li>Consultation scheduling</li>
                  <li>Structured reporting</li>
                  <li>No assumption that every call is viable</li>
                </ul>
                <aside id="private-conversation" className="private-cta">
                  <p>This is a conversation, not a conventional sales funnel.</p>
                  <a href={briefing.ctaUrl} onClick={() => track("cta_selected", briefing.slug)}>{briefing.ctaLabel}<span aria-hidden="true">↗</span></a>
                  <small>Or reply directly to the letter or email that brought you here.</small>
                </aside>
              </div>
              <footer className="site-footer"><span>SaveCases</span><span>{briefing.briefingNumber ?? "Private briefing"} · Prepared for {briefing.recipientName}</span></footer>
            </section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function ProgressNav({ activeChapter, soundEnabled, setSoundEnabled }: { activeChapter: string; soundEnabled: boolean; setSoundEnabled: (value: boolean) => void }) {
  return (
    <nav className="progress-nav" aria-label="Briefing chapters">
      <a className="progress-brand" href="#access" aria-label="Return to private access">SC</a>
      <div className="progress-chapters">
        {chapters.map((chapter, index) => (
          <a key={chapter.id} href={`#${chapter.id}`} className={activeChapter === chapter.id ? "active" : ""}>
            <span>{String(index + 1).padStart(2, "0")}</span><em>{chapter.label}</em>
          </a>
        ))}
      </div>
      <a className="skip-briefing" href="#briefing">Skip to video</a>
      <button type="button" onClick={() => setSoundEnabled(!soundEnabled)} aria-pressed={soundEnabled}>{soundEnabled ? "Sound on" : "Sound off"}</button>
    </nav>
  );
}

function Journey({ title, tone, steps }: { title: string; tone: "muted" | "resolved"; steps: string[] }) {
  return (
    <article className={`journey ${tone}`}>
      <header><span>{tone === "resolved" ? "Covered" : "Current path"}</span><h3>{title}</h3></header>
      <ol>{steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
    </article>
  );
}

function Transcript() {
  return (
    <div className="transcript" tabIndex={0}>
      <h3>Private briefing transcript</h3>
      <p>You opened the file. You watched a case walk into a law firm at 8:47 at night and walk right back out. I’m Dario. I built SaveCases. And this briefing is about the quieter version of that story: the phone may never even ring.</p>
      <p>It’s 8:47 on a Tuesday night. A man is sitting in an emergency room hallway with a fractured wrist, a neck brace, and a phone at nineteen percent battery. The crash was four hours ago. He doesn’t have a lawyer, and he isn’t waiting until morning to find one. He types “car accident lawyer near me” and starts reading.</p>
      <p>Your firm might be sitting right there on that list. Better results. Better reviews. Years in the county. But at 8:47, the listing says closed. Two results down, a younger firm looks reachable. He calls them. A voice answers, takes the story, and books him for the morning.</p>
      <p>There may be no missed call, no voicemail, and no trace. There is no record anywhere that an opportunity disappeared. The better lawyer did not necessarily win. The reachable lawyer got the first conversation. That is the physics of after hours.</p>
      <p>You cannot audit this loss, and that is exactly what makes it expensive. There is no line item for cases that never called. It only takes one meaningful matter for the after-hours window to justify serious attention. The real count remains invisible.</p>
      <p>Here is what SaveCases is. It is after-hours intake designed for one job: advancing injury inquiries while the office is dark. A call comes in. The caller is answered and a structured intake begins—what happened, when, the injuries, treatment, insurance details, the other party, and the timeline.</p>
      <p>The caller is taken seriously at the exact moment other paths are asking them to try again tomorrow. The firm receives the captured facts, organized and ready for review. Designated situations can follow the firm’s approved escalation protocol.</p>
      <p>You should test the experience for yourself. Use a difficult fact pattern. Interrupt it. Change details. See how the intake responds. The purpose of a controlled test is to observe the after-hours pattern on your own line, with your own callers and criteria.</p>
      <p>Every call is answered, each intake is documented, and your team can review the results. Spam, wrong numbers, vendors, and unrelated calls are separated out. The goal is not to replace legal judgment. It is to make sure a credible opportunity does not vanish before that judgment can occur.</p>
      <p>When coverage is active, the firm no longer disappears at the end of the business day. The after-hours caller has a real next step. Below this video is a button to open a private conversation about the test and whether it fits the firm.</p>
    </div>
  );
}
