// src/App.tsx
import { useState, useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./utils/wagmiConfig";
import { UserProvider } from "./contexts/UserContext";
import { HomePage } from "./components/HomePage";
import { AnalystsPage } from "./components/AnalystsPage";
import { UserProfilePage } from "./components/UserProfilePage";
import { AnalystProfilePage } from "./components/AnalystProfilePage";
import { SignalDetailPage } from "./components/SignalDetailPage";
import { CreateSignalPage } from "./components/CreateSignalPage";
import { WalletConnector } from "./components/WalletConnector";
import { Toaster } from "./components/ui/sonner";
import { checkAndInitialize } from "./utils/initializeApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FarcasterProvider } from "./context/FarcasterContext";

type Page = "home" | "analysts" | "create" | "signal" | "analyst" | "userProfile";
const queryClient = new QueryClient();

// ✅ استدعاء ready() مباشرة عند تحميل الملف
if (typeof window !== 'undefined') {
  (async () => {
    try {
      const sdk = await import("@farcaster/frame-sdk");
      sdk.default.actions.ready();
      console.log("✅✅✅ FARCASTER SDK READY CALLED ✅✅✅");
    } catch (e) {
      console.error("❌ SDK Error:", e);
    }
  })();
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [initialized, setInitialized] = useState(false);
  const [selectedSignalId, setSelectedSignalId] = useState<string>("");
  const [selectedAnalystFid, setSelectedAnalystFid] = useState<number>(0);

  useEffect(() => {
    const initApp = async () => {
      try {
        await checkAndInitialize();
        setInitialized(true);
        console.log("✅ App initialized");
      } catch (err) {
        console.error("❌ Init error:", err);
        setInitialized(true);
      }
    };
    initApp();
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ffcc] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-bold">DATA SIGNALS HUB</p>
          <p className="text-gray-500 text-sm mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSignalClick = (id: string) => { setSelectedSignalId(id); setCurrentPage("signal"); };
  const handleAnalystClick = (fid: number) => { setSelectedAnalystFid(fid); setCurrentPage("analyst"); };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onSignalClick={handleSignalClick}
            onAnalystClick={handleAnalystClick}
            onProfileClick={() => setCurrentPage("userProfile")}
            onNotificationsClick={() => {}}
            onAnalystsPageClick={() => setCurrentPage("analysts")}
            onCreateClick={() => setCurrentPage("create")}
          />
        );
      case "analysts":
        return <AnalystsPage onBack={() => setCurrentPage("home")} onAnalystClick={handleAnalystClick} />;
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
        return <CreateSignalPage onBack={() => setCurrentPage("home")} onPublish={() => setCurrentPage("home")} />;
      default:
        return null;
    }
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FarcasterProvider>
          <UserProvider>
            <WalletConnector />
            <div className="fixed inset-0 bg-background overflow-hidden">
              <div className="w-full h-full max-w-[390px] max-h-[844px] mx-auto bg-background flex flex-col">
                <div className="flex-1 overflow-hidden">{renderPage()}</div>
              </div>
              <Toaster position="top-center" />
            </div>
          </UserProvider>
        </FarcasterProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}