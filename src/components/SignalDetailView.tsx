import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Clock, TrendingUp, Target, AlertTriangle, Award } from "lucide-react";
import { Signal, QuickSignal, InvestmentOpportunity, TradingStrategy, MarketOutlook } from "../types";
import { Comments } from "./Comments";

interface SignalDetailViewProps {
  signal: Signal;
  onAnalystClick: (fid: number) => void;
}

export function SignalDetailView({ signal, onAnalystClick }: SignalDetailViewProps) {
  const expiryDate = new Date(signal.expiryDate);
  const publishDate = new Date(signal.publishDate);
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">{signal.title}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            {signal.type === "signal" && "Quick Signal"}
            {signal.type === "opportunity" && "Investment Opportunity"}
            {signal.type === "strategy" && "Trading Strategy"}
            {signal.type === "outlook" && "Market Outlook"}
          </Badge>
          <Badge variant="secondary">{signal.category}</Badge>
          <Badge className={
            signal.status === "active" 
              ? "bg-[#00ffcc]/20 text-[#00ffcc] border-[#00ffcc]/30"
              : "bg-muted text-muted-foreground"
          }>
            {signal.status === "active" ? "Active" : "Expired"}
          </Badge>
        </div>
      </div>

      {/* Analyst Card */}
      <Card
        className="p-4 bg-card border-border cursor-pointer hover:border-primary/50 transition-all"
        onClick={() => onAnalystClick(signal.analystFid)}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-primary/30">
            <AvatarImage src={signal.analystImage} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {signal.analystName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-foreground">{signal.analystName}</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#00ffcc] flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {signal.analystSuccessRate}% Success
              </span>
              <span className="text-muted-foreground">
                ⭐ {signal.rating.toFixed(1)} ({signal.reviewCount})
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Dates */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Published: {publishDate.toLocaleDateString("en-US")}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Valid until: {expiryDate.toLocaleDateString("en-US")}</span>
        </div>
      </div>

      {/* Type-specific content */}
      {signal.type === "signal" && <QuickSignalView signal={signal as QuickSignal} />}
      {signal.type === "opportunity" && <OpportunityView signal={signal as InvestmentOpportunity} />}
      {signal.type === "strategy" && <StrategyView signal={signal as TradingStrategy} />}
      {signal.type === "outlook" && <OutlookView signal={signal as MarketOutlook} />}

      {/* Comments Section */}
      <Comments signalId={signal.id} analystFid={signal.analystFid} />
    </div>
  );
}

// Quick Signal View
function QuickSignalView({ signal }: { signal: QuickSignal }) {
  return (
    <>
      {/* Asset & Signal Type */}
      <Card className="p-4 bg-card border-primary/30">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Asset</p>
            <p className="text-foreground">{signal.asset}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Signal Type</p>
            <Badge className={
              signal.signalType === "buy"
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "bg-red-500/20 text-red-400 border-red-500/30"
            }>
              {signal.signalType === "buy" ? "Buy" : "Sell"}
            </Badge>
          </div>
        </div>

        {signal.contractAddress && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">Contract Address</p>
            <p className="text-xs text-foreground font-mono bg-muted p-2 rounded">
              {signal.contractAddress}
            </p>
          </div>
        )}
      </Card>

      {/* Trading Levels */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-foreground mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Trading Levels
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/30">
            <span className="text-xs text-muted-foreground">Entry Point</span>
            <span className="text-green-400">{signal.entryPoint}</span>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Take Profit Targets</p>
            <div className="space-y-2">
              {signal.takeProfitTargets.map((target, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-blue-500/10 rounded border border-blue-500/30">
                  <span className="text-xs text-muted-foreground">Target {i + 1}</span>
                  <span className="text-blue-400">{target}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-red-500/10 rounded border border-red-500/30">
            <span className="text-xs text-muted-foreground">Stop Loss</span>
            <span className="text-red-400">{signal.stopLoss}</span>
          </div>
        </div>
      </Card>

      {/* Description */}
      <Card className="p-4 bg-card border-border">
        <h3 className="text-foreground mb-2">Analysis</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.description}
        </p>
      </Card>
    </>
  );
}

// Investment Opportunity View
function OpportunityView({ signal }: { signal: InvestmentOpportunity }) {
  return (
    <>
      <Card className="p-4 bg-card border-primary/30">
        <h3 className="text-foreground mb-3">Overview</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Asset Description</p>
            <p className="text-sm text-foreground">{signal.assetDescription}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current Price</p>
              <p className="text-foreground">{signal.currentPrice}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Buy Range</p>
              <p className="text-[#00ffcc]">{signal.buyRange}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <h3 className="text-foreground mb-2 flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          Fundamental Analysis
        </h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.fundamentals}
        </p>
      </Card>

      <Card className="p-4 bg-card border-border">
        <h3 className="text-foreground mb-2">Technical Analysis</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.technicals}
        </p>
      </Card>

      <Card className="p-4 bg-card border-green-500/20">
        <h3 className="text-foreground mb-2 flex items-center gap-2">
          <Target className="h-4 w-4 text-green-400" />
          Target Price
        </h3>
        <p className="text-green-400">{signal.targetPrice}</p>
      </Card>

      <Card className="p-4 bg-card border-red-500/20">
        <h3 className="text-foreground mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          Risks
        </h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.risks}
        </p>
      </Card>

      {signal.comparison && (
        <Card className="p-4 bg-card border-border">
          <h3 className="text-foreground mb-2">Comparison with Alternatives</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {signal.comparison}
          </p>
        </Card>
      )}
    </>
  );
}

