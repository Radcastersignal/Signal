import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { BaseSignal } from "../types";

interface SignalSuccessRatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signal: BaseSignal;
  onRate: (signalId: string, success: boolean) => void;
}

export function SignalSuccessRatingDialog({ 
  open, 
  onOpenChange, 
  signal,
  onRate 
}: SignalSuccessRatingDialogProps) {

  const handleRate = (success: boolean) => {
    onRate(signal.id, success);
    toast.success(
      success ? "✅ Marked as successful!" : "❌ Marked as unsuccessful",
      {
        description: "Your feedback helps calculate analyst success rates"
      }
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center">Rate Signal Outcome</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Signal Info */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Signal you purchased:</p>
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-foreground mb-2">{signal.title}</p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {signal.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {signal.price.toFixed(3)} ETH
                </Badge>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center">
            <p className="text-foreground">
              Did this signal help you achieve a successful outcome?
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Your honest feedback helps the community identify reliable analysts
            </p>
          </div>

          {/* Rating Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleRate(true)}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <TrendingUp className="h-6 w-6" />
              <span>Successful</span>
            </Button>
            <Button
              onClick={() => handleRate(false)}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <TrendingDown className="h-6 w-6" />
              <span>Unsuccessful</span>
            </Button>
          </div>

          {/* Info */}
          <div className="text-xs text-center text-muted-foreground">
            This rating contributes to the analyst's overall success rate
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
