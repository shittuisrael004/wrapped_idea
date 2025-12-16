import { NextResponse } from 'next/server';
import { classifyTransaction, ContractCategory } from '@/utils/classifier';
import { calculatePersonaAndRarity } from '@/utils/persona-system';

// =============================================================================
// TOP 10 PRACTICAL EVM CHAINS (Covers 95%+ of user activity)
// =============================================================================

const SUPPORTED_CHAINS = [
  // TIER 1: Major L1s & L2s
  { name: "eth-mainnet", id: 1, label: "Ethereum", tier: 1 },
  { name: "base-mainnet", id: 8453, label: "Base", tier: 1 },
  { name: "optimism-mainnet", id: 10, label: "Optimism", tier: 1 },
  { name: "arbitrum-mainnet", id: 42161, label: "Arbitrum", tier: 1 },
  { name: "matic-mainnet", id: 137, label: "Polygon", tier: 1, filterSpam: true },
  { name: "avalanche-mainnet", id: 43114, label: "Avalanche", tier: 1 },
  { name: "bsc-mainnet", id: 56, label: "BSC", tier: 1, filterSpam: true },
  
  // TIER 2: Requested additions
  { name: "celo-mainnet", id: 42220, label: "Celo", tier: 2 },
  { name: "zksync-mainnet", id: 324, label: "zkSync Era", tier: 2 },
  { name: "blast-mainnet", id: 81457, label: "Blast", tier: 2 },
];

const MIN_GAS_ESTIMATE: Record<string, number> = {
  "eth-mainnet": 2.50,
  "base-mainnet": 0.0001, "optimism-mainnet": 0.0001, "arbitrum-mainnet": 0.0001,
  "zksync-mainnet": 0.0001, "polygon-zkevm-mainnet": 0.0001, "linea-mainnet": 0.0001,
  "scroll-mainnet": 0.0001, "blast-mainnet": 0.0001, "zora-mainnet": 0.0001,
  "matic-mainnet": 0.001, "bsc-mainnet": 0.03, "avalanche-mainnet": 0.05,
  "fantom-mainnet": 0.002, "cronos-mainnet": 0.01, "moonbeam-mainnet": 0.05,
  "gnosis-mainnet": 0.001, "celo-mainnet": 0.001, "aurora-mainnet": 0.001,
  "mantle-mainnet": 0.0001, "opbnb-mainnet": 0.0001, "ronin-mainnet": 0.001,
};

function getAverageTokenPrice(chainId: number): number {
  // ETH-based chains
  if ([1, 8453, 10, 42161, 324, 1101, 7777777, 59144, 534352, 81457].includes(chainId)) return 3500;
  // BNB-based
  if ([56, 204].includes(chainId)) return 600;
  // MATIC
  if ([137].includes(chainId)) return 1.00;
  // AVAX
  if ([43114].includes(chainId)) return 40;
  // FTM
  if ([250].includes(chainId)) return 0.80;
  // Other chains
  return 1.00;
}

// =============================================================================
// DATE-FILTERED FETCH (2025 only, no pagination needed)
// =============================================================================

interface ChainStats {
  txCount: number;
  gasUsd: number;
  activityByDay: Record<string, number>;
  activityByMonth: Record<string, number>;
  categories: Record<ContractCategory, number>;
}


async function fetchChain2025(
  chain: any,
  address: string,
  apiKey: string,
  timeoutMs: number = 8000 // 8 second timeout per chain
): Promise<{ chain: any; stats: ChainStats }> {
  const stats: ChainStats = {
    txCount: 0,
    gasUsd: 0,
    activityByDay: {},
    activityByMonth: {},
    categories: { DEX: 0, BRIDGE: 0, AGGREGATOR: 0, NFT: 0, INTERACTION: 0 },
  };

  const baseUrl = `https://api.covalenthq.com/v1/${chain.name}/address/${address}/transactions_v3/` +
    `?key=${apiKey}` +
    `&quote-currency=USD` +
    `&no-logs=false` +
    `&page-size=100`;

  let page = 0;
  let shouldContinue = true;

  try {
    while (shouldContinue) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const pageUrl = `${baseUrl}&page-number=${page}`;
        const res = await fetch(pageUrl, { signal: controller.signal });
        clearTimeout(timeout);
        
        if (!res.ok) {
          console.error(`Chain ${chain.label} fetch failed:`, res.status);
          break;
        }

        const json = await res.json();
        const items = json.data?.items || [];
        const pagination = json.data?.pagination;

        if (items.length === 0) break;

        // Process transactions with EARLY EXIT on non-2025 dates
        for (const tx of items) {
          if (!tx.block_signed_at?.startsWith("2025")) {
            shouldContinue = false;
            break;
          }

          if (!tx.successful) continue;
          
          const hasLogs = tx.log_events && tx.log_events.length > 0;
          const isSpam = chain.filterSpam && 
            (tx.value === "0" && tx.gas_spent < 21000 && !hasLogs);
          
          if (isSpam) continue;

          stats.txCount++;

          if (tx.gas_quote) {
            stats.gasUsd += tx.gas_quote;
          } else if (tx.gas_spent && tx.gas_price) {
            const tokenPrice = getAverageTokenPrice(chain.id);
            stats.gasUsd += (Number(tx.gas_spent) * Number(tx.gas_price) * tokenPrice) / 1e18;
          } else {
            stats.gasUsd += (MIN_GAS_ESTIMATE[chain.name] || 0.0001);
          }

          const dateObj = new Date(tx.block_signed_at);
          const dayKey = dateObj.toISOString().split('T')[0];
          const monthKey = dateObj.toLocaleString('default', { month: 'long' });

          stats.activityByDay[dayKey] = (stats.activityByDay[dayKey] || 0) + 1;
          stats.activityByMonth[monthKey] = (stats.activityByMonth[monthKey] || 0) + 1;

          const info = classifyTransaction({ ...tx, chain_id: chain.id });
          stats.categories[info.category]++;
        }

        if (!shouldContinue) break;
        if (!pagination?.has_more) break;
        
        page++;

        if (page > 100) {
          console.warn(`Chain ${chain.label} exceeded 100 pages, stopping`);
          break;
        }
      } catch (fetchError: any) {
        clearTimeout(timeout);
        if (fetchError.name === 'AbortError') {
          throw new Error(`Timeout after ${timeoutMs}ms`);
        }
        throw fetchError;
      }
    }
  } catch (err: any) {
    if (err.message?.includes('Timeout')) {
      console.warn(`[Wrapped] ${chain.label} timed out`);
    } else {
      console.error(`[Wrapped] ${chain.label} error:`, err.message);
    }
  }

  return { chain, stats };
}

