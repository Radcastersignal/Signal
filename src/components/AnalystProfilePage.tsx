import { ArrowLeft, Award, BarChart3, TrendingUp, Bell, BellOff, UserPlus, UserMinus, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { ShareDialog } from "./ShareDialog";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface AnalystProfilePageProps {
  analystName: string;
  onBack: () => void;
  onSignalClick: (signalId: string) => void;
}

export function AnalystProfilePage({ analystName, onBack, onSignalClick }: AnalystProfilePageProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1423);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const analystData = {
    name: analystName,
    image: "https://images.unsplash.com/photo-1758876203326-016526a303a0?w=200&h=200&fit=crop",
    bio: "Onchain analytics specialist with 5+ years experience. Focused on whale movements and institutional flows.",
    specialties: ["Onchain Analysis", "DeFi", "Whale Tracking"],
    successRate: 84,
    totalSignals: 127,
    totalSales: 234,
    joined: "Jan 2024"
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (!notificationsEnabled) {
      toast.success(`🔔 Alerts enabled for ${analystData.name}`, {
        description: "You'll receive notifications when new signals are published"
      });
    } else {
      toast.info(`🔕 Alerts disabled for ${analystData.name}`);
    }
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      setFollowersCount(followersCount + 1);
      toast.success(`✅ Following ${analystData.name}`, {
        description: "You'll see all their new signals"
      });
    } else {
      setFollowersCount(followersCount - 1);
      toast.info(`❌ Unfollowed ${analystData.name}`);
    }
  };

  const activeSignals = [
    {
      id: "1",
      title: "ETH inflows ↑ 8%",
      timeframe: "4h",
      price: "0.02 ETH",
      rating: 4.8,
      status: "Active"
    },
    {
      id: "2",
      title: "SOL validator growth spike",
      timeframe: "1d",
      price: "0.018 ETH",
      rating: 4.6,
      status: "Active"
    },
    {
      id: "3",
      title: "USDC supply expansion",
      timeframe: "1w",
      price: "0.025 ETH",
      rating: 4.9,
      status: "Active"
    }
  ];

  const pastSignals = [
    {
      id: "4",
      title: "BTC whale accumulation",
      timeframe: "4h",
      price: "0.02 ETH",
      rating: 4.7,
      status: "Completed",
      result: "+15%"
    },
    {
      id: "5",
      title: "ARB unlock impact analysis",
      timeframe: "1d",
      price: "0.015 ETH",
      rating: 4.5,
      status: "Completed",
      result: "+8%"
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-foreground">Analyst Profile</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowShareDialog(true)}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 border-2 border-primary mb-3">
              <AvatarImage src={analystData.image} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {analystData.name[0]}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-foreground mb-1">{analystData.name}</h1>
            <p className="text-muted-foreground text-sm mb-1">
              {followersCount.toLocaleString('en-US')} followers
            </p>
            <p className="text-muted-foreground text-sm mb-3">
              {analystData.bio}
            </p>
            <div className="flex gap-2 flex-wrap justify-center mb-3">
              {analystData.specialties.map((specialty, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant={isFollowing ? "default" : "outline"}
                size="sm"
                onClick={toggleFollow}
                className={
                  isFollowing
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    : "border-primary/30 text-primary hover:bg-primary/10 gap-2"
                }
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="h-4 w-4" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Follow
                  </>
                )}
              </Button>

              <Button
                variant={notificationsEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleNotifications}
                className={
                  notificationsEnabled
                    ? "bg-[#00ffcc] hover:bg-[#00ffcc]/90 text-[#141414]"
                    : "border-primary/30 text-primary hover:bg-primary/10"
                }
              >
                {notificationsEnabled ? (
                  <Bell className="h-4 w-4" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <Card className="p-4 bg-card border-primary/30">
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center">
                <div className="text-[#00ffcc] text-xl mb-1">{analystData.successRate}%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center border-l border-border">
                <div className="text-primary text-xl mb-1">{analystData.totalSignals}</div>
                <div className="text-xs text-muted-foreground">Signals</div>
              </div>
              <div className="text-center border-l border-border">
                <div className="text-orange-400 text-xl mb-1">{analystData.totalSales || 234}</div>
                <div className="text-xs text-muted-foreground">Total Sales</div>
              </div>
              <div className="text-center border-l border-border">
                <div className="text-foreground text-xl mb-1">{followersCount.toLocaleString('en-US')}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
            </div>

            {/* Success Rate Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Performance</span>
                <span className="text-[#00ffcc]">{analystData.successRate}%</span>
              </div>
              <Progress value={analystData.successRate} className="h-2" />
            </div>
          </Card>

          {/* Signals Tabs */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-muted/50">
              <TabsTrigger value="active" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Active Signals
              </TabsTrigger>
              <TabsTrigger value="past" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Past Signals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-3 space-y-3">
              {activeSignals.map((signal) => (
                <Card
                  key={signal.id}
                  className="p-4 bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => onSignalClick(signal.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-foreground mb-1">{signal.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {signal.timeframe}
                        </Badge>
                        <Badge className="text-xs bg-[#00ffcc]/20 text-[#00ffcc] border-[#00ffcc]/30">
                          {signal.status}
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
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="past" className="mt-3 space-y-3">
              {pastSignals.map((signal) => (
                <Card
                  key={signal.id}
                  className="p-4 bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => onSignalClick(signal.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-foreground mb-1">{signal.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {signal.timeframe}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-muted-foreground/30">
                          {signal.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#00ffcc] mb-1">{signal.result}</div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3 text-[#00ffcc]" />
                        <span className="text-xs text-muted-foreground">{signal.rating}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-muted-foreground">
            Member since {analystData.joined}
          </p>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        title={`${analystData.name}'s Profile`}
        url={`https://data-signals-hub.farcaster.xyz/analyst/${analystData.name}`}
        type="analyst"
      />
    </div>
  );
}
