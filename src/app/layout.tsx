import type { Metadata } from "next";
import { DM_Sans, Alfa_Slab_One } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// 1. Setup Body Font (DM Sans)
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans", // Defines CSS variable '--font-dm-sans'
  display: "swap",
});

// 2. Setup Display Font (Alfa Slab One)
const alfaSlab = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alfa-slab", // <--- This MUST match the var() in globals.css
  display: "swap",
});

export const metadata: Metadata = {
  title: "WrappedOnChain 2025",
  description: "Your 2025 On-Chain Recap",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for performance, though next/font handles most loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      {/* BEST PRACTICE: Apply BOTH font variables here. 
        antialiased: Smooths font rendering 
        min-h-screen: Ensures full height
      */}
      <body className={`${dmSans.variable} ${alfaSlab.variable} antialiased min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}