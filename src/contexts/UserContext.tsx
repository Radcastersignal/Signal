import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FarcasterUser } from '../types';
import { initializeFarcaster, getCurrentUser } from '../utils/farcaster';
import { connectWallet, getConnectedWallet, WalletConnection } from '../utils/wallet';

interface UserContextType {
  user: FarcasterUser | null;
  wallet: WalletConnection | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  connectUserWallet: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeUser();
  }, []);

  async function initializeUser() {
    setIsLoading(true);
    try {
      // Initialize Farcaster connection
      const farcasterUser = await initializeFarcaster();
      setUser(farcasterUser);
      
      // Auto-connect wallet
      const walletConnection = await connectWallet();
      setWallet(walletConnection);
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshUser() {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    const currentWallet = getConnectedWallet();
    setWallet(currentWallet);
  }

  async function connectUserWallet() {
    const walletConnection = await connectWallet();
    setWallet(walletConnection);
  }

  return (
    <UserContext.Provider value={{ user, wallet, isLoading, refreshUser, connectUserWallet }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
