// =============================================================================
// ENHANCED PERSONA & RARITY SYSTEM
// =============================================================================

interface PersonaResult {
  title: string;
  description: string;
  color_theme: string;
  rarity: RarityTier;
  percentile: string;
  traits: string[];
}

type RarityTier = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

interface UserStats {
  totalTx: number;
  totalGas: number;
  activeChains: number;
  activeDays: number;
  chainCounts: Record<string, number>;
  categories: Record<string, number>;
  topChain: string;
  topChainCount: number;
}

// =============================================================================
// BEAUTIFUL COLOR THEMES (Tailwind gradients)
// =============================================================================

const COLOR_THEMES = {
  // Chain-specific themes
  ETHEREUM: "from-slate-700 via-slate-800 to-slate-900",
  BASE: "from-blue-500 via-blue-600 to-indigo-700",
  OPTIMISM: "from-red-500 via-rose-600 to-pink-700",
  ARBITRUM: "from-blue-400 via-cyan-500 to-teal-600",
  POLYGON: "from-purple-500 via-violet-600 to-fuchsia-700",
  BSC: "from-yellow-400 via-amber-500 to-orange-600",
  AVALANCHE: "from-red-500 via-rose-600 to-red-700",
  ZKSYNC: "from-indigo-600 via-purple-600 to-violet-700",
  BLAST: "from-yellow-300 via-yellow-400 to-amber-500",
  CELO: "from-green-400 via-emerald-500 to-teal-600",
  
  // Archetype themes
  WHALE: "from-amber-400 via-yellow-500 to-orange-600",
  DEGEN: "from-green-400 via-emerald-500 to-green-600",
  NOMAD: "from-sky-400 via-blue-500 to-cyan-600",
  COLLECTOR: "from-pink-400 via-rose-500 to-pink-600",
  POLYGLOT: "from-indigo-500 via-purple-500 to-pink-500",
  GHOST: "from-slate-300 via-slate-400 to-gray-500",
  OPERATOR: "from-purple-600 via-fuchsia-600 to-pink-700",
  ARCHITECT: "from-cyan-500 via-blue-600 to-indigo-700",
  STRATEGIST: "from-violet-600 via-purple-700 to-fuchsia-800",
  
  // Special themes
  TOURIST: "from-slate-400 to-slate-600",
  MYTHIC: "from-yellow-200 via-orange-400 to-rose-600",
};

// =============================================================================
// RARITY CALCULATION (Multi-factor scoring)
// =============================================================================

function calculateRarity(stats: UserStats): { tier: RarityTier; percentile: string; score: number } {
  let score = 0;
  
  // Factor 1: Transaction Volume (0-40 points)
  if (stats.totalTx > 5000) score += 40;
  else if (stats.totalTx > 2000) score += 35;
  else if (stats.totalTx > 1000) score += 30;
  else if (stats.totalTx > 500) score += 25;
  else if (stats.totalTx > 200) score += 20;
  else if (stats.totalTx > 100) score += 15;
  else if (stats.totalTx > 50) score += 10;
  else if (stats.totalTx > 20) score += 5;
  
  // Factor 2: Gas Spent (0-25 points)
  if (stats.totalGas > 5000) score += 25;
  else if (stats.totalGas > 2000) score += 20;
  else if (stats.totalGas > 1000) score += 15;
  else if (stats.totalGas > 500) score += 10;
  else if (stats.totalGas > 100) score += 5;
  
  // Factor 3: Multi-chain Activity (0-20 points)
  if (stats.activeChains >= 8) score += 20;
  else if (stats.activeChains >= 6) score += 15;
  else if (stats.activeChains >= 4) score += 10;
  else if (stats.activeChains >= 2) score += 5;
  
  // Factor 4: Consistency (0-15 points)
  const avgTxPerDay = stats.totalTx / Math.max(stats.activeDays, 1);
  if (avgTxPerDay > 10) score += 15;
  else if (avgTxPerDay > 5) score += 10;
  else if (avgTxPerDay > 2) score += 5;
  
  // Determine tier based on total score (0-100)
  let tier: RarityTier;
  let percentile: string;
  
  if (score >= 85) {
    tier = 'Mythic';
    percentile = "Top 0.1%";
  } else if (score >= 70) {
    tier = 'Legendary';
    percentile = "Top 1%";
  } else if (score >= 55) {
    tier = 'Epic';
    percentile = "Top 5%";
  } else if (score >= 40) {
    tier = 'Rare';
    percentile = "Top 15%";
  } else if (score >= 25) {
    tier = 'Uncommon';
    percentile = "Top 35%";
  } else {
    tier = 'Common';
    percentile = "Top 50%";
  }
  
  return { tier, percentile, score };
}

