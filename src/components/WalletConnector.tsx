import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { setConnectedWallet } from '../utils/wallet';
import { formatEther } from 'viem';

/**
 * WalletConnector Component
 * Handles automatic wallet connection with Farcaster Mini App
 */
export function WalletConnector() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Auto-connect on mount if not connected
    if (!isConnected && connectors.length > 0) {
      const farcasterConnector = connectors[0]; // Farcaster Mini App connector
      connect({ connector: farcasterConnector });
    }
  }, [isConnected, connectors, connect]);

  useEffect(() => {
    // Update global wallet state when connection changes
    if (address && isConnected) {
      setConnectedWallet({
        address,
        chainId: chainId || 8453, // Default to Base
        balance: '0' // Will be updated by balance hook
      });
      console.log('✅ Wallet connected via Wagmi:', address);
    } else {
      setConnectedWallet(null);
    }
  }, [address, isConnected, chainId]);

  // This component doesn't render anything
  return null;
}
