export type RecipientBriefing = {
  slug: string;
  recipientName: string;
  recipientTitle?: string;
  firmName: string;
  firmShortName?: string;
  logoUrl?: string;
  officeLocation?: string;
  practiceAreas?: string[];
  letterDate?: string;
  briefingNumber?: string;
  openingObservation?: string;
  secondaryObservation?: string;
  statedOfficeHours?: string;
  afterHoursObservation?: {
    callDate?: string;
    callTime?: string;
    answeredBy?: string;
    summary?: string;
  };
  videoUrl: string;
  videoPosterUrl?: string;
  captionsUrl?: string;
  ctaLabel: string;
  ctaUrl: string;
};

export const recipients: Record<string, RecipientBriefing> = {
  raffandraff: {
    slug: "raffandraff",
    recipientName: "Stephen T. Raff",
    recipientTitle: "Managing Partner",
    firmName: "Raff & Raff",
    firmShortName: "Raff & Raff",
    officeLocation: "New Jersey",
    practiceAreas: [
      "Personal Injury",
      "Motor Vehicle Accidents",
      "Workers’ Compensation"
    ],
    letterDate: "August 5, 2026",
    briefingNumber: "SC–0017",
    openingObservation:
      "Your firm has spent decades earning the trust of injured people throughout New Jersey.",
    secondaryObservation:
      "Publicly listed office hours create a clear handoff point between the firm’s daytime team and the after-hours caller journey.",
    statedOfficeHours: "Monday–Friday, 9:00 AM–5:00 PM",
    afterHoursObservation: {
      callTime: "After 5:00 PM",
      answeredBy: "The front desk",
      summary:
        "The interaction was handled professionally. The remaining question is continuity: what structured next step is available after the greeting?"
    },
    videoUrl: "/video-private-briefing.mp4",
    videoPosterUrl: "/briefing-assets/video-poster.jpg",
    captionsUrl: "/briefing-assets/private-briefing.vtt",
    ctaLabel: "Discuss the Test",
    ctaUrl:
      "mailto:dario@savecases.com?subject=Raff%20%26%20Raff%20%E2%80%94%20Private%20briefing"
  }
};

export function getRecipient(slug: string): RecipientBriefing | undefined {
  return recipients[slug];
}

export const recipientSlugs = Object.keys(recipients);