// =============================================================================
// PERSONA DETECTION (Priority order)
// =============================================================================

function detectPersona(stats: UserStats, rarity: { tier: RarityTier; percentile: string; score: number }): PersonaResult {
  const dominance = stats.totalTx > 0 ? (stats.topChainCount / stats.totalTx) : 0;
  const { categories, activeChains, totalTx, totalGas } = stats;
  
  // MYTHIC TIER (Ultra rare combinations)
  if (rarity.tier === 'Mythic') {
    if (activeChains >= 8 && totalTx > 2000) {
      return {
        title: "THE OMNIPRESENT",
        description: "You exist across all dimensions of the chain.",
        color_theme: COLOR_THEMES.MYTHIC,
        rarity: rarity.tier,
        percentile: "Top 0.1%",
        traits: generateTraits(stats, ['Omnipresent', 'Legendary Volume', 'Multi-Chain God', 'Market Maker'])
      };
    }
    
    if (totalGas > 5000) {
      return {
        title: "THE PLUTOCRAT",
        description: "Your gas fees could fund a small nation.",
        color_theme: COLOR_THEMES.MYTHIC,
        rarity: rarity.tier,
        percentile: "Top 0.1%",
        traits: generateTraits(stats, ['Gas Whale', 'Deep Pockets', 'Power User', 'Network Pillar'])
      };
    }
  }
  
  // LEGENDARY TIER
  if (rarity.tier === 'Legendary') {
    if (activeChains >= 7) {
      return {
        title: "THE ARCHITECT",
        description: "Building the multi-chain future.",
        color_theme: COLOR_THEMES.ARCHITECT,
        rarity: rarity.tier,
        percentile: "Top 1%",
        traits: generateTraits(stats, ['Chain Architect', 'Bridge Master', 'Infrastructure Builder'])
      };
    }
    
    if (categories['DEX'] > 100) {
      return {
        title: "THE MARKET MAKER",
        description: "Liquidity flows through your fingertips.",
        color_theme: COLOR_THEMES.DEGEN,
        rarity: rarity.tier,
        percentile: "Top 1%",
        traits: generateTraits(stats, ['DeFi Veteran', 'LP Provider', 'Yield Maximalist'])
      };
    }
    
    return {
      title: "THE WHALE",
      description: "Your movements make waves.",
      color_theme: COLOR_THEMES.WHALE,
      rarity: rarity.tier,
      percentile: "Top 1%",
      traits: generateTraits(stats, ['Whale Status', 'High Volume', 'Market Mover'])
    };
  }
  
  // CHAIN LOYALTY (>85% on one chain)
  if (dominance > 0.85 && totalTx > 50) {
    const chainPersonas: Record<string, { title: string; desc: string; theme: string }> = {
      'Ethereum': {
        title: "ETH MAXIMALIST",
        desc: "Layer 2? Never heard of it.",
        theme: COLOR_THEMES.ETHEREUM
      },
      'Base': {
        title: "BASED GOD",
        desc: "Onchain summer never ends.",
        theme: COLOR_THEMES.BASE
      },
      'Optimism': {
        title: "THE OPTIMIST",
        desc: "Staying optimistic, staying superchained.",
        theme: COLOR_THEMES.OPTIMISM
      },
      'Arbitrum': {
        title: "ARBITRUM NATIVE",
        desc: "Scaling Ethereum, one tx at a time.",
        theme: COLOR_THEMES.ARBITRUM
      },
      'Polygon': {
        title: "POLYGON PRINCE",
        desc: "Low fees, high conviction.",
        theme: COLOR_THEMES.POLYGON
      },
      'BSC': {
        title: "BSC BARON",
        desc: "Centralized, but efficient.",
        theme: COLOR_THEMES.BSC
      },
      'Avalanche': {
        title: "AVALANCHE APEX",
        desc: "Speed is everything.",
        theme: COLOR_THEMES.AVALANCHE
      },
      'zkSync Era': {
        title: "ZK WIZARD",
        desc: "Privacy through mathematics.",
        theme: COLOR_THEMES.ZKSYNC
      },
      'Blast': {
        title: "BLAST PIONEER",
        desc: "Native yield maximalist.",
        theme: COLOR_THEMES.BLAST
      },
      'Celo': {
        title: "CELO CHAMPION",
        desc: "Mobile-first, impact-driven.",
        theme: COLOR_THEMES.CELO
      }
    };
    
    const persona = chainPersonas[stats.topChain];
    if (persona) {
      return {
        title: persona.title,
        description: persona.desc,
        color_theme: persona.theme,
        rarity: rarity.tier,
        percentile: rarity.percentile,
        traits: generateTraits(stats, [`${stats.topChain} Maxi`, 'Single Chain Focus', 'Deep Specialist'])
      };
    }
  }
  
  // EPIC TIER - BEHAVIORAL ARCHETYPES
  if (rarity.tier === 'Epic') {
    if (categories['BRIDGE'] > 10) {
      return {
        title: "THE NOMAD",
        description: "Home is wherever the alpha is.",
        color_theme: COLOR_THEMES.NOMAD,
        rarity: rarity.tier,
        percentile: rarity.percentile,
        traits: generateTraits(stats, ['Bridge Nomad', 'Multi-Chain Native', 'Alpha Hunter'])
      };
    }
    
    if (categories['NFT'] > 20) {
      return {
        title: "THE COLLECTOR",
        description: "NFTs > Everything.",
        color_theme: COLOR_THEMES.COLLECTOR,
        rarity: rarity.tier,
        percentile: rarity.percentile,
        traits: generateTraits(stats, ['NFT Collector', 'Art Curator', 'JPEG Maximalist'])
      };
    }
    
    return {
      title: "THE OPERATOR",
      description: "Executing strategies with precision.",
      color_theme: COLOR_THEMES.OPERATOR,
      rarity: rarity.tier,
      percentile: rarity.percentile,
      traits: generateTraits(stats, ['Strategic Operator', 'High Activity', 'Power User'])
    };
  }
  
  // RARE TIER
  if (rarity.tier === 'Rare') {
    if (activeChains >= 5) {
      return {
        title: "THE EXPLORER",
        description: "Discovering new chains, finding new opportunities.",
        color_theme: COLOR_THEMES.POLYGLOT,
        rarity: rarity.tier,
        percentile: rarity.percentile,
        traits: generateTraits(stats, ['Chain Explorer', 'Multi-Chain User', 'Early Adopter'])
      };
    }
    
    if (categories['DEX'] > 30) {
      return {
        title: "THE DEGEN",
        description: "Yield farming is a lifestyle.",
        color_theme: COLOR_THEMES.DEGEN,
        rarity: rarity.tier,
        percentile: rarity.percentile,
        traits: generateTraits(stats, ['DeFi Degen', 'Yield Farmer', 'Risk Taker'])
      };
    }
  }
  
  // UNCOMMON TIER
  if (rarity.tier === 'Uncommon') {
    if (activeChains >= 3) {
      return {
        title: "THE WANDERER",
        description: "Testing the waters across chains.",
        color_theme: COLOR_THEMES.NOMAD,
        rarity: rarity.tier,
        percentile: rarity.percentile,
        traits: generateTraits(stats, ['Multi-Chain Curious', 'Explorer', 'Active User'])
      };
    }
    
    if (totalTx > 50) {
      return {
        title: "THE REGULAR",
        description: "Consistent, reliable, present.",
        color_theme: COLOR_THEMES.STRATEGIST,
        rarity: rarity.tier,
        percentile: rarity.percentile,
        traits: generateTraits(stats, ['Active User', 'Consistent', 'Engaged'])
      };
    }
  }
  
  // COMMON TIER (Default)
  if (totalTx < 10) {
    return {
      title: "THE GHOST",
      description: "Barely there, but we see you.",
      color_theme: COLOR_THEMES.GHOST,
      rarity: rarity.tier,
      percentile: rarity.percentile,
      traits: generateTraits(stats, ['Lurker', 'Low Activity'])
    };
  }
  
  return {
    title: "THE TOURIST",
    description: "Just passing through.",
    color_theme: COLOR_THEMES.TOURIST,
    rarity: rarity.tier,
    percentile: rarity.percentile,
    traits: generateTraits(stats, ['Casual User', 'Getting Started'])
  };
}