// Trading Strategy View
function StrategyView({ signal }: { signal: TradingStrategy }) {
  return (
    <>
      <Card className="p-4 bg-card border-primary/30">
        <h3 className="text-foreground mb-2">Core Trading Idea</h3>
        <p className="text-sm text-muted-foreground">{signal.coreIdea}</p>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Market Type</p>
            <p className="text-sm text-foreground">{signal.marketType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Timeframe</p>
            <p className="text-sm text-foreground">{signal.timeframe}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-green-500/20">
        <h3 className="text-foreground mb-2">Entry Conditions</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.entryConditions}
        </p>
      </Card>

      <Card className="p-4 bg-card border-red-500/20">
        <h3 className="text-foreground mb-2">Exit Conditions</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.exitConditions}
        </p>
      </Card>

      <Card className="p-4 bg-card border-border">
        <h3 className="text-foreground mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[#00ffcc]" />
          Risk Management
        </h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.riskManagement}
        </p>
      </Card>

      <Card className="p-4 bg-card border-border">
        <h3 className="text-foreground mb-2">Technical Tools</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.technicalTools}
        </p>
      </Card>

      <Card className="p-4 bg-card border-border">
        <h3 className="text-foreground mb-2">Trade Management</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.tradeManagement}
        </p>
      </Card>

      <Card className="p-4 bg-card border-primary/30">
        <h3 className="text-foreground mb-2">Psychology Tips</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.psychologyTips}
        </p>
      </Card>

      {signal.performanceMetrics && (
        <Card className="p-4 bg-card border-border">
          <h3 className="text-foreground mb-2">Performance Metrics</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {signal.performanceMetrics}
          </p>
        </Card>
      )}
    </>
  );
}

// Market Outlook View
function OutlookView({ signal }: { signal: MarketOutlook }) {
  return (
    <>
      <Card className="p-4 bg-card border-primary/30">
        <h3 className="text-foreground mb-2">Target Market</h3>
        <p className="text-sm text-foreground">{signal.targetMarket}</p>
      </Card>

      <Card className="p-4 bg-card border-border">
        <h3 className="text-foreground mb-2">Macro Economic Factors</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.macroFactors}
        </p>
      </Card>

      <Card className="p-4 bg-card border-border">
        <h3 className="text-foreground mb-2">Innovation Trends</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.innovationTrends}
        </p>
      </Card>

      <Card className="p-4 bg-card border-red-500/20">
        <h3 className="text-foreground mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          Major Risks
        </h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {signal.majorRisks}
        </p>
      </Card>

      <Card className="p-4 bg-card border-border">
        <h3 className="text-foreground mb-3">Future Scenarios</h3>
        <div className="space-y-3">
          <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
            <p className="text-xs text-green-400 mb-1">Optimistic</p>
            <p className="text-sm text-muted-foreground">{signal.scenarios.optimistic}</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
            <p className="text-xs text-blue-400 mb-1">Base Case</p>
            <p className="text-sm text-muted-foreground">{signal.scenarios.base}</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
            <p className="text-xs text-red-400 mb-1">Pessimistic</p>
            <p className="text-sm text-muted-foreground">{signal.scenarios.pessimistic}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-primary/30">
        <h3 className="text-foreground mb-2">Strategic Recommendation</h3>
        <p className="text-sm text-[#00ffcc] whitespace-pre-line">
          {signal.strategicRecommendation}
        </p>
      </Card>
    </>
  );
}
