import { ArrowLeft, Upload, Check, Zap, TrendingUp, Target, Eye, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { useState } from "react";
import { SignalType } from "../types";

interface CreateSignalPageProps {
  onBack: () => void;
  onPublish: () => void;
}

// Validity/Timeframe options
const VALIDITY_OPTIONS = [
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "30m", label: "30m" },
  { value: "1h", label: "1h" },
  { value: "2h", label: "2h" },
  { value: "3h", label: "3h" },
  { value: "4h", label: "4h" },
  { value: "1d", label: "1d" },
  { value: "2d", label: "2d" },
  { value: "3d", label: "3d" },
  { value: "5d", label: "5d" },
  { value: "1w", label: "1w" },
  { value: "2w", label: "2w" },
  { value: "3w", label: "3w" },
  { value: "1M", label: "1M" },
  { value: "2M", label: "2M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1y", label: "1y" },
  { value: "2y", label: "2y" },
  { value: "3y", label: "3y" },
  { value: "5y", label: "5y" },
  { value: "10y", label: "10y" }
];

const CATEGORIES = [
  "General",
  "Clancker",
  "Zora",
  "Base App",
  "NFT",
  "DeFi",
  "Crypto",
  "Pumping"
];

export function CreateSignalPage({ onBack, onPublish }: CreateSignalPageProps) {
  const [selectedType, setSelectedType] = useState<SignalType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePublish = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onPublish();
    }, 1500);
  };

  // If no type selected, show type selector
  if (!selectedType) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 p-4 border-b border-border flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-foreground">Create Signal</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-foreground mb-2">Select Signal Type</h3>
            <p className="text-sm text-muted-foreground">
              Choose the type of signal you want to create
            </p>
          </div>

          <div className="space-y-3">
            <Card
              className="p-4 bg-card border-border hover:border-primary/50 cursor-pointer transition-all"
              onClick={() => setSelectedType("general")}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00ffcc]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-[#00ffcc]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-foreground mb-1">General</h4>
                  <p className="text-xs text-muted-foreground">
                    Flexible signal format for any market insight or opportunity
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="p-4 bg-card border-border hover:border-primary/50 cursor-pointer transition-all"
              onClick={() => setSelectedType("signal")}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-foreground mb-1">Quick Signal</h4>
                  <p className="text-xs text-muted-foreground">
                    Fast trading signal with entry/exit points and stop loss
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="p-4 bg-card border-border hover:border-primary/50 cursor-pointer transition-all"
              onClick={() => setSelectedType("opportunity")}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-foreground mb-1">Investment Opportunity</h4>
                  <p className="text-xs text-muted-foreground">
                    Long-term investment analysis with fundamentals and technicals
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="p-4 bg-card border-border hover:border-primary/50 cursor-pointer transition-all"
              onClick={() => setSelectedType("strategy")}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-foreground mb-1">Trading Strategy</h4>
                  <p className="text-xs text-muted-foreground">
                    Complete trading strategy with rules and risk management
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="p-4 bg-card border-border hover:border-primary/50 cursor-pointer transition-all"
              onClick={() => setSelectedType("foresight")}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Eye className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-foreground mb-1">Market Foresight</h4>
                  <p className="text-xs text-muted-foreground">
                    Long-term market vision with macro analysis and scenarios
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show form based on selected type
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4 border-b border-border flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedType(null)}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-foreground">
            {selectedType === "general" && "General"}
            {selectedType === "signal" && "Quick Signal"}
            {selectedType === "opportunity" && "Investment Opportunity"}
            {selectedType === "strategy" && "Trading Strategy"}
            {selectedType === "foresight" && "Market Foresight"}
          </h2>
          <p className="text-xs text-muted-foreground">Fill in the details</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedType === "general" && <GeneralForm onPublish={handlePublish} showSuccess={showSuccess} />}
        {selectedType === "signal" && <QuickSignalForm onPublish={handlePublish} showSuccess={showSuccess} />}
        {selectedType === "opportunity" && <OpportunityForm onPublish={handlePublish} showSuccess={showSuccess} />}
        {selectedType === "strategy" && <StrategyForm onPublish={handlePublish} showSuccess={showSuccess} />}
        {selectedType === "foresight" && <ForesightForm onPublish={handlePublish} showSuccess={showSuccess} />}
      </div>
    </div>
  );
}

