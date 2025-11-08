import { useState, useEffect } from "react";
import { X, Bell, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { getUserNotifications } from "../utils/api";
import { useUser } from "../contexts/UserContext";
import { SignalSuccessRatingDialog } from "./SignalSuccessRatingDialog";
import { BaseSignal } from "../types";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSignalClick: (signalId: string) => void;
}

export function NotificationPanel({ isOpen, onClose, onSignalClick }: NotificationPanelProps) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<BaseSignal | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadNotifications();
    }
  }, [isOpen, user]);

  async function loadNotifications() {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const notifs = await getUserNotifications(user.fid);
      setNotifications(notifs);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRateSignal = (notification: any) => {
    // In production, fetch the actual signal data
    const mockSignal: BaseSignal = {
      id: notification.signalId,
      title: notification.message.split('"')[1] || "Signal",
      type: "Trade Signal",
      category: "DeFi",
      price: 0.02,
      analystName: "Analyst",
      analystFid: 0,
      analystAvatar: "",
      analystSuccessRate: 85,
      rating: 4.5,
      reviewCount: 10,
      expiryDate: new Date().toISOString(),
      status: "expired",
      purchaseCount: 5
    };
    
    setSelectedSignal(mockSignal);
    setShowRatingDialog(true);
  };

  const handleRateSuccess = (signalId: string, success: boolean) => {
    // Handle rating submission
    console.log(`Rating signal ${signalId}: ${success ? 'success' : 'failure'}`);
    // Refresh notifications
    loadNotifications();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 bottom-0 w-[90%] max-w-md bg-background border-l border-border z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-foreground">Notifications</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`p-4 ${
                  notification.read 
                    ? 'bg-card' 
                    : 'bg-primary/5 border-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {notification.type === 'purchase_success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {notification.type === 'rating_request' && (
                      <TrendingUp className="h-5 w-5 text-[#00ffcc]" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-foreground mb-1">
                      {notification.message}
                    </p>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {new Date(notification.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>

                    {notification.type === 'purchase_success' && notification.amount && (
                      <Badge className="bg-[#00ffcc]/20 text-[#00ffcc] border-[#00ffcc]/30">
                        +{notification.amount.toFixed(3)} ETH
                      </Badge>
                    )}

                    {notification.type === 'rating_request' && (
                      <Button
                        size="sm"
                        className="mt-2 bg-primary hover:bg-primary/90"
                        onClick={() => handleRateSignal(notification)}
                      >
                        Rate Now
                      </Button>
                    )}

                    {notification.signalId && notification.type !== 'rating_request' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          onSignalClick(notification.signalId);
                          onClose();
                        }}
                      >
                        View Signal
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Success Rating Dialog */}
      {selectedSignal && (
        <SignalSuccessRatingDialog
          open={showRatingDialog}
          onOpenChange={setShowRatingDialog}
          signal={selectedSignal}
          onRate={handleRateSuccess}
        />
      )}
    </>
  );
}
