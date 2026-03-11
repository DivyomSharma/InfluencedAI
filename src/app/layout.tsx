import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "influenced.ai | AI Creative Platform",
  description: "Premium AI generation for images, videos, voice, and scripts. Pay only when you use.",
  keywords: ["AI", "image generation", "video generation", "voice synthesis", "creative platform"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-[var(--background)] text-[var(--text-primary)] min-h-screen selection:bg-indigo-500/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
