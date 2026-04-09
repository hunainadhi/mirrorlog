import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MirrorLog",
  description: "Accountability from people who actually see you.",
  openGraph: {
    title: "MirrorLog",
    description: "Accountability from people who actually see you.",
    url: "https://mirrorlog.org",
    siteName: "MirrorLog",
    images: [
      {
        url: "https://mirrorlog.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "MirrorLog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MirrorLog",
    description: "Accountability from people who actually see you.",
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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}