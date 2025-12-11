import React from "react";

export const ChainLogo = ({ chain, className }: { chain: string; className?: string }) => {
  // Normalize string to handle "Ethereum", "eth-mainnet", etc.
  const c = chain?.toLowerCase() || "";

  if (c.includes("base")) {
    return (
      <svg viewBox="0 0 1000 1000" fill="currentColor" className={className}>
        <path d="M500 0C223.858 0 0 223.858 0 500s223.858 500 500 500 500-223.858 500-500S776.142 0 500 0zm0 790c-160.163 0-290-129.837-290-290 0-160.163 129.837-290 290-290 160.163 0 290 129.837 290 290 0 160.163-129.837 290-290 290z" />
      </svg>
    );
  }

  if (c.includes("eth")) {
    return (
      <svg viewBox="0 0 784.37 1277.39" fill="currentColor" className={className}>
        <path d="M392.07 0l-9.2 31.36v930.51l9.2 9.18L784.13 650.54 392.07 0zM392.07 971.11l-9.2 11.26v312.35l9.2 26.33 392.32-552.49-392.32 202.55zM392.07 0L0 650.54l392.07 320.53V0zM392.07 1321.05V1008.7L0 768.61l392.07 552.44z" />
      </svg>
    );
  }

  if (c.includes("matic") || c.includes("polygon")) {
    return (
      <svg viewBox="0 0 380 334" fill="currentColor" className={className}>
        <path d="M285.6 37L241 110.8l43.8 75.8 45.4-74.6L285.6 37zm-95.2 56L146.6 17.2 99.8 93.6l45.2 76.6 45.4-77.2zm0 149.6l-44.6 74.4 46.8 76.4 46.8-75.6-49-75.2zm-94-149L49.6 168l-45.8-75L49.6 17.2 96.4 93.6zM4.6 193.4l46.4 76.2 46.6-76-47-75.4L4.6 193.4zm141.2 23.4l45.8 75.6 45.8-76-46.4-76.4-45.2 76.8zM240 241l46.2 75.8 46.6-75.2-46.2-76.2L240 241zm45.6-105.8l45.4-75.4-44.8-74.8-46.4 75 45.8 75.2z" />
      </svg>
    );
  }

  // Default to a generic block cube if unknown
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
};