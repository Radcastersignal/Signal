import { useState, useEffect } from "react";
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './utils/wagmiConfig';
import { UserProvider } from "./contexts/UserContext";
import { HomePage } from "./components/HomePage";
import { checkAndInitialize } from "./utils/initializeApp";
import { AnalystsPage } from "./components/AnalystsPage";
import { UserProfilePage } from "./components/UserProfilePage";
import { AnalystProfilePage } from "./components/AnalystProfilePage";
import { SignalDetailPage } from "./components/SignalDetailPage";
import { CreateSignalPage } from "./components/CreateSignalPage";
import { WalletConnector } from "./components/WalletConnector";
import { Toaster } from "./components/ui/sonner";
import { sdk } from '@farcaster/miniapp-sdk';

type Page = 
  | "home" 
  | "analysts"
  | "create"
  | "signal" 
  | "analyst"
  | "userProfile";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedSignalId, setSelectedSignalId] = useState<string>("");
  const [selectedAnalystFid, setSelectedAnalystFid] = useState<number>(0);

  useEffect(() => {
    // Initialize Farcaster Mini App SDK
    const initSDK = async () => {
      try {
        await sdk.actions.ready();
        console.log('✅ Farcaster Mini App SDK ready');
      } catch (error) {
        console.error('❌ Error initializing Farcaster SDK:', error);
      }
    };
    
    initSDK();
    
    // Initialize app with mock data on first load
    checkAndInitialize();
  }, []);

  const handleSignalClick = (signalId: string) => {
    setSelectedSignalId(signalId);
    setCurrentPage("signal");
  };

  const handleAnalystClick = (fid: number) => {
    setSelectedAnalystFid(fid);
    setCurrentPage("analyst");
  };

  const handlePublish = () => {
    setCurrentPage("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onSignalClick={handleSignalClick}
            onAnalystClick={handleAnalystClick}
            onProfileClick={() => setCurrentPage("userProfile")}
            onNotificationsClick={() => {
              // TODO: Implement notifications page
              console.log("Notifications clicked");
            }}
            onAnalystsPageClick={() => setCurrentPage("analysts")}
            onCreateClick={() => setCurrentPage("create")}
          />
        );
      
      case "analysts":
        return (
          <AnalystsPage
            onBack={() => setCurrentPage("home")}
            onAnalystClick={handleAnalystClick}
          />
        );
      
      case "userProfile":
        return (
          <UserProfilePage
            onBack={() => setCurrentPage("home")}
            onSignalClick={handleSignalClick}
            onAnalystClick={handleAnalystClick}
          />
        );
      
      case "analyst":
        return (
          <AnalystProfilePage
            analystName={`Analyst-${selectedAnalystFid}`}
            onBack={() => setCurrentPage("home")}
            onSignalClick={handleSignalClick}
          />
        );
      
      case "signal":
        return (
          <SignalDetailPage
            signalId={selectedSignalId}
            onBack={() => setCurrentPage("home")}
            onAnalystClick={handleAnalystClick}
          />
        );
      
      case "create":
        return (
          <CreateSignalPage
            onBack={() => setCurrentPage("home")}
            onPublish={handlePublish}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      <UserProvider>
        {/* Auto-connect wallet on app load */}
        <WalletConnector />
        
        <div className="fixed inset-0 bg-background overflow-hidden">
          {/* Mobile Frame - Farcaster Miniapp Size - Full Screen */}
          <div className="w-full h-full max-w-[390px] max-h-[844px] mx-auto bg-background flex flex-col">
            {/* App Content */}
            <div className="flex-1 overflow-hidden">
              {renderPage()}
            </div>
          </div>
          
          {/* Toast Notifications */}
          <Toaster position="top-center" />
        </div>
      </UserProvider>
    </WagmiProvider>
  );
}
