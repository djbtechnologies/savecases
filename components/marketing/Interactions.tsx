"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { Arrow } from "./Icons";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return <div className="sc-mobile-menu" onKeyDown={event => {
    if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
  }}>
    <button ref={trigger} type="button" className="sc-menu-trigger" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}<span aria-hidden="true">{open ? "×" : "+"}</span></button>
    {open && <nav id="mobile-navigation" aria-label="Mobile navigation" onClick={() => setOpen(false)}>
      <a href="#demo">The demo</a><a href="#how-it-works">How it works</a><a href="#trial">Your free 30 days</a><a href="#questions">Questions</a>
    </nav>}
  </div>;
}
export function RequestLink({ children, intent = "demo", className = "sc-button" }: { children: React.ReactNode; intent?: "demo" | "trial"; className?: string }) {
  return <a className={className} href="#inquiry" onClick={() => {
    window.dispatchEvent(new CustomEvent("savecases:inquiry", { detail: intent }));
  }}>{children}<Arrow /></a>;
}
export function ConfiguredMedia({ kind }: { kind: "founder" | "sample" }) {
  const [failed, setFailed] = useState(false);
  const src = kind === "founder" ? siteConfig.media.founderVideo : siteConfig.media.sampleCallAudio;
  if (failed) return <p className="sc-media-error" role="status">This recording couldn’t load. <a href="#inquiry">Request a walkthrough with Dario.</a></p>;
  if (kind === "founder") return <video controls playsInline preload="none" poster={siteConfig.media.founderPoster || undefined} onError={() => setFailed(true)} aria-label="A SaveCases introduction from Dario" src={src}>
    {siteConfig.media.founderCaptions && <track kind="captions" src={siteConfig.media.founderCaptions} srcLang="en" label="English" default />}
  </video>;
  return <audio controls preload="none" src={src} onError={() => setFailed(true)} aria-label="Synthetic sample intake call" />;
}
export function InquiryForm() {
  const [ready, setReady] = useState(false);
  const [intent, setIntent] = useState<"demo" | "trial">("demo");
  const [status, setStatus] = useState<"idle" | "sending" | "accepted" | "prepared" | "error">("idle");
  const [draft, setDraft] = useState({ body: "", subject: "" });
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setReady(true);
    const select = (event: Event) => {
      const value = (event as CustomEvent).detail;
      if (value === "demo" || value === "trial") { setIntent(value); setStatus("idle"); }
    };
    window.addEventListener("savecases:inquiry", select);
    return () => window.removeEventListener("savecases:inquiry", select);
  }, []);
  useEffect(() => { if (["prepared", "accepted", "error"].includes(status)) feedback.current?.focus(); }, [status]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    if (data.get("website")) return;
    const payload = {
      intent,
      name: String(data.get("name") || "").trim(),
      firm: String(data.get("firm") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      coverage: String(data.get("coverage") || "").trim(),
    };
    if (!payload.name || !payload.firm || !payload.email) { setStatus("error"); return; }
    const subject = intent === "trial" ? "SaveCases — request for a free 30-day trial" : "SaveCases — intake demo request";
    const body = `Hi Dario,\n\n${intent === "trial" ? "I’d like to discuss the free 30-day trial for my firm." : "I’d like to try the SaveCases intake demo."}\n\nName: ${payload.name}\nFirm: ${payload.firm}\nWork email: ${payload.email}\nPhone: ${payload.phone || "Not provided"}\nCurrent after-hours coverage: ${payload.coverage || "Not provided"}\n`;
    setDraft({ subject, body }); setCopied(false); setCopyFailed(false);
    if (!siteConfig.inquiry.endpoint) { setStatus("prepared"); return; }
    setStatus("sending");
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(siteConfig.inquiry.endpoint, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload), signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.accepted !== true) throw new Error("Request not accepted");
      setStatus("accepted");
    } catch { setStatus("error"); }
    finally { window.clearTimeout(timer); }
  }
  const emailHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
  return <form className="sc-form" method="post" onSubmit={submit} onChange={() => { if (status !== "sending") setStatus("idle"); }} aria-label="Request an intake demo or free trial">
    <fieldset className="sc-intent" disabled={status === "sending"}>
      <legend>I’d like to</legend>
      <label><input type="radio" name="intent" value="demo" checked={intent === "demo"} onChange={() => setIntent("demo")} /><span>Try the intake demo</span></label>
      <label><input type="radio" name="intent" value="trial" checked={intent === "trial"} onChange={() => setIntent("trial")} /><span>Request my free 30 days</span></label>
    </fieldset>
    <fieldset className="sc-fields" disabled={status === "sending"}>
      <legend className="sc-sr-only">Your contact information</legend>
      <div><label htmlFor="inquiry-name">Your name</label><input id="inquiry-name" name="name" autoComplete="name" required maxLength={100} placeholder="Full name" /></div>
      <div><label htmlFor="inquiry-firm">Law firm</label><input id="inquiry-firm" name="firm" autoComplete="organization" required maxLength={150} placeholder="Firm name" /></div>
      <div><label htmlFor="inquiry-email">Work email</label><input id="inquiry-email" name="email" type="email" autoComplete="email" required maxLength={200} placeholder="you@yourfirm.com" /></div>
      <div><label htmlFor="inquiry-phone">Phone <span>(optional)</span></label><input id="inquiry-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="Your number" /></div>
      <div className="sc-field-wide"><label htmlFor="inquiry-coverage">Who answers your after-hours calls? <span>(optional)</span></label><select id="inquiry-coverage" name="coverage" defaultValue=""><option value="">Select your current setup</option><option>Voicemail</option><option>An answering service</option><option>Someone at our firm</option><option>A mix / I’m not sure</option></select></div>
      <div className="sc-honeypot" aria-hidden="true"><label htmlFor="inquiry-website">Leave this field empty</label><input id="inquiry-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    </fieldset>
    <button className="sc-button sc-form-submit" type="submit" disabled={!ready || status === "sending" || status === "accepted"}>{status === "sending" ? "Sending your request…" : status === "accepted" ? "Request received" : siteConfig.inquiry.endpoint ? "Send my request" : "Prepare my email request"}<Arrow /></button>
    <p className="sc-form-note">{siteConfig.inquiry.endpoint ? "For firm inquiries only. Please don’t include client or case information." : "This prepares an email to Dario. You’ll review and send it from your email app. Nothing is submitted here."}</p>
    <noscript><p>Email Dario directly at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> to request a demo or your free 30 days.</p></noscript>
    {status === "prepared" && <div className="sc-form-feedback" ref={feedback} tabIndex={-1} role="status">
      <h3>Your request is ready to send.</h3><p>It hasn’t been sent yet. Open your email app, review the details, and send it to {siteConfig.email}.</p>
      <a className="sc-button" href={emailHref}>Open email app<Arrow diagonal /></a>
      <button className="sc-text-button" type="button" onClick={async () => { try { await navigator.clipboard.writeText(`To: ${siteConfig.email}\nSubject: ${draft.subject}\n\n${draft.body}`); setCopied(true); setCopyFailed(false); } catch { setCopyFailed(true); } }}>{copied ? "Email text copied" : "Copy email text"}</button>
      {copyFailed && <p>Copy isn’t available in this browser. Select the message below instead.</p>}
      <details><summary>View email text</summary><pre>{`To: ${siteConfig.email}\nSubject: ${draft.subject}\n\n${draft.body}`}</pre></details>
    </div>}
    {status === "accepted" && <div className="sc-form-feedback" ref={feedback} tabIndex={-1} role="status"><h3>Your request was received.</h3><p>Dario will follow up at the email you provided to discuss the next step.</p></div>}
    {status === "error" && <div className="sc-form-feedback sc-error" ref={feedback} tabIndex={-1} role="alert"><h3>We couldn’t confirm your request.</h3><p>Please try again or <a href={emailHref}>send your request by email</a>. We haven’t confirmed a submission.</p></div>}
  </form>;
}
