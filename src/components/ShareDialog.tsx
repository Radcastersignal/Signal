import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Copy, Check, Share2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  type: "signal" | "analyst" | "app";
}

export function ShareDialog({ open, onOpenChange, title, url, type }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleShareToFarcaster = () => {
    // In production, this would use Farcaster SDK to create a cast
    const castText = type === "signal" 
      ? `Check out this signal: ${title}\n\n${url}`
      : type === "analyst"
      ? `Follow this analyst on Data Signals Hub!\n\n${url}`
      : `Join Data Signals Hub - Trade Smarter with Community Insights!\n\n${url}`;
    
    // For now, just show success message
    toast.success("Opening Farcaster to share...", {
      description: "In production, this will create a cast with embedded frame"
    });
    
    // In production:
    // await farcaster.createCast({
    //   text: castText,
    //   embeds: [{ url }],
    //   frameUrl: url
    // });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Share to Farcaster */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Share to Farcaster community</p>
            <Button
              onClick={handleShareToFarcaster}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share as Cast
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Copy link to share anywhere</p>
            <div className="flex gap-2">
              <Input
                value={url}
                readOnly
                className="bg-input-background border-border text-sm"
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                size="icon"
                className={copied ? "border-[#00ffcc] text-[#00ffcc]" : ""}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Preview Info */}
          {type === "signal" && (
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">When shared:</p>
              <p className="text-xs text-foreground">
                • Signal card will be embedded in the cast
              </p>
              <p className="text-xs text-foreground">
                • Viewers can open it directly in the app
              </p>
            </div>
          )}

          {type === "analyst" && (
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">When shared:</p>
              <p className="text-xs text-foreground">
                • Analyst dashboard will be embedded in the cast
              </p>
              <p className="text-xs text-foreground">
                • Viewers can follow and see their signals
              </p>
            </div>
          )}

          {type === "app" && (
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">When shared:</p>
              <p className="text-xs text-foreground">
                • App preview will be embedded in the cast
              </p>
              <p className="text-xs text-foreground">
                • New users can join and start exploring signals
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