// General Form
function GeneralForm({ onPublish, showSuccess }: { onPublish: () => void; showSuccess: boolean }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [market, setMarket] = useState("");
  const [description, setDescription] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [validity, setValidity] = useState("");
  const [price, setPrice] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g., Clanker Token Launch Alert"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-input-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className="bg-input-background border-border">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="market">Market</Label>
        <Input
          id="market"
          placeholder="e.g., Farcaster Ecosystem, DeFi"
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          className="bg-input-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description / Analysis</Label>
        <Textarea
          id="description"
          placeholder="Explain your insights, analysis, and reasoning..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Chart / Analysis Image</Label>
        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
          onClick={() => setImageUploaded(!imageUploaded)}
        >
          {imageUploaded ? (
            <div className="flex flex-col items-center gap-2">
              <Check className="h-8 w-8 text-[#00ffcc]" />
              <p className="text-[#00ffcc]">Image uploaded</p>
              <p className="text-xs text-muted-foreground">Click to change</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Upload chart image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetPrice">Target Price (Optional)</Label>
        <Input
          id="targetPrice"
          placeholder="e.g., $0.05 - $0.08"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          className="bg-input-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="validity">Validity Period</Label>
        <Select value={validity} onValueChange={setValidity}>
          <SelectTrigger id="validity" className="bg-input-background border-border">
            <SelectValue placeholder="Select validity" />
          </SelectTrigger>
          <SelectContent>
            {VALIDITY_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Input - Before Publish Button */}
      <div className="pt-4 mt-4 border-t border-border">
        <div className="space-y-2 max-w-xs mx-auto">
          <Label htmlFor="price" className="text-center block">Signal Price (ETH)</Label>
          <Input
            id="price"
            type="number"
            step="0.001"
            placeholder="0.015"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-primary/10 border-primary/30 text-center text-lg"
          />
          <p className="text-xs text-muted-foreground text-center">Set your signal price in ETH</p>
        </div>
      </div>

      {/* Publish Button */}
      <div className="pt-4">
        <Button
          onClick={onPublish}
          className="w-full bg-primary hover:bg-primary/90 h-12"
          disabled={showSuccess}
        >
          {showSuccess ? (
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Published Successfully!
            </span>
          ) : (
            "Publish Signal"
          )}
        </Button>
      </div>
    </div>
  );
}

// Quick Signal Form
function QuickSignalForm({ onPublish, showSuccess }: { onPublish: () => void; showSuccess: boolean }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [signalType, setSignalType] = useState("");
  const [asset, setAsset] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [entryPoint, setEntryPoint] = useState("");
  const [takeProfit1, setTakeProfit1] = useState("");
  const [takeProfit2, setTakeProfit2] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [validity, setValidity] = useState("");
  const [price, setPrice] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Signal Title</Label>
        <Input
          id="title"
          placeholder="e.g., BTC Breakout Signal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-input-background border-border"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="bg-input-background border-border">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signalType">Signal Type</Label>
          <Select value={signalType} onValueChange={setSignalType}>
            <SelectTrigger id="signalType" className="bg-input-background border-border">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="asset">Asset / Trading Pair</Label>
        <Input
          id="asset"
          placeholder="e.g., BTC/USD, ETH"
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          className="bg-input-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contract">Contract Address (Optional)</Label>
        <Input
          id="contract"
          placeholder="0x..."
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="bg-input-background border-border font-mono text-sm"
        />
      </div>

      <Card className="p-4 bg-card border-primary/30 space-y-3">
        <h3 className="text-primary flex items-center gap-2">
          <Target className="h-4 w-4" />
          Trading Levels
        </h3>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="entry" className="text-xs">Entry Point</Label>
            <Input
              id="entry"
              placeholder="$42,000"
              value={entryPoint}
              onChange={(e) => setEntryPoint(e.target.value)}
              className="bg-input-background border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tp1" className="text-xs">Take Profit Target 1</Label>
            <Input
              id="tp1"
              placeholder="$45,000"
              value={takeProfit1}
              onChange={(e) => setTakeProfit1(e.target.value)}
              className="bg-input-background border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tp2" className="text-xs">Take Profit Target 2 (Optional)</Label>
            <Input
              id="tp2"
              placeholder="$48,000"
              value={takeProfit2}
              onChange={(e) => setTakeProfit2(e.target.value)}
              className="bg-input-background border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stoploss" className="text-xs">Stop Loss</Label>
            <Input
              id="stoploss"
              placeholder="$40,000"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="bg-input-background border-border"
            />
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <Label>Chart / Analysis Image</Label>
        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
          onClick={() => setImageUploaded(!imageUploaded)}
        >
          {imageUploaded ? (
            <div className="flex flex-col items-center gap-2">
              <Check className="h-8 w-8 text-[#00ffcc]" />
              <p className="text-[#00ffcc]">Image uploaded</p>
              <p className="text-xs text-muted-foreground">Click to change</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Upload chart image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="analysis">Analysis & Interpretation</Label>
        <Textarea
          id="analysis"
          placeholder="Explain the key indicators, reasoning, and risk assessment..."
          value={analysis}
          onChange={(e) => setAnalysis(e.target.value)}
          rows={6}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="validity">Validity Period</Label>
        <Select value={validity} onValueChange={setValidity}>
          <SelectTrigger id="validity" className="bg-input-background border-border">
            <SelectValue placeholder="Select validity" />
          </SelectTrigger>
          <SelectContent>
            {VALIDITY_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Input - Before Publish Button */}
      <div className="pt-4 mt-4 border-t border-border">
        <div className="space-y-2 max-w-xs mx-auto">
          <Label htmlFor="price" className="text-center block">Signal Price (ETH)</Label>
          <Input
            id="price"
            type="number"
            step="0.001"
            placeholder="0.02"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-primary/10 border-primary/30 text-center text-lg"
          />
          <p className="text-xs text-muted-foreground text-center">Set your signal price in ETH</p>
        </div>
      </div>

      {/* Publish Button */}
      <div className="pt-4">
        <Button
          onClick={onPublish}
          className="w-full bg-primary hover:bg-primary/90 h-12"
          disabled={showSuccess}
        >
          {showSuccess ? (
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Published Successfully!
            </span>
          ) : (
            "Publish Signal"
          )}
        </Button>
      </div>
    </div>
  );
}

// Opportunity Form (continuing in next part due to length...)
function OpportunityForm({ onPublish, showSuccess }: { onPublish: () => void; showSuccess: boolean }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [assetDescription, setAssetDescription] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [buyRange, setBuyRange] = useState("");
  const [fundamentals, setFundamentals] = useState("");
  const [technicals, setTechnicals] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [risks, setRisks] = useState("");
  const [comparison, setComparison] = useState("");
  const [validity, setValidity] = useState("");
  const [price, setPrice] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Opportunity Title</Label>
        <Input
          id="title"
          placeholder="e.g., Base L2 Growth Opportunity"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-input-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className="bg-input-background border-border">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assetDesc">Asset Description</Label>
        <Textarea
          id="assetDesc"
          placeholder="Brief description of the asset or opportunity..."
          value={assetDescription}
          onChange={(e) => setAssetDescription(e.target.value)}
          rows={3}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="currentPrice">Current Price</Label>
          <Input
            id="currentPrice"
            placeholder="$1.2 - $1.5"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            className="bg-input-background border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buyRange">Buy Range</Label>
          <Input
            id="buyRange"
            placeholder="$1.0 - $1.3"
            value={buyRange}
            onChange={(e) => setBuyRange(e.target.value)}
            className="bg-input-background border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fundamentals">Fundamentals</Label>
        <Textarea
          id="fundamentals"
          placeholder="Fundamental analysis: team, technology, partnerships..."
          value={fundamentals}
          onChange={(e) => setFundamentals(e.target.value)}
          rows={4}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="technicals">Technicals</Label>
        <Textarea
          id="technicals"
          placeholder="Technical analysis: support/resistance, indicators..."
          value={technicals}
          onChange={(e) => setTechnicals(e.target.value)}
          rows={4}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetPrice">Target Price</Label>
        <Input
          id="targetPrice"
          placeholder="$2.5 - $3.0 (3-6 months)"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          className="bg-input-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="risks">Risks</Label>
        <Textarea
          id="risks"
          placeholder="Main risks and challenges to consider..."
          value={risks}
          onChange={(e) => setRisks(e.target.value)}
          rows={3}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comparison">Comparison (Optional)</Label>
        <Textarea
          id="comparison"
          placeholder="Compare with similar projects or assets..."
          value={comparison}
          onChange={(e) => setComparison(e.target.value)}
          rows={3}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Chart / Analysis Image</Label>
        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
          onClick={() => setImageUploaded(!imageUploaded)}
        >
          {imageUploaded ? (
            <div className="flex flex-col items-center gap-2">
              <Check className="h-8 w-8 text-[#00ffcc]" />
              <p className="text-[#00ffcc]">Image uploaded</p>
              <p className="text-xs text-muted-foreground">Click to change</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Upload chart image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="validity">Validity Period</Label>
        <Select value={validity} onValueChange={setValidity}>
          <SelectTrigger id="validity" className="bg-input-background border-border">
            <SelectValue placeholder="Select validity" />
          </SelectTrigger>
          <SelectContent>
            {VALIDITY_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Input - Before Publish Button */}
      <div className="pt-4 mt-4 border-t border-border">
        <div className="space-y-2 max-w-xs mx-auto">
          <Label htmlFor="price" className="text-center block">Signal Price (ETH)</Label>
          <Input
            id="price"
            type="number"
            step="0.001"
            placeholder="0.035"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-primary/10 border-primary/30 text-center text-lg"
          />
          <p className="text-xs text-muted-foreground text-center">Set your signal price in ETH</p>
        </div>
      </div>

      {/* Publish Button */}
      <div className="pt-4">
        <Button
          onClick={onPublish}
          className="w-full bg-primary hover:bg-primary/90 h-12"
          disabled={showSuccess}
        >
          {showSuccess ? (
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Published Successfully!
            </span>
          ) : (
            "Publish Signal"
          )}
        </Button>
      </div>
    </div>
  );
}

// Strategy Form
function StrategyForm({ onPublish, showSuccess }: { onPublish: () => void; showSuccess: boolean }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [coreIdea, setCoreIdea] = useState("");
  const [marketType, setMarketType] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [entryConditions, setEntryConditions] = useState("");
  const [exitConditions, setExitConditions] = useState("");
  const [riskManagement, setRiskManagement] = useState("");
  const [technicalTools, setTechnicalTools] = useState("");
  const [tradeManagement, setTradeManagement] = useState("");
  const [psychologyTips, setPsychologyTips] = useState("");
  const [performanceMetrics, setPerformanceMetrics] = useState("");
  const [validity, setValidity] = useState("");
  const [price, setPrice] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Strategy Title</Label>
        <Input
          id="title"
          placeholder="e.g., Memecoin Breakout Strategy"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-input-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className="bg-input-background border-border">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coreIdea">Core Idea</Label>
        <Textarea
          id="coreIdea"
          placeholder="Main concept and philosophy of the strategy..."
          value={coreIdea}
          onChange={(e) => setCoreIdea(e.target.value)}
          rows={3}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="marketType">Market Type</Label>
          <Input
            id="marketType"
            placeholder="e.g., Crypto, Forex"
            value={marketType}
            onChange={(e) => setMarketType(e.target.value)}
            className="bg-input-background border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeframe">Timeframe</Label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger id="timeframe" className="bg-input-background border-border">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {VALIDITY_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="entryConditions">Entry Conditions</Label>
        <Textarea
          id="entryConditions"
          placeholder="When to enter the trade..."
          value={entryConditions}
          onChange={(e) => setEntryConditions(e.target.value)}
          rows={4}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="exitConditions">Exit Conditions</Label>
        <Textarea
          id="exitConditions"
          placeholder="When to exit the trade..."
          value={exitConditions}
          onChange={(e) => setExitConditions(e.target.value)}
          rows={4}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="riskManagement">Risk Management</Label>
        <Textarea
          id="riskManagement"
          placeholder="Position sizing, stop loss rules..."
          value={riskManagement}
          onChange={(e) => setRiskManagement(e.target.value)}
          rows={4}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="technicalTools">Technical Tools</Label>
        <Textarea
          id="technicalTools"
          placeholder="Indicators and tools used..."
          value={technicalTools}
          onChange={(e) => setTechnicalTools(e.target.value)}
          rows={3}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tradeManagement">Trade Management</Label>
        <Textarea
          id="tradeManagement"
          placeholder="How to manage the trade once in..."
          value={tradeManagement}
          onChange={(e) => setTradeManagement(e.target.value)}
          rows={4}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="psychologyTips">Psychology Tips</Label>
        <Textarea
          id="psychologyTips"
          placeholder="Mental discipline and emotional management..."
          value={psychologyTips}
          onChange={(e) => setPsychologyTips(e.target.value)}
          rows={3}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="performanceMetrics">Performance Metrics (Optional)</Label>
        <Textarea
          id="performanceMetrics"
          placeholder="Backtest results, win rate, profit factor..."
          value={performanceMetrics}
          onChange={(e) => setPerformanceMetrics(e.target.value)}
          rows={3}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Chart / Analysis Image</Label>
        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
          onClick={() => setImageUploaded(!imageUploaded)}
        >
          {imageUploaded ? (
            <div className="flex flex-col items-center gap-2">
              <Check className="h-8 w-8 text-[#00ffcc]" />
              <p className="text-[#00ffcc]">Image uploaded</p>
              <p className="text-xs text-muted-foreground">Click to change</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Upload chart image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="validity">Validity Period</Label>
        <Select value={validity} onValueChange={setValidity}>
          <SelectTrigger id="validity" className="bg-input-background border-border">
            <SelectValue placeholder="Select validity" />
          </SelectTrigger>
          <SelectContent>
            {VALIDITY_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Input - Before Publish Button */}
      <div className="pt-4 mt-4 border-t border-border">
        <div className="space-y-2 max-w-xs mx-auto">
          <Label htmlFor="price" className="text-center block">Signal Price (ETH)</Label>
          <Input
            id="price"
            type="number"
            step="0.001"
            placeholder="0.045"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-primary/10 border-primary/30 text-center text-lg"
          />
          <p className="text-xs text-muted-foreground text-center">Set your signal price in ETH</p>
        </div>
      </div>

      {/* Publish Button */}
      <div className="pt-4">
        <Button
          onClick={onPublish}
          className="w-full bg-primary hover:bg-primary/90 h-12"
          disabled={showSuccess}
        >
          {showSuccess ? (
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Published Successfully!
            </span>
          ) : (
            "Publish Signal"
          )}
        </Button>
      </div>
    </div>
  );
}

// Foresight Form (formerly Outlook)
function ForesightForm({ onPublish, showSuccess }: { onPublish: () => void; showSuccess: boolean }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [macroFactors, setMacroFactors] = useState("");
  const [innovationTrends, setInnovationTrends] = useState("");
  const [majorRisks, setMajorRisks] = useState("");
  const [optimistic, setOptimistic] = useState("");
  const [base, setBase] = useState("");
  const [pessimistic, setPessimistic] = useState("");
  const [strategicReco, setStrategicReco] = useState("");
  const [validity, setValidity] = useState("");
  const [price, setPrice] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Foresight Title</Label>
        <Input
          id="title"
          placeholder="e.g., Crypto Market Q2 2025 Foresight"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-input-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className="bg-input-background border-border">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetMarket">Target Market</Label>
        <Input
          id="targetMarket"
          placeholder="e.g., Cryptocurrency & Digital Assets"
          value={targetMarket}
          onChange={(e) => setTargetMarket(e.target.value)}
          className="bg-input-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="macroFactors">Macro Factors</Label>
        <Textarea
          id="macroFactors"
          placeholder="Global economic trends, policy changes..."
          value={macroFactors}
          onChange={(e) => setMacroFactors(e.target.value)}
          rows={4}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="innovationTrends">Innovation Trends</Label>
        <Textarea
          id="innovationTrends"
          placeholder="Emerging technologies and innovations..."
          value={innovationTrends}
          onChange={(e) => setInnovationTrends(e.target.value)}
          rows={4}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="majorRisks">Major Risks</Label>
        <Textarea
          id="majorRisks"
          placeholder="Key risks and challenges..."
          value={majorRisks}
          onChange={(e) => setMajorRisks(e.target.value)}
          rows={4}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <Card className="p-4 bg-purple-500/5 border-purple-500/30 space-y-3">
        <h3 className="text-purple-400 flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Future Scenarios
        </h3>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="optimistic" className="text-xs text-green-400">Optimistic Scenario</Label>
            <Textarea
              id="optimistic"
              placeholder="Best case scenario..."
              value={optimistic}
              onChange={(e) => setOptimistic(e.target.value)}
              rows={3}
              className="bg-input-background border-border resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="base" className="text-xs text-blue-400">Base Scenario</Label>
            <Textarea
              id="base"
              placeholder="Most likely scenario..."
              value={base}
              onChange={(e) => setBase(e.target.value)}
              rows={3}
              className="bg-input-background border-border resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pessimistic" className="text-xs text-red-400">Pessimistic Scenario</Label>
            <Textarea
              id="pessimistic"
              placeholder="Worst case scenario..."
              value={pessimistic}
              onChange={(e) => setPessimistic(e.target.value)}
              rows={3}
              className="bg-input-background border-border resize-none"
            />
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="strategicReco">Strategic Recommendation</Label>
        <Textarea
          id="strategicReco"
          placeholder="Your strategic advice and action plan..."
          value={strategicReco}
          onChange={(e) => setStrategicReco(e.target.value)}
          rows={4}
          className="bg-input-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Chart / Analysis Image</Label>
        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
          onClick={() => setImageUploaded(!imageUploaded)}
        >
          {imageUploaded ? (
            <div className="flex flex-col items-center gap-2">
              <Check className="h-8 w-8 text-[#00ffcc]" />
              <p className="text-[#00ffcc]">Image uploaded</p>
              <p className="text-xs text-muted-foreground">Click to change</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Upload chart image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="validity">Validity Period</Label>
        <Select value={validity} onValueChange={setValidity}>
          <SelectTrigger id="validity" className="bg-input-background border-border">
            <SelectValue placeholder="Select validity" />
          </SelectTrigger>
          <SelectContent>
            {VALIDITY_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Input - Before Publish Button */}
      <div className="pt-4 mt-4 border-t border-border">
        <div className="space-y-2 max-w-xs mx-auto">
          <Label htmlFor="price" className="text-center block">Signal Price (ETH)</Label>
          <Input
            id="price"
            type="number"
            step="0.001"
            placeholder="0.055"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-primary/10 border-primary/30 text-center text-lg"
          />
          <p className="text-xs text-muted-foreground text-center">Set your signal price in ETH</p>
        </div>
      </div>

      {/* Publish Button */}
      <div className="pt-4">
        <Button
          onClick={onPublish}
          className="w-full bg-primary hover:bg-primary/90 h-12"
          disabled={showSuccess}
        >
          {showSuccess ? (
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Published Successfully!
            </span>
          ) : (
            "Publish Signal"
          )}
        </Button>
      </div>
    </div>
  );
}
