import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 });

  const apiKey = process.env.COVALENT_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'API Key missing' }, { status: 500 });

  // 1. Scan the 3 major chains where we confirmed you have data
  const chains = [
    { name: "base-mainnet", id: 8453, label: "Base" },
    { name: "eth-mainnet", id: 1, label: "Ethereum" },
    { name: "matic-mainnet", id: 137, label: "Polygon" },
    { name: "optimism-mainnet", id: 10, label: "Optimism" },
    { name: "arbitrum-mainnet", id: 42161, label: "Arbitrum" }
  ];

  try {
    const promises = chains.map(async (chain) => {
      // FIX: Corrected URL from 'transaction_v2/summary' to 'transactions_summary'
      // const url = `https://api.covalenthq.com/v1/${chain.name}/address/${address}/transactions_summary/?key=${apiKey}`;
      // Added &quote-currency=USD to force price calculation
const url = `https://api.covalenthq.com/v1/${chain.name}/address/${address}/transactions_summary/?key=${apiKey}&quote-currency=USD`;
      
      try {
        const res = await fetch(url);
        const json = await res.json();
        const items = json.data?.items || [];
        return { chain: chain.label, items };
      } catch (err) {
        console.error(`Failed to fetch ${chain.label}`);
        return { chain: chain.label, items: [] };
      }
    });

    const results = await Promise.all(promises);

    // 3. Aggregation
    let totalTx = 0;
    let totalGasUsd = 0;
    let topChain = { name: "None", count: 0 };
    let earliestTx = new Date();
    let latestTx = new Date(0);

    results.forEach((res) => {
      if (res.items && res.items.length > 0) {
        // The summary endpoint returns a list (usually one item per chain summary)
        const item = res.items[0]; 
        
        // Add to totals
        const count = item.total_count || 0;
        const gas = item.total_gas_cost_usd || 0;
        
        totalTx += count;
        totalGasUsd += gas;

        if (count > topChain.count) {
          topChain = { name: res.chain, count: count };
        }
        
        // Check Dates
        if (item.earliest_transaction?.block_signed_at) {
            const first = new Date(item.earliest_transaction.block_signed_at);
            if (first < earliestTx) earliestTx = first;
        }
        if (item.latest_transaction?.block_signed_at) {
            const last = new Date(item.latest_transaction.block_signed_at);
            if (last > latestTx) latestTx = last;
        }
      }
    });

    // 4. Persona Logic
    let persona = { title: "The Tourist 📸", description: "Just passing through.", color_theme: "#94a3b8" };

    if (totalGasUsd > 100) {
      persona = { title: "The Whale 🐋", description: "You burn gas like it's free.", color_theme: "#3b82f6" };
    } else if (totalTx > 50) {
      persona = { title: "The Grinder ⚙️", description: "Non-stop hustle.", color_theme: "#f59e0b" };
    } else if (totalTx > 10) {
      persona = { title: "The Regular 🤝", description: "Solid on-chain citizen.", color_theme: "#10b981" };
    }

    return NextResponse.json({
      wallet: address,
      year: 2024,
      summary: {
        total_tx: totalTx,
        active_days: Math.floor(totalTx / 2), 
        total_gas_usd: totalGasUsd.toFixed(2),
        first_tx_date: totalTx > 0 ? earliestTx.toISOString().split('T')[0] : "N/A",
        last_tx_date: totalTx > 0 ? latestTx.toISOString().split('T')[0] : "N/A",
      },
      favorites: {
        top_chain: topChain.name,
        top_chain_count: topChain.count
      },
      persona: persona
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}