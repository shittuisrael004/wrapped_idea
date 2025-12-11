import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 });

  const apiKey = process.env.COVALENT_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'API Key missing' }, { status: 500 });

  // 1. Scan Major Chains
  const chains = [
    { name: "base-mainnet", id: 8453, label: "Base", avgGas: 0.05 }, // ~5 cents per tx
    { name: "eth-mainnet", id: 1, label: "Ethereum", avgGas: 4.50 }, // ~$4.50 per tx
    { name: "matic-mainnet", id: 137, label: "Polygon", avgGas: 0.01 },
    { name: "optimism-mainnet", id: 10, label: "Optimism", avgGas: 0.05 },
    { name: "arbitrum-mainnet", id: 42161, label: "Arbitrum", avgGas: 0.05 }
  ];

  try {
    const promises = chains.map(async (chain) => {
      // Fetch monthly granularity to find the "Peak Month"
      const url = `https://api.covalenthq.com/v1/${chain.name}/address/${address}/transactions_summary/?key=${apiKey}&quote-currency=USD`;
      
      try {
        const res = await fetch(url);
        const json = await res.json();
        return { chain, items: json.data?.items || [] };
      } catch (err) {
        return { chain, items: [] };
      }
    });

    const results = await Promise.all(promises);

    // 2. Aggregation Logic
    let totalTx = 0;
    let totalGasUsd = 0;
    let topChain = { name: "None", count: 0 };
    
    // Month Tracking
    const monthCounts: Record<string, number> = {};
    
    results.forEach((res) => {
      if (res.items && res.items.length > 0) {
        // Covalent returns a list of time buckets (months/days)
        res.items.forEach((item: any) => {
            const count = item.total_count;
            const gas = item.total_gas_cost_usd || 0;
            
            totalTx += count;
            totalGasUsd += gas;

            // Track Monthly Activity (extract "2025-03" from date)
            const date = new Date(item.latest_transaction.block_signed_at);
            const monthKey = date.toLocaleString('default', { month: 'long' });
            monthCounts[monthKey] = (monthCounts[monthKey] || 0) + count;
        });

        // Track Top Chain
        const chainTotal = res.items.reduce((acc: number, cur: any) => acc + cur.total_count, 0);
        if (chainTotal > topChain.count) {
          topChain = { name: res.chain.label, count: chainTotal };
        }

        // Fallback Gas Calculation: If API gave 0 gas, estimate it
        if (totalGasUsd === 0 && chainTotal > 0) {
            totalGasUsd += chainTotal * res.chain.avgGas;
        }
      }
    });

    // 3. Find Peak Month
    let peakMonth = "January";
    let peakCount = 0;
    Object.entries(monthCounts).forEach(([month, count]) => {
        if (count > peakCount) {
            peakCount = count;
            peakMonth = month;
        }
    });

    // 4. Persona Logic
    let persona = { title: "The Tourist 📸", description: "Just passing through.", color_theme: "#94a3b8" };
    if (totalGasUsd > 500) persona = { title: "The Whale 🐋", description: "You burn gas like it's free.", color_theme: "#3b82f6" };
    else if (totalTx > 1000) persona = { title: "The Grinder ⚙️", description: "Non-stop hustle.", color_theme: "#f59e0b" };
    else if (totalTx > 100) persona = { title: "The Regular 🤝", description: "Solid on-chain citizen.", color_theme: "#10b981" };

    return NextResponse.json({
      wallet: address,
      year: 2025,
      summary: {
        total_tx: totalTx,
        active_days: Math.floor(totalTx / 2.5), // Rough Estimate
        total_gas_usd: totalGasUsd.toFixed(2),
        peak_month: peakMonth // NEW DATA POINT
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