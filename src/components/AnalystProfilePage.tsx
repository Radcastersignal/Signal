import { useState, useEffect } from "react";
import { ArrowLeft, Award, BarChart3, TrendingUp, Bell, BellOff, UserPlus, UserMinus, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { ShareDialog } from "./ShareDialog";
import { SignalCard } from "./SignalCard";
import { Comments } from "./Comments";
import { useUser } from "../contexts/UserContext";
import { getAnalystSignals, getAnalystStats } from "../utils/api";
import { BaseSignal } from "../types";

interface AnalystProfilePageProps {
  analystFid: number;
  onBack: () => void;
  onSignalClick: (signalId: string) => void;
}

export function AnalystProfilePage({ analystFid, onBack, onSignalClick }: AnalystProfilePageProps) {
  const { user } = useUser();
  const [signals, setSignals] = useState<BaseSignal[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedSignalForComments, setSelectedSignalForComments] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalystData();
  }, []);

  async function loadAnalystData() {
    setIsLoading(true);
    try {
      const analystStats = await getAnalystStats(analystFid);
      setStats(analystStats);
      setFollowersCount(analystStats.followerCount || 0);

      const analystSignals = await getAnalystSignals(analystFid);
      setSignals(analystSignals);
    } catch (err) {
      console.error("Error loading analyst data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-foreground">Analyst Profile</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowShareDialog(true)}>
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 border-2 border-primary mb-3">
            <AvatarImage src={stats?.pfpUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {stats?.displayName?.[0]}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-foreground mb-1">{stats?.displayName}</h1>
          <p className="text-muted-foreground text-sm mb-1">{followersCount} followers</p>
          <p className="text-muted-foreground text-sm mb-3">{stats?.bio}</p>

          <div className="flex gap-2">
            <Button variant={isFollowing ? "default" : "outline"} size="sm" onClick={toggleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
            <Button variant={notificationsEnabled ? "default" : "outline"} size="sm" onClick={toggleNotifications}>
              {notificationsEnabled ? "🔔" : "🔕"}
            </Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <Card className="p-4 bg-card border-primary/30">
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center">
                <div className="text-[#00ffcc] text-xl mb-1">{stats.successRate}%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center border-l border-border">
                <div className="text-primary text-xl mb-1">{stats.totalSignals}</div>
                <div className="text-xs text-muted-foreground">Signals</div>
              </div>
              <div className="text-center border-l border-border">
                <div className="text-orange-400 text-xl mb-1">{stats.totalSales}</div>
                <div className="text-xs text-muted-foreground">Total Sales</div>
              </div>
              <div className="text-center border-l border-border">
                <div className="text-foreground text-xl mb-1">{followersCount}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
            </div>
            <Progress value={stats.successRate} className="h-2" />
          </Card>
        )}

        {/* Signals List */}
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading...</div>
        ) : signals.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No signals yet</div>
        ) : (
          signals.map(signal => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onSignalClick={(id) => setSelectedSignalForComments(id)}
              onAnalystClick={() => {}}
              onBuyClick={onSignalClick}
            />
          ))
        )}

        {/* Comments Section */}
        {selectedSignalForComments && (
          <Comments signalId={selectedSignalForComments} analystFid={analystFid} />
        )}
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        title={`${stats?.displayName}'s Profile`}
        url={`https://data-signals-hub.farcaster.xyz/analyst/${analystFid}`}
        type="analyst"
      />
    </div>
  );
}
