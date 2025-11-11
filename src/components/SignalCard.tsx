import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export interface BaseSignal {
  id: string;
  title: string;
  type: string;
  price: string; // ETH
  category: string;
  description?: string;
  imageUrl?: string;
}

interface SignalCardProps {
  signal: BaseSignal;
  isPurchased?: boolean;
  onPurchase?: (signalId: string) => Promise<void>;
  onSignalClick?: () => void;
  onAnalystClick?: () => void;
}

export function SignalCard({
  signal,
  isPurchased = false,
  onPurchase,
  onSignalClick,
  onAnalystClick,
}: SignalCardProps) {
  const [purchased, setPurchased] = useState(isPurchased);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!onPurchase) return;
    setLoading(true);
    try {
      await onPurchase(signal.id);
      setPurchased(true);
    } catch (err) {
      console.error("Purchase failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 bg-card border-border hover:shadow-md transition-all cursor-pointer">
      <div onClick={onSignalClick} className="space-y-2">
        <h3 className="text-lg font-semibold">{signal.title}</h3>
        <p className="text-sm text-muted-foreground">{signal.category}</p>
        {signal.description && <p className="text-xs text-muted-foreground">{signal.description}</p>}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium">{signal.price} ETH</span>
        {purchased ? (
          <Button disabled variant="secondary" className="flex items-center gap-2">
            <Check className="h-4 w-4" /> Purchased
          </Button>
        ) : (
          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4" /> Buy
          </Button>
        )}
      </div>
    </Card>
  );
}
