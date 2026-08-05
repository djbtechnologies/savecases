import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Private Briefing | SaveCases",
  description: "A recipient-specific SaveCases briefing.",
  robots: {
    index: false,
    follow: false,
    noarchive: true
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
