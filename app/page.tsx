import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig, siteDescription } from "@/lib/site-config";
import { Arrow, Brand, Check, Phone } from "@/components/marketing/Icons";
import { ConfiguredMedia, InquiryForm, MobileMenu, RequestLink } from "@/components/marketing/Interactions";
import "./home.css";

const serif = localFont({ src: [
  { path: "../public/fonts/instrument-serif-latin.woff2", weight: "400", style: "normal" },
  { path: "../public/fonts/instrument-serif-italic-latin.woff2", weight: "400", style: "italic" },
], variable: "--sc-serif", display: "swap" });
const sans = localFont({ src: "../public/fonts/inter-latin.woff2", variable: "--sc-sans", display: "swap", weight: "100 900" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "SaveCases | After-hours intake for personal injury law firms",
  description: siteDescription,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: { icon: "/marketing/favicon.svg" },
  openGraph: { type: "website", locale: "en_US", siteName: siteConfig.name, url: "/", title: "Your office closes. Potential clients keep calling.", description: siteDescription, images: [{ url: "/marketing/social-card.png", width: 1200, height: 630, alt: "SaveCases — After-hours intake. Your firm’s criteria." }] },
  twitter: { card: "summary_large_image", title: "SaveCases | After-hours intake", description: siteDescription, images: ["/marketing/social-card.png"] },
};

const steps = [
  ["Built around your firm.", "We handle setup, using your intake questions, case types, and qualification criteria."],
  ["Tested by you.", "Try the assistant with sample scenarios. Request changes and approve it before real inquiries."],
  ["There after hours.", "SaveCases answers when your team is off the clock and guides callers through your intake process."],
  ["Ready for your team.", "Receive the collected details and consultations booked with callers who meet your criteria."],
];
const faqs = [
  ["Is this AI? Will callers know?", "Yes. SaveCases uses an AI intake assistant. The introduction should identify it as an AI assistant for your firm, and you review that wording before launch. It collects information and follows your criteria; it doesn’t provide legal advice or make legal judgments."],
  ["Does this replace our receptionist?", "No. SaveCases supplements your team by covering after-hours calls. Your receptionist continues handling the work they already do. We discuss the coverage window with you during setup."],
  ["Who decides which inquiries qualify?", "Your firm does. You set the questions and qualification criteria, including the case types and locations you want to discuss. Matching those criteria can lead to a consultation; it is not a legal assessment or a decision to accept a case."],
  ["Can we test it before it takes real calls?", "Yes. Try realistic scenarios, interrupt, change details, and ask follow-up questions. Request adjustments before approving it for real inquiries. AI can make mistakes, which is why your testing and review matter."],
  ["How much work does setup require?", "We handle configuration. You provide your intake preferences, qualification criteria, and consultation availability, then test the experience. The exact call-routing and booking arrangements are confirmed with you before launch."],
  ["What if a caller needs a person?", siteConfig.operations.humanAttention],
  ["What does “free for 30 days” include?", `We handle setup and cover the first ${siteConfig.trialDays} days of service. You can test the assistant and request changes before it handles real inquiries. There’s no automatic charge and no obligation to continue.`],
  ["What happens after the 30 days?", "We review the calls, consultations, and any resulting signed cases with you. If you want to continue, we discuss the terms together first. Continuing is your choice; the trial does not automatically become a paid subscription."],
];

export default function Home() {
  return <div className={`sc-site ${serif.variable} ${sans.variable}`} id="top">
    <a className="sc-skip" href="#main">Skip to content</a>
    <header className="sc-header"><div className="sc-shell sc-nav">
      <Brand />
      <nav className="sc-desktop-nav" aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#trial">The 30-day trial</a><a href="#questions">Questions</a></nav>
      <a className="sc-nav-cta" href="#demo">Try the intake demo<Arrow /></a><MobileMenu />
    </div></header>
    <main id="main">
      <section className="sc-hero sc-shell" aria-labelledby="hero-title">
        <div className="sc-hero-copy"><p className="sc-eyebrow"><span className="sc-small-line" /> AFTER-HOURS INTAKE FOR PERSONAL INJURY FIRMS</p>
          <h1 id="hero-title">Your office closes.<br /><em>Potential clients</em><br /><em>keep calling.</em></h1>
          <p className="sc-hero-description">SaveCases answers after-hours calls, collects case details, and books qualified consultations using your firm’s criteria.</p>
          <div className="sc-actions"><a className="sc-button" href="#demo">Try the intake demo<Arrow /></a><a className="sc-video-link" href="#walkthrough"><span aria-hidden="true">↗</span> Watch how it works</a></div>
          <p className="sc-reassurance"><Check /> Set up for your firm. Test it before it handles real calls.</p>
        </div>
        <div className="sc-night-scene" aria-label="Illustration of an after-hours inquiry">
          <div className="sc-scene-header"><span>THE OFFICE IS CLOSED.</span><span>THE NEXT STEP ISN’T.</span></div>
          <div className="sc-orbit sc-orbit-one" aria-hidden="true" /><div className="sc-orbit sc-orbit-two" aria-hidden="true" />
          <div className="sc-time">8:47<span>PM</span></div><p className="sc-time-caption">An inquiry doesn’t keep office hours.</p>
          <div className="sc-call-note"><div className="sc-call-icon"><Phone /></div><div><span>A POTENTIAL CLIENT CALLS</span><strong>A conversation. A clear next step.</strong></div><span className="sc-note-dot" aria-hidden="true" /></div>
          <div className="sc-scene-flow"><span>Answer</span><i /><span>Understand</span><i /><span>Arrange</span></div>
          <div className="sc-scene-footer"><span>SAVECASES / AFTER HOURS</span><span>ILLUSTRATIVE SCENARIO</span></div>
        </div>
      </section>
      <div className="sc-principles sc-shell"><span><Check /> Supports your existing team</span><span><Check /> Your questions. Your criteria.</span><span><Check /> AI-powered. Firm-guided.</span></div>

      <section className="sc-demo sc-section sc-shell" id="demo" aria-labelledby="demo-title">
        <div className="sc-section-heading"><div><p className="sc-eyebrow">01 / SEE THE EXPERIENCE</p><h2 id="demo-title">Before you trust it.<br /><em>Try it.</em></h2></div><p>You know what a good intake sounds like.<br className="sc-desktop-break" /> Ask difficult questions. Change a detail. See how the assistant follows your process.</p></div>
        <div className="sc-demo-grid">
          <div className="sc-walkthrough" id="walkthrough">
            <div className="sc-panel-top"><span>A NOTE FROM THE FOUNDER</span><span>01</span></div>
            {siteConfig.media.founderVideo ? <ConfiguredMedia kind="founder" /> : <div className="sc-video-empty"><span className="sc-empty-mark" aria-hidden="true">S.</span><h3>A closer look.<br /><em>From the person building it.</em></h3><p>A short founder video is coming.<br />For now, ask Dario for a personal walkthrough.</p><RequestLink className="sc-light-link">Request a walkthrough</RequestLink></div>}
            <div className="sc-walkthrough-caption"><span>{siteConfig.founder.name} <span className="sc-caption-muted">/ Founder, SaveCases</span></span><span>{siteConfig.media.founderVideo ? "THE INTRODUCTION" : "VIDEO COMING SOON"}</span></div>
          </div>
          <div className="sc-sample"><div className="sc-panel-top"><span>INSIDE AN INTAKE</span><span>02</span></div><div className="sc-sample-content">
            <div className="sc-sample-heading"><span className="sc-outline-icon"><Phone /></span><div><h3>A calm place to start.</h3><p>Illustrative conversation · synthetic details</p></div></div>
            {siteConfig.media.sampleCallAudio ? <><ConfiguredMedia kind="sample" />{siteConfig.media.sampleCallTranscript && <a className="sc-text-link" href={siteConfig.media.sampleCallTranscript}>Read the audio transcript<Arrow diagonal /></a>}</> : <p className="sc-recording-note">Sample audio is coming. Read an example below.</p>}
            <div className="sc-transcript"><div><span>ASSISTANT</span><p>“I’m the firm’s AI intake assistant. I can collect a few details for the team. What name should I use?”</p></div><div><span>CALLER</span><p>“Alex Morgan. I was in a car accident earlier today, and I’m not sure what to do next.”</p></div><div><span>ASSISTANT</span><p>“I’m sorry that happened, Alex. What’s the best number for the team to reach you?”</p></div></div>
            <details className="sc-transcript-more"><summary>Read the rest of the example<span aria-hidden="true">+</span></summary><div><p><strong>Assistant:</strong> “Where did the accident happen, and have you received any medical treatment?”</p><p><strong>Caller:</strong> “In New Jersey. I went to urgent care this afternoon.”</p><p><strong>Assistant:</strong> “Thank you. I’ll collect a few more details using the firm’s intake questions. If your inquiry meets their criteria, I can help arrange a consultation.”</p><p className="sc-small-copy">This is a written illustration, not a recording or a claim about a real call. A consultation is not an agreement to take a case.</p></div></details>
          </div></div>
        </div>
        <div className="sc-intake-summary"><div><span className="sc-eyebrow">WHAT YOUR TEAM COULD RECEIVE</span><h3>The conversation, organized.</h3><p>Illustrative intake summary · fictional caller</p></div><dl><div><dt>CONTACT</dt><dd>Alex Morgan<span>Callback number collected</span></dd></div><div><dt>INQUIRY</dt><dd>Motor vehicle accident<span>New Jersey · same day</span></dd></div><div><dt>NEXT STEP</dt><dd>Consultation arranged<span>If the firm’s criteria are met</span></dd></div></dl></div>
        <div className="sc-demo-bottom"><p>Put your own intake questions to the test.</p>{siteConfig.demo.phoneE164 && siteConfig.demo.phoneDisplay ? <a className="sc-text-link" href={`tel:${siteConfig.demo.phoneE164}`}>Call the demo: {siteConfig.demo.phoneDisplay}<Arrow /></a> : <RequestLink className="sc-text-link">Request your intake demo</RequestLink>}</div>
      </section>

      <section className="sc-why" aria-labelledby="why-title"><div className="sc-shell sc-why-grid"><div><p className="sc-eyebrow">THE HOURS BETWEEN</p><h2 id="why-title">Your advertising works late.<br /><em>Your intake can, too.</em></h2></div><div><p>Someone finds your firm. They call after hours. They need to know what happens next.</p><p>A voicemail may be enough for some callers. Others may keep looking. SaveCases gives potential clients a way to share their story and take a next step while your team is away.</p></div></div><div className="sc-shell sc-caller-journey"><span>They discover your firm</span><Arrow /><span>They call after hours</span><Arrow /><span className="sc-journey-end">Give them a next step<Arrow diagonal /></span></div></section>

      <section className="sc-section sc-shell sc-how" id="how-it-works" aria-labelledby="how-title"><div className="sc-section-heading"><div><p className="sc-eyebrow">02 / SIMPLE TO START</p><h2 id="how-title">Your process.<br /><em>Our setup.</em></h2></div><p>A considered handoff from your daytime team to your after-hours assistant.</p></div><ol className="sc-steps">{steps.map(([title, copy], i) => <li key={title}><span className="sc-step-number">0{i + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></section>

      <section className="sc-process sc-shell" aria-labelledby="process-title"><div className="sc-process-copy"><p className="sc-eyebrow">03 / BUILT AROUND YOUR STANDARDS</p><h2 id="process-title">Your firm’s judgment.<br /><em>Your firm’s criteria.</em></h2><p>The assistant follows a consistent intake process shaped around what your team needs to know.</p><ul><li><Check />The case types and locations you handle</li><li><Check />The questions you want answered first</li><li><Check />The criteria for booking a consultation</li></ul><p className="sc-process-note">Your team decides whether to take a case. The AI collects information; it doesn’t make legal judgments.</p></div><div className="sc-criteria"><div className="sc-criteria-head"><span>YOUR INTAKE PLAYBOOK</span><span className="sc-example-tag">ILLUSTRATIVE</span></div><div className="sc-criteria-row"><span>01</span><div><h3>Start with the person</h3><p>Name, contact details, and what happened.</p></div><Check /></div><div className="sc-criteria-row"><span>02</span><div><h3>Ask what matters to your firm</h3><p>Incident date, location, injuries, and treatment.</p></div><Check /></div><div className="sc-criteria-row"><span>03</span><div><h3>Apply your intake criteria</h3><p>Compare the details with your preferences.</p></div><Check /></div><div className="sc-criteria-row"><span>04</span><div><h3>Arrange the next step</h3><p>Book a consultation when those criteria are met.</p></div><Check /></div><p className="sc-criteria-foot">Example configuration, not a product dashboard.</p></div></section>

      <section className="sc-trial sc-shell" id="trial" aria-labelledby="trial-title"><div className="sc-trial-main"><p className="sc-eyebrow">04 / AN OFFER YOU CAN EVALUATE</p><h2 id="trial-title">Give it 30 days.<br /><em>Let the calls tell the story.</em></h2><p>We handle setup and cover your first {siteConfig.trialDays} days of service. You get time to see how SaveCases fits your firm.</p><RequestLink intent="trial" className="sc-button sc-button-light">Request your free 30 days</RequestLink><p className="sc-trial-reassurance">No automatic charge. No obligation to continue.</p></div><div className="sc-trial-aside"><div className="sc-thirty"><span>30</span><div>DAYS OF SERVICE<br />ON US.</div></div><ul><li><Check />Setup around your firm’s process</li><li><Check />Testing and adjustments before launch</li><li><Check />After-hours answering and intake</li><li><Check />A review of the results, together</li></ul><p>After 30 days, we review calls, consultations, and any resulting signed cases. Then you decide whether to discuss continuing.</p></div></section>

      <section className="sc-founder sc-shell" aria-labelledby="founder-title"><div><p className="sc-eyebrow">A NOTE FROM DARIO</p><h2 id="founder-title">A real person.<br /><em>Behind your AI intake.</em></h2></div><div className="sc-founder-letter"><p>I’m Dario, a Rutgers engineering student building SaveCases around a straightforward problem: a firm’s day ends, but potential clients still need a next step.</p><p>I want you to be able to test what I’m building, tell me what needs to change, and decide whether it earns a place in your firm. That’s why I’m handling setup and covering the first 30 days.</p><div className="sc-founder-signoff"><span className="sc-signature">Dario</span><span>FOUNDER, SAVECASES<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}<Arrow diagonal /></a></span></div></div></section>

      <section className="sc-faq sc-shell" id="questions" aria-labelledby="faq-title"><div><p className="sc-eyebrow">A FEW FAIR QUESTIONS</p><h2 id="faq-title">The details<br /><em>matter.</em></h2><p>Something else on your mind?</p><a className="sc-text-link" href={`mailto:${siteConfig.email}`}>Ask Dario directly<Arrow diagonal /></a></div><div className="sc-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

      <section className="sc-inquiry" id="inquiry" aria-labelledby="inquiry-title"><div className="sc-shell sc-inquiry-grid"><div><p className="sc-eyebrow">YOUR NEXT STEP</p><h2 id="inquiry-title">Start with a conversation.<br /><em>Then try a better one.</em></h2><p>Request a demo to hear the intake experience for yourself, or tell us you’re interested in your free 30 days.</p><div className="sc-contact-note"><span className="sc-contact-monogram" aria-hidden="true">D.</span><div><strong>You’ll hear from Dario.</strong><span>The person building SaveCases.</span></div></div><a className="sc-direct-email" href={`mailto:${siteConfig.email}`}>Prefer email? {siteConfig.email}<Arrow diagonal /></a></div><InquiryForm /></div></section>
    </main>
    <footer className="sc-footer sc-shell"><div><Brand footer /><p>After hours. Still there.</p></div><div className="sc-footer-right"><a href={`mailto:${siteConfig.email}`}>Contact Dario<Arrow diagonal /></a><p>© {new Date().getFullYear()} SaveCases</p><span>Built for personal injury law firms.</span></div></footer>
  </div>;
}
