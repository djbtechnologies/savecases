/** Public homepage settings. Never put credentials in this file. */
export const siteConfig = {
  name: "SaveCases",
  url: "https://savecases.com",
  email: "dario@savecases.com", // Existing project contact.
  founder: { name: "Dario", role: "Founder · Rutgers engineering student" },
  trialDays: 30,
  media: {
    // Approved public-facing media. Private briefing assets stay separate.
    founderVideo: "",
    founderPoster: "",
    founderCaptions: "",
    sampleCallAudio: "",
    sampleCallTranscript: "",
  },
  demo: { phoneDisplay: "", phoneE164: "" },
  inquiry: {
    // Empty: explicit email handoff. HTTPS endpoint must accept JSON, support
    // CORS, and return { accepted: true } ONLY after durable acceptance.
    // Keep provider credentials on the server.
    endpoint: process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT || "",
  },
  operations: {
    // Owner: replace only after confirming the actual operational process.
    humanAttention:
      "We’ll discuss which calls need your team and agree on a process before launch. Live transfers and urgent-call handling need to be confirmed for your firm; they aren’t assumed to be included.",
  },
};

export const siteDescription =
  "SaveCases helps personal injury law firms stop missing cases after hours. AI-powered intake, your firm’s criteria, and a free 30-day trial with no automatic charge.";
