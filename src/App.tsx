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
import { sdk } from "@farcaster/miniapp-sdk";
import { checkAndInitialize } from "./utils/initializeApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FarcasterInit } from "./components/FarcasterInit";
import { FarcasterProvider } from "./context/FarcasterContext"; // ✅ تمت الإضافة

type Page =
  | "home"
  | "analysts"
  | "create"
  | "signal"
  | "analyst"
  | "userProfile";

const embedUrlsToCheck: string[] = [
  "https://example.com/page1",
  "https://example.com/page2",
];

const queryClient = new QueryClient();

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [initialized, setInitialized] = useState(false);
  const [selectedSignalId, setSelectedSignalId] = useState<string>("");
  const [selectedAnalystFid, setSelectedAnalystFid] = useState<number>(0);

  useEffect(() => {
    const handleDOMContentLoaded = async () => {
      try {
        await sdk.actions.ready();
        console.log("✅ Farcaster SDK is ready");

        if (sdk.ui && typeof sdk.ui.hideSplashScreen === "function") {
          sdk.ui.hideSplashScreen();
          console.log("Splash screen hidden");
        }

        for (const url of embedUrlsToCheck) {
          try {
            const result = await sdk.embed.check(url);
            if (result.valid) {
              console.log(`✅ Embed valid: ${url}`);
            } else {
              console.warn(`❌ Embed invalid: ${url}`);
            }
          } catch (err) {
            console.error(`❌ Error checking embed URL: ${url}`, err);
          }
        }

        await checkAndInitialize();
        setInitialized(true);
      } catch (err) {
        console.error("❌ Error initializing Farcaster SDK:", err);
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
    } else {
      handleDOMContentLoaded();
    }
  }, []);

  const handleSignalClick = (signalId: string) => {
    if (!initialized) return;
    setSelectedSignalId(signalId);
    setCurrentPage("signal");
  };

  const handleAnalystClick = (fid: number) => {
    if (!initialized) return;
    setSelectedAnalystFid(fid);
    setCurrentPage("analyst");
  };

  const handlePublish = () => {
    if (!initialized) return;
    setCurrentPage("home");
  };

  const renderPage = () => {
    if (!initialized) return null;
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
        return null;
    }
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FarcasterProvider> {/* ✅ تمت الإحاطة هنا */}
          <UserProvider>
            <WalletConnector />
            <FarcasterInit />
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
