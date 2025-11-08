import { Search, TrendingUp } from "lucide-react";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Signal {
  id: string;
  title: string;
  timeframe: string;
  price: string;
  analystName: string;
  analystImage: string;
  successRate: number;
  rating: number;
  category: string;
  trend: string;
}

interface ExplorePageProps {
  onSignalClick: (signalId: string) => void;
  onAnalystClick: (analystName: string) => void;
}

export function ExplorePage({ onSignalClick, onAnalystClick }: ExplorePageProps) {
  const signals: Signal[] = [
    {
      id: "1",
      title: "ETH inflows ↑ 8%",
      timeframe: "4h",
      price: "0.02 ETH",
      analystName: "CryptoMax",
      analystImage: "https://images.unsplash.com/photo-1758876203326-016526a303a0?w=100&h=100&fit=crop",
      successRate: 84,
      rating: 4.8,
      category: "Onchain",
      trend: "up"
    },
    {
      id: "2",
      title: "PEPE whale accumulation detected",
      timeframe: "1d",
      price: "0.015 ETH",
      analystName: "MemeAnalyst",
      analystImage: "https://images.unsplash.com/photo-1758876203326-016526a303a0?w=100&h=100&fit=crop",
      successRate: 76,
      rating: 4.5,
      category: "Memecoins",
      trend: "up"
    },
    {
      id: "3",
      title: "Uniswap V4 TVL surge",
      timeframe: "1w",
      price: "0.025 ETH",
      analystName: "DeFiGuru",
      analystImage: "https://images.unsplash.com/photo-1758876203326-016526a303a0?w=100&h=100&fit=crop",
      successRate: 91,
      rating: 4.9,
      category: "DeFi",
      trend: "up"
    },
    {
      id: "4",
      title: "Developer activity spikes on Base",
      timeframe: "1d",
      price: "0.01 ETH",
      analystName: "DevTracker",
      analystImage: "https://images.unsplash.com/photo-1758876203326-016526a303a0?w=100&h=100&fit=crop",
      successRate: 88,
      rating: 4.7,
      category: "Developer Activity",
      trend: "up"
    },
    {
      id: "5",
      title: "BTC on-chain volume ↓ 12%",
      timeframe: "4h",
      price: "0.018 ETH",
      analystName: "ChainWatch",
      analystImage: "https://images.unsplash.com/photo-1758876203326-016526a303a0?w=100&h=100&fit=crop",
      successRate: 79,
      rating: 4.6,
      category: "Onchain",
      trend: "down"
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-[#00ffcc]">Data Signals Hub</h1>
          <span className="text-[#00ffcc]">🔍📊</span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Signals..."
            className="pl-10 bg-input-background border-border"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 pt-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-5 bg-muted/50">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="onchain" className="text-xs">Onchain</TabsTrigger>
            <TabsTrigger value="defi" className="text-xs">DeFi</TabsTrigger>
            <TabsTrigger value="meme" className="text-xs">Memecoins</TabsTrigger>
            <TabsTrigger value="dev" className="text-xs">Dev</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Signal Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {signals.map((signal) => (
          <Card
            key={signal.id}
            className="p-4 bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => onSignalClick(signal.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-foreground">{signal.title}</h3>
                  {signal.trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-[#00ffcc]" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {signal.timeframe}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                    {signal.category}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-primary mb-1">{signal.price}</div>
                <div className="flex items-center gap-1">
                  <span className="text-[#00ffcc] text-xs">⭐</span>
                  <span className="text-xs text-muted-foreground">{signal.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onAnalystClick(signal.analystName);
                }}
              >
                <Avatar className="h-6 w-6 border border-primary/30">
                  <AvatarImage src={signal.analystImage} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {signal.analystName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs text-foreground">{signal.analystName}</span>
                  <span className="text-xs text-[#00ffcc]">{signal.successRate}% success</span>
                </div>
              </div>

              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onSignalClick(signal.id);
                }}
              >
                Buy Signal
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
