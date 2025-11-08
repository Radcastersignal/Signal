import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signalTitle: string;
  signalId: string;
  onRate: (rating: number) => void;
}

export function RatingDialog({ 
  open, 
  onOpenChange, 
  signalTitle, 
  signalId,
  onRate 
}: RatingDialogProps) {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleRate = () => {
    if (selectedRating > 0) {
      onRate(selectedRating);
      toast.success(`Thanks for rating! ${selectedRating} stars`, {
        description: "Your feedback helps the community"
      });
      onOpenChange(false);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center">Rate This Signal</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Signal Info */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">How was your experience with</p>
            <p className="text-foreground">{signalTitle}</p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-10 w-10 ${
                    star <= (hoveredRating || selectedRating)
                      ? "text-[#00ffcc] fill-[#00ffcc]"
                      : "text-muted-foreground"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          {/* Rating Description */}
          {selectedRating > 0 && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {selectedRating === 1 && "Poor - Not helpful"}
                {selectedRating === 2 && "Fair - Needs improvement"}
                {selectedRating === 3 && "Good - Met expectations"}
                {selectedRating === 4 && "Very Good - Helpful"}
                {selectedRating === 5 && "Excellent - Highly valuable"}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleRate}
              disabled={selectedRating === 0}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Submit Rating
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Your rating helps improve signal quality for everyone
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
