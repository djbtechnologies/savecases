import type { Metadata } from "next";
import PrivateBriefing from "@/components/PrivateBriefing";
import { getRecipient } from "@/lib/recipients";

export const metadata: Metadata = {
  title: "Private Briefing | SaveCases",
  description:
    "A recipient-specific SaveCases briefing.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true
  },
  alternates: {
    canonical: "https://savecases.com/raffandraff/"
  },
  openGraph: {
    title: "Private Briefing | SaveCases",
    description: "A recipient-specific SaveCases briefing.",
    url: "https://savecases.com/raffandraff/",
    type: "website"
  }
};

export default function RaffAndRaffPage() {
  const briefing = getRecipient("raffandraff");
  if (!briefing) return null;
  return <PrivateBriefing briefing={briefing} />;
}
