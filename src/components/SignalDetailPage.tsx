import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Star, Lock, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { SignalDetailView } from "./SignalDetailView";
import { RatingDialog } from "./RatingDialog";
import { ShareDialog } from "./ShareDialog";
import { useUser } from "../contexts/UserContext";
import { getSignalById, checkUserPurchase, purchaseSignal, submitQuickRating } from "../utils/api";
import { purchaseSignal as walletPurchase } from "../utils/wallet";
import { Signal } from "../types";
import { toast } from "sonner@2.0.3";

interface SignalDetailPageProps {
  signalId: string;
  onBack: () => void;
  onAnalystClick: (fid: number) => void;
}

export function SignalDetailPage({ signalId, onBack, onAnalystClick }: SignalDetailPageProps) {
  const { user, wallet } = useUser();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [attemptingExit, setAttemptingExit] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSignal();
  }, [signalId]);

  // Handle back button - show rating dialog if not rated yet
  const handleBackClick = () => {
    if (hasPurchased && !hasRated) {
      setAttemptingExit(true);
      setShowRatingDialog(true);
    } else {
      onBack();
    }
  };

  async function loadSignal() {
    setIsLoading(true);
    try {
      const signalData = await getSignalById(signalId);
      if (signalData) {
        setSignal(signalData);
        
        // Check if user has purchased this signal
        if (user) {
          const purchased = await checkUserPurchase(user.fid, signalId);
          setHasPurchased(purchased);
        }
      }
    } catch (error) {
      console.error("Error loading signal:", error);
      toast.error("Failed to load signal");
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePurchase() {
    if (!user || !signal || !wallet) {
      toast.error("Please connect wallet first");
      return;
    }

    setIsPurchasing(true);
    try {
      // Process wallet transaction
      const txResult = await walletPurchase(
        signal.id,
        user.walletAddress || "",
        signal.price
      );

      if (!txResult.success) {
        toast.error(txResult.error || "Payment failed");
        setIsPurchasing(false);
        return;
      }

      // Record purchase in database
      await purchaseSignal(
        signal.id,
        user.fid,
        signal.price,
        txResult.transactionHash || ""
      );

      setHasPurchased(true);
      toast.success("Signal unlocked successfully! 🎉");
    } catch (error) {
      console.error("Error purchasing signal:", error);
      toast.error("Purchase failed");
    } finally {
      setIsPurchasing(false);
    }
  }

  async function handleRating(stars: number) {
    if (!user || !signal) return;

    try {
      const purchaseId = `${user.fid}_${signal.id}_${Date.now()}`;
      await submitQuickRating(purchaseId, stars);
      
      setRating(stars);
      setHasRated(true);
      toast.success("Thanks for your rating! ⭐");
      setShowRatingDialog(false);
      
      // If user was attempting to exit, now allow them to go back
      if (attemptingExit) {
        setTimeout(() => onBack(), 500);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating");
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-background">
        <p className="text-muted-foreground mb-4">Signal not found</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-foreground">Signal Details</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <div className="text-primary">{signal.price.toFixed(3)} ETH</div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto">
        {hasPurchased ? (
          <div className="p-4">
            <SignalDetailView signal={signal} onAnalystClick={onAnalystClick} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-foreground mb-2">Premium Content</h3>
            <p className="text-muted-foreground mb-6">
              Unlock this signal to view full analysis and details
            </p>
            
            {/* Preview Info */}
            <Card className="p-4 bg-card border-border w-full mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="text-primary">{signal.price.toFixed(3)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating:</span>
                  <span className="text-[#00ffcc]">⭐ {signal.rating.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Analyst Success:</span>
                  <span className="text-[#00ffcc]">{signal.analystSuccessRate}%</span>
                </div>
              </div>
            </Card>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handlePurchase}
              disabled={!wallet || isPurchasing}
            >
              {isPurchasing ? "Processing..." : "Buy Now"}
            </Button>

            {!wallet && (
              <p className="text-xs text-muted-foreground mt-2">
                Please connect wallet first
              </p>
            )}
          </div>
        )}
      </div>

      {/* Rating Dialog - Shows when attempting to exit */}
      <RatingDialog
        open={showRatingDialog}
        onOpenChange={(open) => {
          setShowRatingDialog(open);
          if (!open && attemptingExit && !hasRated) {
            // User closed dialog without rating while trying to exit, allow exit
            onBack();
          }
        }}
        signalTitle={signal.title}
        signalId={signal.id}
        onRate={handleRating}
      />

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        title={signal.title}
        url={`https://data-signals-hub.farcaster.xyz/signal/${signal.id}`}
        type="signal"
      />
    </div>
  );
}
