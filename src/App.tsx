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

// قائمة الروابط التي تريد التحقق منها
const embedUrlsToCheck: string[] = [
  "https://example.com/page1",
  "https://example.com/page2",
  // يمكنك إضافة أي روابط أخرى هنا
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedSignalId, setSelectedSignalId] = useState<string>("");
  const [selectedAnalystFid, setSelectedAnalystFid] = useState<number>(0);

  useEffect(() => {
    const initApp = async () => {
      try {
        // 1️⃣ SDK جاهز
        await sdk.actions.ready();
        console.log('✅ Farcaster Mini App SDK ready');

        // 2️⃣ فحص Embed URLs
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

        // 3️⃣ تهيئة التطبيق بعد جاهزية SDK وفحص الروابط
        await checkAndInitialize();

        // 4️⃣ إخفاء Splash Screen
        sdk.ui.hideSplashScreen();
        console.log('Splash screen hidden');

      } catch (error) {
        console.error('❌ Error initializing app:', error);
      }
    };

    initApp();
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
      <UserProvider>
        <WalletConnector />
        
        <div className="fixed inset-0 bg-background overflow-hidden">
          <div className="w-full h-full max-w-[390px] max-h-[844px] mx-auto bg-background flex flex-col">
            <div className="flex-1 overflow-hidden">
              {renderPage()}
            </div>
          </div>
          
          <Toaster position="top-center" />
        </div>
      </UserProvider>
    </WagmiProvider>
  );
}
