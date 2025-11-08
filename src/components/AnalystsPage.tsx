import { useState, useEffect } from "react";
import { Search, TrendingUp, Award, ArrowLeft, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { SignalType, SignalCategory, AnalystStats } from "../types";
import { getAllAnalysts } from "../utils/api";
import { getUserByFid } from "../utils/farcaster";

interface AnalystsPageProps {
  onBack: () => void;
  onAnalystClick: (fid: number) => void;
}

const SIGNAL_TYPES: { value: SignalType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "signal", label: "Quick Signal" },
  { value: "opportunity", label: "Opportunity" },
  { value: "strategy", label: "Strategy" },
  { value: "outlook", label: "Outlook" }
];

const CATEGORIES: SignalCategory[] = [
  "All",
  "Bitcoin",
  "Onchain",
  "DeFi",
  "Memecoin",
  "Developer Activity",
  "NFT",
  "Apps",
  "Forex",
  "Stocks"
];

export function AnalystsPage({ onBack, onAnalystClick }: AnalystsPageProps) {
  const [analysts, setAnalysts] = useState<(AnalystStats & { user?: any })[]>([]);
  const [filteredAnalysts, setFilteredAnalysts] = useState<(AnalystStats & { user?: any })[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<SignalType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<SignalCategory>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalysts();
  }, []);

  useEffect(() => {
    filterAnalysts();
  }, [analysts, searchQuery, selectedType, selectedCategory]);

  async function loadAnalysts() {
    setIsLoading(true);
    try {
      const data = await getAllAnalysts();
      
      // Load user data for each analyst
      const analystsWithUsers = await Promise.all(
        data.map(async (analyst) => {
          const user = await getUserByFid(analyst.fid);
          return { ...analyst, user };
        })
      );
      
      setAnalysts(analystsWithUsers);
    } catch (error) {
      console.error("Error loading analysts:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function filterAnalysts() {
    let filtered = [...analysts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // For type and category filters, we would need to fetch signals
    // For now, we'll just show all analysts

    setFilteredAnalysts(filtered);
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-foreground">Top Analysts</h2>
            <p className="text-xs text-muted-foreground">Ranked by success rate</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search analysts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-border"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "border-primary" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters Dropdown */}
        {showFilters && (
          <div className="mt-3 p-3 bg-muted rounded-lg border border-border space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-2">Signal Type:</div>
              <div className="flex gap-2 overflow-x-auto">
                {SIGNAL_TYPES.map((type) => (
                  <Badge
                    key={type.value}
                    variant={selectedType === type.value ? "default" : "secondary"}
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => {
                      setSelectedType(type.value);
                    }}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">Category:</div>
              <div className="flex gap-2 overflow-x-auto">
                {CATEGORIES.slice(0, 6).map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => {
                      setSelectedCategory(category);
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setSelectedType("all");
                setSelectedCategory("All");
                setShowFilters(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Analysts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : filteredAnalysts.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">No analysts found</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setSelectedCategory("All");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        ) : (
          filteredAnalysts.map((analyst) => (
            <Card
              key={analyst.fid}
              className="p-4 bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => onAnalystClick(analyst.fid)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-14 w-14 border-2 border-primary/30">
                  <AvatarImage src={analyst.user?.pfpUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {analyst.user?.displayName?.[0] || "A"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="text-foreground truncate">{analyst.user?.displayName}</h3>
                      <p className="text-xs text-muted-foreground">@{analyst.user?.username}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-[#00ffcc]" />
                        <span className="text-[#00ffcc]">{analyst.successRate}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{analyst.rating.toFixed(1)} ⭐</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {analyst.user?.bio}
                  </p>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      <span className="text-foreground">{analyst.totalSignals}</span>
                      <span className="text-muted-foreground">signals</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-foreground">{analyst.user?.followerCount || 0}</span>
                      <span className="text-muted-foreground">followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#00ffcc]">{analyst.totalEarnings.toFixed(2)} ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
