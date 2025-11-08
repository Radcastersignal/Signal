import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ShareDialog } from "./ShareDialog";
import { TrendingUp, Clock, Star, Users, Share2 } from "lucide-react";
import { BaseSignal, SignalType } from "../types";

interface SignalCardProps {
  signal: BaseSignal;
  onSignalClick: (signalId: string) => void;
  onAnalystClick: (fid: number) => void;
  onBuyClick: (signalId: string) => void;
}

const SIGNAL_TYPE_LABELS: Record<SignalType, { label: string; color: string }> = {
  general: { label: "General", color: "bg-[#00ffcc]/20 text-[#00ffcc] border-[#00ffcc]/30" },
  signal: { label: "Signal", color: "bg-primary/20 text-primary border-primary/30" },
  opportunity: { label: "Opportunity", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  strategy: { label: "Strategy", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  foresight: { label: "Foresight", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" }
};

export function SignalCard({ signal, onSignalClick, onAnalystClick, onBuyClick }: SignalCardProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const typeLabel = SIGNAL_TYPE_LABELS[signal.type];
  
  // Check if signal is active
  const isActive = signal.status === "active";
  const expiryDate = new Date(signal.expiryDate);
  const now = new Date();
  const hoursLeft = Math.max(0, Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)));
  
  return (
    <Card
      className="p-4 bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
      onClick={() => onSignalClick(signal.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-foreground">{signal.title}</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={typeLabel.color}>
              {typeLabel.label}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {signal.category}
            </Badge>
            {isActive && (
              <Badge className="text-xs bg-[#00ffcc]/20 text-[#00ffcc] border-[#00ffcc]/30 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-pulse" />
                Active
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <div className="text-primary">{signal.price.toFixed(3)} ETH</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-[#00ffcc] fill-[#00ffcc]" />
              <span className="text-xs text-muted-foreground">{signal.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Users className="h-3 w-3 text-primary" />
              <span className="text-xs text-muted-foreground">{signal.purchaseCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Time left */}
      {isActive && hoursLeft > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <Clock className="h-3 w-3" />
          <span>Valid for {hoursLeft}h</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onAnalystClick(signal.analystFid);
          }}
        >
          <Avatar className="h-8 w-8 border border-primary/30">
            <AvatarImage src={signal.analystImage} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {signal.analystName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-foreground">{signal.analystName}</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-[#00ffcc]" />
              <span className="text-xs text-[#00ffcc]">{signal.analystSuccessRate}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setShowShareDialog(true);
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onBuyClick(signal.id);
            }}
          >
            Buy
          </Button>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        title={signal.title}
        url={`https://data-signals-hub.farcaster.xyz/signal/${signal.id}`}
        type="signal"
      />
    </Card>
  );
}
