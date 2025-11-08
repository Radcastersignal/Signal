// Mock data for development and testing
import { Signal, QuickSignal, InvestmentOpportunity, TradingStrategy, MarketForesight, GeneralSignal } from '../types';

// Generate mock signals
export function generateMockSignals(): Signal[] {
  const signals: Signal[] = [];
  
  // General Signal 1
  const signal0: GeneralSignal = {
    id: "signal-0",
    type: "general",
    title: "Clanker Token Launch Alert",
    category: "Clancker",
    price: 0.015,
    publishDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    status: "active",
    analystFid: 4,
    analystName: "TokenHunter",
    analystImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop",
    analystSuccessRate: 88,
    rating: 4.9,
    reviewCount: 145,
    purchaseCount: 78,
    market: "Farcaster Ecosystem",
    description: "Strong fundamentals for new Clanker token launch. Early community engagement shows promising metrics. Expected price movement based on similar launches.",
    targetPrice: "$0.05 - $0.08"
  };
  
  // Quick Signal 1
  const signal1: QuickSignal = {
    id: "signal-1",
    type: "signal",
    title: "ETH Inflows Up 8%",
    category: "Crypto",
    price: 0.02,
    publishDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    status: "active",
    analystFid: 1,
    analystName: "CryptoMax",
    analystImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
    analystSuccessRate: 84,
    rating: 4.8,
    reviewCount: 127,
    purchaseCount: 89,
    signalType: "buy",
    asset: "ETH/USD",
    entryPoint: "$3,420",
    takeProfitTargets: ["$3,580", "$3,650", "$3,720"],
    stopLoss: "$3,320",
    description: "Strong ETH inflows to exchanges, with 8% increase in activity. Positive technical indicators on 4H timeframe."
  };
  
  // Investment Opportunity 1
  const signal2: InvestmentOpportunity = {
    id: "signal-2",
    type: "opportunity",
    title: "Base L2 Growth Opportunity",
    category: "Base App",
    price: 0.035,
    publishDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
    status: "active",
    analystFid: 3,
    analystName: "DeFiGuru",
    analystImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    analystSuccessRate: 91,
    rating: 4.9,
    reviewCount: 89,
    purchaseCount: 56,
    assetDescription: "Coinbase's Base L2 ecosystem tokens showing strong fundamentals",
    currentPrice: "$1.2 - $1.5",
    buyRange: "$1.0 - $1.3",
    fundamentals: "Strong developer activity, growing TVL, institutional backing from Coinbase",
    technicals: "Support at $1.0, resistance at $1.8. RSI oversold on weekly chart",
    targetPrice: "$2.5 - $3.0 (3-6 months)",
    risks: "Market volatility, competition from other L2s, regulatory uncertainty"
  };
  
  // Trading Strategy 1
  const signal3: TradingStrategy = {
    id: "signal-3",
    type: "strategy",
    title: "Memecoin Breakout Strategy",
    category: "Pumping",
    price: 0.045,
    publishDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    status: "active",
    analystFid: 2,
    analystName: "MemeAnalyst",
    analystImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop",
    analystSuccessRate: 76,
    rating: 4.5,
    reviewCount: 215,
    purchaseCount: 134,
    coreIdea: "Trade memecoin breakouts during high social media activity using volume confirmation",
    marketType: "Memecoins on Base & Ethereum",
    timeframe: "4H - 1D (Swing Trading)",
    entryConditions: "1) Volume spike >200% average 2) Break above resistance 3) Trending on social media",
    exitConditions: "1) Take profit at 30-50% gains 2) Exit on volume decline 3) Trailing stop at 15%",
    riskManagement: "Risk 2% per trade. Position size based on volatility. Max 3 concurrent positions",
    technicalTools: "Volume Profile, RSI (30/70), Social Sentiment Tracking",
    tradeManagement: "Scale out 50% at first target. Move stop to breakeven. Let 50% run with trailing stop",
    psychologyTips: "Memecoins are volatile. Stick to plan. Don't FOMO. Take profits regularly"
  };
  
  // Market Foresight 1
  const signal4: MarketForesight = {
    id: "signal-4",
    type: "foresight",
    title: "Crypto Market Q2 2025 Foresight",
    category: "Crypto",
    price: 0.055,
    publishDate: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),
    status: "active",
    analystFid: 1,
    analystName: "CryptoMax",
    analystImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
    analystSuccessRate: 84,
    rating: 4.7,
    reviewCount: 56,
    purchaseCount: 42,
    targetMarket: "Cryptocurrency & Digital Assets",
    macroFactors: "Fed rate cuts expected, institutional adoption accelerating, Bitcoin ETF inflows strong",
    innovationTrends: "Layer 2 scaling, AI + Crypto convergence, Real World Assets tokenization",
    majorRisks: "Regulatory crackdowns, geopolitical tensions, market manipulation",
    scenarios: {
      optimistic: "BTC reaches $150k, altseason begins, mass adoption accelerates",
      base: "BTC ranges $80k-$100k, steady DeFi growth, selective altcoin pumps",
      pessimistic: "BTC drops to $50k, bear market returns, regulatory pressure increases"
    },
    strategicRecommendation: "Accumulate quality assets during dips. Focus on BTC, ETH, and proven DeFi protocols. Take profits on pumps."
  };
  
  signals.push(signal0, signal1, signal2, signal3, signal4);
  
  // Add more mock signals
  for (let i = 5; i <= 10; i++) {
    const types: Signal["type"][] = ["general", "signal", "opportunity", "strategy", "foresight"];
    const type = types[i % 5];
    
    const baseSignal: QuickSignal = {
      id: `signal-${i}`,
      type: "signal",
      title: `Trading Signal #${i}`,
      category: ["General", "Crypto", "DeFi", "NFT", "Pumping"][i % 5] as any,
      price: 0.01 + (i * 0.005),
      publishDate: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + (24 - i) * 60 * 60 * 1000).toISOString(),
      status: i % 3 === 0 ? "expired" : "active",
      analystFid: (i % 3) + 1,
      analystName: ["CryptoMax", "MemeAnalyst", "DeFiGuru"][i % 3],
      analystImage: `https://images.unsplash.com/photo-${1535713875002 + i}?w=200&h=200&fit=crop`,
      analystSuccessRate: 70 + (i % 25),
      rating: 4.0 + (i % 10) / 10,
      reviewCount: 50 + i * 10,
      purchaseCount: 30 + i * 5,
      signalType: i % 2 === 0 ? "buy" : "sell",
      asset: "BTC/USD",
      entryPoint: "$90,000",
      takeProfitTargets: ["$95,000", "$100,000"],
      stopLoss: "$85,000",
      description: `Mock signal description for signal ${i}`
    };
    
    signals.push(baseSignal);
  }
  
  return signals;
}

// Initialize mock data in the backend
export async function initializeMockData() {
  // This would be called on app initialization to populate the database
  console.log("🎭 Mock data ready for development");
}
