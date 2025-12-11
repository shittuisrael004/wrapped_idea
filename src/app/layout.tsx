import type { Metadata } from "next";
import { DM_Sans, Alfa_Slab_One } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const alfaSlab = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-retro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WrappedOnChain 2025",
  description: "2025 Recap",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${dmSans.variable} ${alfaSlab.variable} font-sans antialiased min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}