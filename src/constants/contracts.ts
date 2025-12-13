// import { abi } from 'viem'; // Or just paste the array as const

// 1. The Supported Chain IDs
export const CHAIN_IDS = {
  BASE: 8453,
  CELO: 42220,
} as const;

// 2. The Configuration Map
export const CHAIN_CONFIG = {
  [CHAIN_IDS.BASE]: {
    name: "Base",
    address: "0x35428D0ae9bB988bA2a1386b074bFF5E60b60d14",
    price: "0.0001", // ETH
    currency: "ETH",
    explorer: "https://basescan.org",
  },
  [CHAIN_IDS.CELO]: {
    name: "Celo",
    address: "0x175357b6820C6d73CFBa870C662A24A9fB12eD6d",
    price: "1",      // CELO
    currency: "CELO",
    explorer: "https://celoscan.io",
  }
} as const;

// 3. The ABI (Using the one you provided, but BE AWARE of the issue above)
export const PERSONA_CONTRACT_ABI = [
  // ... Paste your full ABI array here ...
] as const;