"use client";

import React, { useEffect, useState } from "react";
import { 
  SiBitcoin, SiEthereum, SiSolana, SiDogecoin, SiTether, 
  SiXrp, SiCardano, SiPolkadot, SiChainlink,
  SiLitecoin, SiBinance
} from "react-icons/si";

// UPDATED: Large sizes, varied blur for depth, and lower opacity
const items = [
  // Top Left - Huge Bitcoin (Background Anchor)
  { Icon: SiBitcoin, top: "-10%", left: "-10%", size: 400, rotate: -15, opacity: 0.03, blur: "blur-sm" },
  
  // Bottom Right - Huge Ethereum (Background Anchor)
  { Icon: SiEthereum, bottom: "-5%", right: "-10%", size: 380, rotate: 10, opacity: 0.03, blur: "blur-sm" },

  // Mid-Floating - Medium Elements (Sharper, "Closer")
  { Icon: SiSolana, top: "20%", right: "15%", size: 180, rotate: 20, opacity: 0.05, blur: "blur-none" },
  { Icon: SiDogecoin, bottom: "15%", left: "10%", size: 160, rotate: -15, opacity: 0.05, blur: "blur-none" },
  
  // Deep Background - Small/Blurry (Far away)
  { Icon: SiPolkadot, top: "40%", left: "20%", size: 120, rotate: 45, opacity: 0.02, blur: "blur-md" },
  { Icon: SiCardano, bottom: "40%", right: "20%", size: 100, rotate: -10, opacity: 0.02, blur: "blur-md" },
  
  // Edges - Floating fragments
  { Icon: SiChainlink, top: "10%", left: "40%", size: 80, rotate: 30, opacity: 0.04, blur: "blur-[2px]" },
  { Icon: SiBinance, bottom: "10%", right: "40%", size: 90, rotate: -20, opacity: 0.04, blur: "blur-[2px]" },
];

export default function CryptoBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item, i) => {
        const { Icon, size, rotate, opacity, blur, top, left, right, bottom } = item;
        
        return (
          <div
            key={i}
            // Added ${blur} to class list for depth of field effect
            className={`absolute text-slate-900 mix-blend-overlay transition-transform duration-[3000ms] ease-in-out hover:scale-110 ${blur}`}
            style={{
              top, left, right, bottom,
              opacity,
              fontSize: `${size}px`,
              transform: `rotate(${rotate}deg)`,
            }}
          >
            <Icon />
          </div>
        );
      })}
    </div>
  );
}