// src/components/UserProfilePage.tsx
import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Award, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { SignalCard } from "./SignalCard";
import { Comments } from "./Comments";
import { useUser } from "../contexts/UserContext";
import { getAnalystStats, getAnalystSignals, getUserPurchases } from "../utils/api";
import { BaseSignal, AnalystStats, Purchase } from "../types";

interface UserProfilePageProps {
  onBack: () => void;
  onSignalClick: (signalId: string) => void;
  onAnalystClick: (fid: number) => void;
}

export function UserProfilePage({ onBack, onSignalClick, onAnalystClick }: UserProfilePageProps) {
  const { user, wallet } = useUser();
  const [stats, setStats] = useState<AnalystStats | null>(null);
  const [publishedSignals, setPublishedSignals] = useState<BaseSignal[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSignalForComments, setSelectedSignalForComments] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadUserData();
  }, [user]);

  async function loadUserData() {
    if (!user) return;
    setIsLoading(true);
    try {
      const analystStats = await getAnalystStats(user.fid);
      setStats(analystStats);

      const signals = await getAnalystSignals(user.fid);
      setPublishedSignals(signals);

      const userPurchases = await getUserPurchases(user.fid);
      setPurchases(userPurchases);
    } catch (err) {
      console.error("Error loading user data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) return (
    <div className="flex flex-col h-full items-center justify-center">
      <p className="text-muted-foreground">Please sign in</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-foreground">Profile</h2>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 border-2 border-primary mb-3">
              <AvatarImage src={user.pfpUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{user.displayName[0]}</AvatarFallback>
            </Avatar>
            <h1 className="text-foreground mb-1">{user.displayName}</h1>
            <p className="text-muted-foreground text-sm mb-1">@{user.username}</p>
            <p className="text-muted-foreground text-sm mb-2">{user.followerCount.toLocaleString()} followers on Farcaster</p>
            <p className="text-muted-foreground text-sm mb-3">{user.bio}</p>

            {/* Wallet Info */}
            {wallet && (
              <div className="w-full p-3 bg-muted/30 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
                <p className="text-xs text-foreground font-mono">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </p>
                <p className="text-sm text-[#00ffcc] mt-1">{wallet.balance} ETH</p>
              </div>
            )}
          </div>

          {/* Stats */}
          {stats && (
            <Card className="p-4 bg-card border-primary/30">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-[#00ffcc] text-2xl mb-1">{stats.successRate}%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center border-l border-r border-border">
                  <div className="text-primary text-2xl mb-1">{stats.totalSignals}</div>
                  <div className="text-xs text-muted-foreground">Published Signals</div>
                </div>
                <div className="text-center">
                  <div className="text-foreground text-2xl mb-1">{stats.totalEarnings.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">ETH Earned</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Overall Performance</span>
                  <span className="text-[#00ffcc]">{stats.successRate}%</span>
                </div>
                <Progress value={stats.successRate} className="h-2" />
              </div>
            </Card>
          )}

          {/* Tabs */}
          <Tabs defaultValue="published" className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-muted/50">
              <TabsTrigger value="published" className="gap-2">
                <TrendingUp className="h-4 w-4" /> Published Signals
              </TabsTrigger>
              <TabsTrigger value="purchased" className="gap-2">
                <Award className="h-4 w-4" /> Purchased Signals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="published" className="mt-3 space-y-3">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">Loading...</div>
              ) : publishedSignals.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No published signals yet</div>
              ) : (
                publishedSignals.map(signal => (
                  <SignalCard
                    key={signal.id}
                    signal={signal}
                    onSignalClick={(id) => setSelectedSignalForComments(id)}
                    onAnalystClick={onAnalystClick}
                    onBuyClick={onSignalClick}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="purchased" className="mt-3 space-y-3">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">Loading...</div>
              ) : purchases.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No purchased signals yet</div>
              ) : (
                purchases.map(purchase => (
                  <Card
                    key={purchase.id}
                    className="p-4 bg-card border-border cursor-pointer hover:border-primary/50 transition-all"
                    onClick={() => setSelectedSignalForComments(purchase.signalId)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-foreground mb-1">Signal ID: {purchase.signalId}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(purchase.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-primary">{purchase.amount} ETH</p>
                        {purchase.quickRating && (
                          <p className="text-xs text-[#00ffcc]">⭐ {purchase.quickRating}/5</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Comments Section */}
          {selectedSignalForComments && (
            <Comments signalId={selectedSignalForComments} analystFid={user.fid} />
          )}
        </div>
      </div>
    </div>
  );
}
