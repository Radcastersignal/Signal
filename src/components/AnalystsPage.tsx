import { useState, useEffect } from "react";
import { Search, TrendingUp, Award, ArrowLeft, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { getAllAnalysts } from "../utils/api";
import { getUserByFid } from "../utils/farcaster";
import { AnalystStats } from "../types";

interface AnalystsPageProps {
  onBack: () => void;
  onAnalystClick: (fid: number) => void;
}

export function AnalystsPage({ onBack, onAnalystClick }: AnalystsPageProps) {
  const [analysts, setAnalysts] = useState<(AnalystStats & { user?: any })[]>([]);
  const [filteredAnalysts, setFilteredAnalysts] = useState<(AnalystStats & { user?: any })[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadAnalysts(); }, []);
  useEffect(() => { filterAnalysts(); }, [analysts, searchQuery]);

  async function loadAnalysts() {
    setIsLoading(true);
    try {
      const data = await getAllAnalysts();
      const analystsWithUsers = await Promise.all(data.map(async (a) => ({ ...a, user: await getUserByFid(a.fid) })));
      setAnalysts(analystsWithUsers);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }

  function filterAnalysts() {
    setFilteredAnalysts(analysts.filter(a => a.user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || a.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())));
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h2 className="text-foreground">Top Analysts</h2>
            <p className="text-xs text-muted-foreground">Ranked by success rate</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex items-center gap-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search analysts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input-background border-border"
          />
        </div>
      </div>

      {/* Analysts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">Loading...</div>
        ) : filteredAnalysts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <div>No analysts found</div>
            <Button size="sm" variant="outline" onClick={() => setSearchQuery("")}>Reset</Button>
          </div>
        ) : (
          filteredAnalysts.map(a => (
            <Card key={a.fid} className="p-4 bg-card border-border hover:border-primary/50 transition-all cursor-pointer" onClick={() => onAnalystClick(a.fid)}>
              <div className="flex items-start gap-3">
                <Avatar className="h-14 w-14 border-2 border-primary/30">
                  <AvatarImage src={a.user?.pfpUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground">{a.user?.displayName?.[0] || "A"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground truncate">{a.user?.displayName}</h3>
                  <p className="text-xs text-muted-foreground">@{a.user?.username}</p>
                  <div className="flex items-center gap-4 text-xs mt-2">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-primary" /> {a.totalSignals} signals
                    </div>
                    <div className="flex items-center gap-1">{a.user?.followerCount || 0} followers</div>
                    <div className="flex items-center gap-1 text-[#00ffcc]">{a.totalEarnings.toFixed(2)} ETH</div>
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