// =============================================================================
// SMART TRAIT GENERATION (Priority order)
// =============================================================================

function generateTraits(stats: UserStats, baseTraits: string[]): string[] {
  const traits: string[] = [...baseTraits];
  const { totalTx, totalGas, activeChains, categories } = stats;
  
  // Priority 1: Exceptional achievements
  if (totalTx > 5000) traits.unshift('Legendary Volume');
  else if (totalTx > 2000) traits.unshift('Ultra High Volume');
  else if (totalTx > 1000) traits.unshift('High Volume');
  
  if (totalGas > 5000) traits.unshift('Gas Leviathan');
  else if (totalGas > 2000) traits.unshift('Gas Whale');
  else if (totalGas > 1000) traits.unshift('Heavy Spender');
  
  // Priority 2: Multi-chain mastery
  if (activeChains >= 8) traits.push('Chain Omnipresence');
  else if (activeChains >= 6) traits.push('Multi-Chain Master');
  else if (activeChains >= 4) traits.push('Chain Explorer');
  
  // Priority 3: Behavioral patterns
  if (categories['BRIDGE'] > 20) traits.push('Bridge Veteran');
  else if (categories['BRIDGE'] > 10) traits.push('Bridge Power User');
  else if (categories['BRIDGE'] > 5) traits.push('Bridge Hopper');
  
  if (categories['DEX'] > 100) traits.push('DeFi Legend');
  else if (categories['DEX'] > 50) traits.push('DeFi Veteran');
  else if (categories['DEX'] > 20) traits.push('DeFi Native');
  else if (categories['DEX'] > 10) traits.push('DeFi User');
  
  if (categories['NFT'] > 50) traits.push('NFT Whale');
  else if (categories['NFT'] > 20) traits.push('NFT Collector');
  else if (categories['NFT'] > 10) traits.push('NFT Enthusiast');
  
  if (categories['AGGREGATOR'] > 10) traits.push('Efficiency Seeker');
  
  // Priority 4: Activity patterns
  const avgTxPerDay = totalTx / Math.max(stats.activeDays, 1);
  if (avgTxPerDay > 10) traits.push('Daily Power User');
  else if (avgTxPerDay > 5) traits.push('Highly Active');
  
  // Remove duplicates and return top 4 traits
  return [...new Set(traits)].slice(0, 4);
}

// =============================================================================
// EXPORT MAIN FUNCTION
// =============================================================================

export function calculatePersonaAndRarity(
  totalTx: number,
  totalGas: number,
  activeChains: number,
  activeDays: number,
  chainCounts: Record<string, number>,
  categories: Record<string, number>
): PersonaResult {
  const [topChain, topChainCount] = Object.entries(chainCounts)
    .sort((a, b) => b[1] - a[1])[0] || ['None', 0];
  
  const stats: UserStats = {
    totalTx,
    totalGas,
    activeChains,
    activeDays,
    chainCounts,
    categories,
    topChain,
    topChainCount
  };
  
  const rarity = calculateRarity(stats);
  const persona = detectPersona(stats, rarity);
  
  return persona;
}