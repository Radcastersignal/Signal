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
import sdk from "@farcaster/frame-sdk";
import { checkAndInitialize } from "./utils/initializeApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FarcasterProvider } from "./context/FarcasterContext";

type Page =
  | "home"
  | "analysts"
  | "create"
  | "signal"
  | "analyst"
  | "userProfile";

const queryClient = new QueryClient();

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [initialized, setInitialized] = useState(false);
  const [selectedSignalId, setSelectedSignalId] = useState<string>("");
  const [selectedAnalystFid, setSelectedAnalystFid] = useState<number>(0);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🚀 Starting Farcaster initialization...");
        
        // ✅ الخطوة 1: إخبار Farcaster فوراً بأن التطبيق جاهز
        sdk.actions.ready();
        console.log("✅ sdk.actions.ready() called successfully");

        // ✅ الخطوة 2: تهيئة باقي التطبيق في الخلفية
        await checkAndInitialize();
        setInitialized(true);
        console.log("✅ App initialized successfully");

      } catch (err) {
        console.error("❌ Error during initialization:", err);
        // ✅ حتى في حالة الخطأ، نسمح للتطبيق بالظهور
        setInitialized(true);
        // ✅ نتأكد من استدعاء ready() حتى لو فشلت التهيئة
        try {
          sdk.actions.ready();
        } catch (sdkError) {
          console.error("❌ Error calling sdk.actions.ready():", sdkError);
        }
      }
    };

    initializeApp();
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
    // ✅ عرض شاشة تحميل بسيطة أثناء التهيئة
    if (!initialized) {
      return (
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ffcc] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading Data Signals Hub...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onSignalClick={handleSignalClick}
            onAnalystClick={handleAnalystClick}
            onProfileClick={() => setCurrentPage("userProfile")}
            onNotificationsClick={() => console.log("Notifications clicked")}
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
        return (
          <div className="flex items-center justify-center h-screen bg-white">
            <p className="text-gray-600">Page not found</p>
          </div>
        );
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