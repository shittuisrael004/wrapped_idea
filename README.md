# Wallet Wrapped



## Overview
**Wallet Wrapped** is a Web3 analytics tool that scans a user’s on-chain activity and generates a yearly **Wrapped-style recap** that is similar to Spotify Wrapped, but for your crypto wallet.

It currently supports **EVM chains such as Base and Celo**, fetching all relevant on-chain activity, computing insights, and generating **beautiful, shareable visual summaries**.


## Features

- Fetches all on-chain transactions for a wallet
- Supports EVM networks such as Base and Celo for now
- Analyzes:
  - total transactions
  - active months
  - gas spent
  - most interacted contracts
  - tokens interacted with
  - NFTs minted or traded
  - total volume
- Generates Wrapped-style visual summaries
- API + SDK support
- Designed to deployed on Vercel



## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React + TypeScript
- TailwindCSS
- Wagmi + Viem (wallet connection)
- shadcn/ui components

### Backend
- Node.js + TypeScript
- Fastify or Next.js API routes
- Satori + Resvg (image rendering)

### Data Layer
- Blockscout API (Celo + Base)
- Optional: Alchemy for enhanced EVM data



## How it works

### 1. Fetcher 
- connects to Blockscout/Alchemy
- collects tx history

### 2. Analyzer
- computes stats
- groups transactions by month
- identifies tokens / NFTs

### 3. Wrapped Generator
- outputs JSON
- or renders images

### 4. Frontend UI
- React/Next.js results page




## Installation

### 1. Clone the repository
```git clone https://github.com/shittuisrael004/wrapped_idea```
### 2. Enter the project folder
```cd wrapped_idea```



## Support
#### PRs welcome
#### DM on X (Twitter): @ShittuIsraelOl2 or @Jadonamite

Happy Building

❤️ & 💡 
