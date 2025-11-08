// Type definitions for Data Signals Hub

export type SignalType = "general" | "signal" | "opportunity" | "strategy" | "foresight";

export type SignalCategory = 
  | "All"
  | "General"
  | "Clancker"
  | "Zora"
  | "Base App"
  | "NFT"
  | "DeFi"
  | "Crypto"
  | "Pumping";

export type SignalStatus = "active" | "expired" | "completed";

export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  bio: string;
  followerCount: number;
  walletAddress?: string;
}

export interface BaseSignal {
  id: string;
  type: SignalType;
  title: string;
  category: SignalCategory;
  price: number; // in ETH
  publishDate: string;
  expiryDate: string;
  status: SignalStatus;
  analystFid: number;
  analystName: string;
  analystImage: string;
  analystSuccessRate: number;
  rating: number;
  reviewCount: number;
  purchaseCount: number; // Number of buyers
  imageUrl?: string;
}

// Signal (Quick Trade Signal)
export interface QuickSignal extends BaseSignal {
  type: "signal";
  signalType: "buy" | "sell";
  asset: string; // e.g., "BTC/USD", "ETH"
  contractAddress?: string;
  entryPoint: string;
  takeProfitTargets: string[];
  stopLoss: string;
  description: string;
  chartImage?: string;
}

// Investment Opportunity
export interface InvestmentOpportunity extends BaseSignal {
  type: "opportunity";
  assetDescription: string;
  currentPrice: string;
  buyRange: string;
  fundamentals: string;
  technicals: string;
  targetPrice: string;
  risks: string;
  comparison?: string;
  chartImage?: string;
}

// Trading Strategy
export interface TradingStrategy extends BaseSignal {
  type: "strategy";
  coreIdea: string;
  marketType: string;
  timeframe: string;
  entryConditions: string;
  exitConditions: string;
  riskManagement: string;
  technicalTools: string;
  tradeManagement: string;
  psychologyTips: string;
  performanceMetrics?: string;
  chartImage?: string;
}

// Foresight (formerly Outlook/Vision)
export interface MarketForesight extends BaseSignal {
  type: "foresight";
  targetMarket: string;
  macroFactors: string;
  innovationTrends: string;
  majorRisks: string;
  scenarios: {
    optimistic: string;
    base: string;
    pessimistic: string;
  };
  strategicRecommendation: string;
  chartImage?: string;
}

// General Signal
export interface GeneralSignal extends BaseSignal {
  type: "general";
  market: string;
  description: string;
  chartImage?: string;
  targetPrice?: string;
}

export type Signal = GeneralSignal | QuickSignal | InvestmentOpportunity | TradingStrategy | MarketForesight;

export interface Purchase {
  id: string;
  signalId: string;
  buyerFid: number;
  amount: number; // in ETH
  timestamp: string;
  quickRating?: number; // 1-5 stars
  finalRating?: "success" | "loss" | null;
}

export interface Review {
  id: string;
  signalId: string;
  userFid: number;
  userName: string;
  userImage: string;
  rating: number;
  comment?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userFid: number;
  type: "new_signal" | "expiry_reminder" | "rating_request" | "purchase_success";
  signalId?: string;
  analystName?: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AnalystStats {
  fid: number;
  totalSignals: number;
  activeSignals: number;
  successRate: number;
  totalEarnings: number; // in ETH
  totalSales: number; // Total number of sales across all signals
  followers: number;
  rating: number;
}