// =============================================================================
// MAIN API ROUTE
// =============================================================================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const apiKey = process.env.COVALENT_API_KEY;

  if (!address || !apiKey) {
    return NextResponse.json({ error: 'Missing address or API key' }, { status: 400 });
  }

  const startTime = Date.now();

  try {
    // FETCH CHAINS SEQUENTIALLY with proper timeout handling
    console.log(`[Wrapped] Fetching 2025 data for ${address} across ${SUPPORTED_CHAINS.length} chains...`);
    
    const chainResults: Array<{ chain: any; stats: ChainStats }> = [];
    const CHAIN_TIMEOUT_MS = 8000; // 8 seconds per chain
    
    for (const chain of SUPPORTED_CHAINS) {
      const result = await fetchChain2025(chain, address, apiKey, CHAIN_TIMEOUT_MS);
      chainResults.push(result);
      
      if (result.stats.txCount > 0) {
        console.log(`[Wrapped] ✓ ${chain.label}: ${result.stats.txCount} txs, $${result.stats.gasUsd.toFixed(2)} gas`);
      }
    }

    // AGGREGATE RESULTS
    let totalTx = 0;
    let totalGas = 0;
    const globalDayCounts: Record<string, number> = {};
    const globalMonthCounts: Record<string, number> = {};
    const globalCategories: Record<ContractCategory, number> = { 
      DEX: 0, BRIDGE: 0, AGGREGATOR: 0, NFT: 0, INTERACTION: 0 
    };
    const chainCounts: Record<string, number> = {};
    let activeChains = 0;

    chainResults.forEach(({ chain, stats }) => {
      if (stats.txCount === 0) return; // Skip chains with no activity

      totalTx += stats.txCount;
      totalGas += stats.gasUsd;
      chainCounts[chain.label] = stats.txCount;
      activeChains++;

      // Merge categories
      Object.keys(stats.categories).forEach(k => {
        globalCategories[k as ContractCategory] += stats.categories[k as ContractCategory];
      });

      // Merge daily activity
      Object.entries(stats.activityByDay).forEach(([day, count]) => {
        globalDayCounts[day] = (globalDayCounts[day] || 0) + count;
      });

      // Merge monthly activity
      Object.entries(stats.activityByMonth).forEach(([month, count]) => {
        globalMonthCounts[month] = (globalMonthCounts[month] || 0) + count;
      });

      console.log(`[Wrapped] ${chain.label}: ${stats.txCount} txs, $${stats.gasUsd.toFixed(2)} gas`);
    });

    // CALCULATE METRICS
    const activeDays = Object.keys(globalDayCounts).length;
    
    const [bestDayKey, bestDayCount] = Object.entries(globalDayCounts)
      .sort((a, b) => b[1] - a[1])[0] || ["", 0];
    
    let activeDayLabel = "N/A";
    if (bestDayKey) {
      const d = new Date(bestDayKey);
      activeDayLabel = d.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }).toUpperCase();
    }

    const [peakMonth] = Object.entries(globalMonthCounts)
      .sort((a, b) => b[1] - a[1])[0] || ["December", 0];

    const [topChainName, topChainCount] = Object.entries(chainCounts)
      .sort((a, b) => b[1] - a[1])[0] || ["None", 0];

    const dominance = totalTx > 0 ? (topChainCount / totalTx) : 0;

    // CALCULATE PERSONA & RARITY with enhanced system
    const personaResult = calculatePersonaAndRarity(
      totalTx,
      totalGas,
      activeChains,
      activeDays,
      chainCounts,
      globalCategories
    );

    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Wrapped] Completed in ${executionTime}s - ${totalTx} txs across ${activeChains} chains`);

    return NextResponse.json({
      wallet: address,
      year: 2025,
      summary: {
        total_tx: totalTx,
        active_days: activeDays,
        active_day_date: activeDayLabel,
        active_label: "Most Active Day",
        total_gas_usd: totalGas.toFixed(2),
        peak_month: peakMonth,
        chains_active: activeChains,
        execution_time: executionTime,
      },
      favorites: {
        top_chain: topChainName,
        top_chain_count: topChainCount,
        top_chain_dominance: (dominance * 100).toFixed(1) + "%",
      },
      persona: { 
        title: personaResult.title, 
        description: personaResult.description, 
        color_theme: personaResult.color_theme 
      },
      traits: personaResult.traits,
      rarity: { 
        tier: personaResult.rarity, 
        percentile: personaResult.percentile 
      },
      chains: Object.entries(chainCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, transactions: count }))
    });

  } catch (error) {
    console.error('[Wrapped] Fatal error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch wrapped data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}