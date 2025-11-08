// Web3 Professional Terminology - English
export const SIGNAL_TYPES = {
  signal: "Quick Signal",
  opportunity: "Investment Opportunity", 
  strategy: "Trading Strategy",
  outlook: "Market Outlook"
} as const;

export const CATEGORIES = {
  Bitcoin: "Bitcoin",
  Onchain: "On-chain",
  DeFi: "DeFi",
  Memecoin: "Memecoins",
  "Developer Activity": "Dev Activity",
  NFT: "NFTs",
  Apps: "dApps",
  Forex: "Forex",
  Stocks: "Stocks",
  All: "All"
} as const;

export const UI_TEXT = {
  // Navigation
  home: "Explore",
  create: "Create",
  analysts: "Analysts",
  
  // Actions
  buy: "Buy Now",
  publish: "Publish Signal",
  follow: "Follow",
  unfollow: "Unfollow",
  notifications: "Notifications",
  enableNotifications: "Enable Alerts",
  disableNotifications: "Disable Alerts",
  
  // Status
  active: "Active",
  expired: "Expired",
  completed: "Completed",
  
  // Filters
  filterByType: "Filter by Type",
  filterByCategory: "Category",
  search: "Search signals...",
  searchAnalysts: "Search analysts...",
  
  // Stats
  successRate: "Success Rate",
  totalSignals: "Total Signals",
  earnings: "Earnings",
  followers: "Followers",
  rating: "Rating",
  
  // Signal Details
  analyst: "Analyst",
  published: "Published",
  validUntil: "Valid Until",
  priceLabel: "Price",
  
  // Purchase
  purchaseSignal: "Purchase Signal",
  unlockContent: "Unlock Full Analysis",
  connectedWallet: "Connected Wallet",
  balance: "Balance",
  premiumContent: "Premium Content",
  
  // Profile
  profile: "Profile",
  publishedSignals: "Published",
  purchasedSignals: "Purchased",
  mySignals: "My Signals",
  myPurchases: "Purchases",
  
  // Comments & Discussion
  comments: "Discussion",
  addComment: "Share your thoughts...",
  reply: "Reply",
  postComment: "Post",
  noComments: "No comments yet. Be the first to share your thoughts!",
  
  // Loading
  loading: "Loading...",
  noResults: "No results found",
  resetFilters: "Reset Filters",
  
  // Toast Messages
  purchaseSuccess: "Signal unlocked successfully! 🎉",
  publishSuccess: "Signal published on Farcaster! 🚀",
  followSuccess: "Now following analyst",
  unfollowSuccess: "Unfollowed analyst",
  ratingSuccess: "Thanks for your rating! ⭐",
  notificationsEnabled: "Notifications enabled",
  notificationsDisabled: "Notifications disabled",
  
  // Trading Terms
  entryPoint: "Entry Point",
  takeProfitTargets: "Take Profit Targets",
  stopLoss: "Stop Loss",
  tradingLevels: "Trading Levels",
  analysis: "Analysis",
  asset: "Asset",
  signalType: "Signal Type",
  contractAddress: "Contract Address",
  
  // Investment Terms
  overview: "Overview",
  assetDescription: "Asset Description",
  currentPrice: "Current Price",
  buyRange: "Buy Range",
  fundamentalAnalysis: "Fundamental Analysis",
  technicalAnalysis: "Technical Analysis",
  targetPrice: "Target Price",
  risks: "Risks",
  comparison: "Comparison with Alternatives",
  
  // Strategy Terms
  coreIdea: "Core Trading Idea",
  marketType: "Market Type",
  timeframe: "Timeframe",
  entryConditions: "Entry Conditions",
  exitConditions: "Exit Conditions",
  riskManagement: "Risk Management",
  technicalTools: "Technical Tools",
  tradeManagement: "Trade Management",
  psychologyTips: "Psychology Tips",
  performanceMetrics: "Performance Metrics",
  
  // Outlook Terms
  targetMarket: "Target Market",
  macroFactors: "Macro Economic Factors",
  innovationTrends: "Innovation Trends",
  majorRisks: "Major Risks",
  futureScenarios: "Future Scenarios",
  optimisticScenario: "Optimistic",
  baseScenario: "Base Case",
  pessimisticScenario: "Pessimistic",
  strategicRecommendation: "Strategic Recommendation",
  
  // Form Labels
  signalTitle: "Signal Title",
  category: "Category",
  price: "Price (ETH)",
  validity: "Validity",
  uploadImage: "Upload chart image",
  imageUploaded: "Image uploaded",
  selectSignalType: "Select Signal Type",
  fillDetails: "Fill in the details",
  
  // Wallet
  connectWallet: "Connect Wallet",
  walletConnected: "Wallet Connected",
  pleaseConnectWallet: "Please connect wallet first",
  
  // Time
  validFor: "Valid for",
  hours: "h",
  days: "d",
  
  // Misc
  goBack: "Go Back",
  signalNotFound: "Signal not found",
  later: "Later",
  cancel: "Cancel",
  confirm: "Confirm",
  processing: "Processing..."
} as const;
