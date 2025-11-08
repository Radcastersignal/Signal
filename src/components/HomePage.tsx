import { useState, useEffect } from "react";
import { Search, Filter, Bell, TrendingUp, User, Plus, BarChart3, Share2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SignalCard } from "./SignalCard";
import { ShareDialog } from "./ShareDialog";
import { NotificationPanel } from "./NotificationPanel";
import { BaseSignal, SignalType, SignalCategory } from "../types";
import { getAllSignals } from "../utils/api";
import { useUser } from "../contexts/UserContext";

interface HomePageProps {
  onSignalClick: (signalId: string) => void;
  onAnalystClick: (fid: number) => void;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  onAnalystsPageClick: () => void;
  onCreateClick: () => void;
}

const SIGNAL_TYPES: { value: SignalType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "general", label: "General" },
  { value: "signal", label: "Quick Signal" },
  { value: "opportunity", label: "Opportunity" },
  { value: "strategy", label: "Strategy" },
  { value: "foresight", label: "Foresight" }
];

const CATEGORIES: SignalCategory[] = [
  "All",
  "General",
  "Clancker",
  "Zora",
  "Base App",
  "NFT",
  "DeFi",
  "Crypto",
  "Pumping"
];

type SortFilter = "top-rated" | "best-selling" | "recent";

export function HomePage({
  onSignalClick,
  onAnalystClick,
  onProfileClick,
  onNotificationsClick,
  onAnalystsPageClick,
  onCreateClick
}: HomePageProps) {
  const { user } = useUser();
  const [signals, setSignals] = useState<BaseSignal[]>([]);
  const [filteredSignals, setFilteredSignals] = useState<BaseSignal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<SignalType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<SignalCategory>("All");
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<"explore" | "create" | "analysts">("explore");
  const [sortFilter, setSortFilter] = useState<SortFilter>("recent");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadSignals();
  }, []);

  useEffect(() => {
    filterSignals();
  }, [signals, searchQuery, selectedType, selectedCategory, sortFilter]);

  async function loadSignals() {
    setIsLoading(true);
    try {
      const data = await getAllSignals();
      setSignals(data);
    } catch (error) {
      console.error("Error loading signals:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function filterSignals() {
    let filtered = [...signals];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.analystName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((s) => s.type === selectedType);
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    // Sort filter
    switch (sortFilter) {
      case "top-rated":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "best-selling":
        filtered.sort((a, b) => b.purchaseCount - a.purchaseCount);
        break;
      case "recent":
        filtered.sort((a, b) => 
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
        break;
    }

    setFilteredSignals(filtered);
  }

  const handleTabClick = (tab: "explore" | "create" | "analysts") => {
    setCurrentTab(tab);
    if (tab === "create") {
      onCreateClick();
    } else if (tab === "analysts") {
      onAnalystsPageClick();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-[#00ffcc]" />
            <h1 className="text-[#00ffcc]">Data Signals Hub</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(true)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-[#00ffcc] rounded-full" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowShareDialog(true)}
              className="relative"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onProfileClick}
            >
              <Avatar className="h-8 w-8 border border-primary/30">
                <AvatarImage src={user?.pfpUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.displayName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>

        {/* Search and Type Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search signals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-border"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowTypeFilter(!showTypeFilter)}
            className={showTypeFilter ? "border-primary" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Type Filter Dropdown */}
        {showTypeFilter && (
          <div className="mt-2 p-2 bg-muted rounded-lg border border-border">
            <div className="text-xs text-muted-foreground mb-2">Signal Type:</div>
            <div className="flex flex-wrap gap-2">
              {SIGNAL_TYPES.map((type) => (
                <Badge
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedType(type.value);
                    setShowTypeFilter(false);
                  }}
                >
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Category Filter */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border">
        <div className="flex gap-2">
          <Button
            variant={sortFilter === "best-selling" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortFilter("best-selling")}
            className="flex-1 text-xs"
          >
            Best Selling
          </Button>
          <Button
            variant={sortFilter === "top-rated" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortFilter("top-rated")}
            className="flex-1 text-xs"
          >
            Top Rated
          </Button>
          <Button
            variant={sortFilter === "recent" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortFilter("recent")}
            className="flex-1 text-xs"
          >
            Recent
          </Button>
        </div>
      </div>

      {/* Scrollable Signals List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="text-muted-foreground mb-2">No signals found</div>
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
          filteredSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onSignalClick={onSignalClick}
              onAnalystClick={onAnalystClick}
              onBuyClick={onSignalClick}
            />
          ))
        )}
      </div>

      {/* Fixed Bottom Navigation Footer */}
      <div className="flex-shrink-0 border-t-2 border-primary/30 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-around px-6 py-3">
          <Button
            variant="ghost"
            onClick={() => handleTabClick("explore")}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${
              currentTab === "explore" 
                ? "text-primary border-2 border-primary/50 bg-primary/10" 
                : "text-muted-foreground border-2 border-transparent hover:text-foreground"
            } rounded-xl transition-all`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">Menu</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleTabClick("create")}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${
              currentTab === "create" 
                ? "text-primary border-2 border-primary/50 bg-primary/10" 
                : "text-muted-foreground border-2 border-transparent hover:text-foreground"
            } rounded-xl transition-all`}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Create</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleTabClick("analysts")}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${
              currentTab === "analysts" 
                ? "text-primary border-2 border-primary/50 bg-primary/10" 
                : "text-muted-foreground border-2 border-transparent hover:text-foreground"
            } rounded-xl transition-all`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Analysts</span>
          </Button>
        </div>
      </div>

      {/* Share App Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        title="Data Signals Hub"
        url="https://data-signals-hub.farcaster.xyz"
        type="app"
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onSignalClick={onSignalClick}
      />
    </div>
  );
}
