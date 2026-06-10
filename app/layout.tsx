import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "MirrorLog — Accountability from people who actually see you",
  description: "Track habits with your inner circle via MirrorPulse. Focus silently with others via MirrorPod. Two tools, one goal — become who you say you are.",
  icons: {
    icon: "/logo.ico",
    shortcut: "/logo.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "MirrorLog — Accountability from people who actually see you",
    description: "Track habits with your inner circle via MirrorPulse. Focus silently with others via MirrorPod. Two tools, one goal — become who you say you are.",
    url: "https://mirrorlog.org",
    siteName: "MirrorLog",
    images: [
      {
        url: "https://mirrorlog.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "MirrorLog — Accountability from people who actually see you",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MirrorLog — Accountability from people who actually see you",
    description: "Track habits with your inner circle via MirrorPulse. Focus silently with others via MirrorPod. Two tools, one goal — become who you say you are.",
    images: ["https://mirrorlog.org/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
