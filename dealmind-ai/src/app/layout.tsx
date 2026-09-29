import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DealMind AI | Memory for every deal",
  description:
    "A Hindsight-powered deal intelligence workspace that learns from every buyer interaction.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
