// Wallet connection and payment utilities with Wagmi integration
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { formatEther } from 'viem';

/**
 * Wallet connection interface
 */
export interface WalletConnection {
  address: string;
  chainId: number;
  balance: string; // in ETH
}

let connectedWallet: WalletConnection | null = null;

// Platform wallet address (for receiving fees)
const PLATFORM_WALLET = "0x4451426a3C074bF75327E4FA2f08f69C27189664"; // Replace with your wallet address

/**
 * Connect wallet using Wagmi
 * This works with Farcaster Mini App connector
 */
export async function connectWallet(): Promise<WalletConnection | null> {
  try {
    // Wallet connection is now handled by Wagmi in the React component layer
    // This function remains for backward compatibility
    
    // Mock wallet connection for development fallback
    connectedWallet = {
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
      chainId: 8453, // Base mainnet
      balance: "2.5" // ETH
    };
    
    console.log('✅ Wallet connected:', connectedWallet.address);
    return connectedWallet;
  } catch (error) {
    console.error('❌ Error connecting wallet:', error);
    return null;
  }
}

/**
 * Get connected wallet
 */
export function getConnectedWallet(): WalletConnection | null {
  return connectedWallet;
}

/**
 * Set connected wallet (called from React components using Wagmi hooks)
 */
export function setConnectedWallet(wallet: WalletConnection | null): void {
  connectedWallet = wallet;
}

/**
 * Disconnect wallet
 */
export async function disconnectWallet(): Promise<void> {
  connectedWallet = null;
  console.log('🔌 Wallet disconnected');
}

/**
 * Get wallet balance
 */
export async function getBalance(address: string): Promise<string> {
  try {
    // In production, use viem to get balance
    // const balance = await publicClient.getBalance({ address });
    
    // Mock balance for development
    return "2.5";
  } catch (error) {
    console.error('❌ Error getting balance:', error);
    return "0";
  }
}

/**
 * Purchase signal with crypto payment
 * In production, this will interact with Smart Contract
 */
export async function purchaseSignal(
  signalId: string,
  analystWallet: string,
  priceInEth: number
): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
  try {
    if (!connectedWallet) {
      return { success: false, error: 'Wallet not connected' };
    }
    
    // Check balance
    const balance = parseFloat(connectedWallet.balance);
    if (balance < priceInEth) {
      return { success: false, error: 'Insufficient balance' };
    }
    
    console.log(`💰 Processing payment: ${priceInEth} ETH`);
    console.log(`   From: ${connectedWallet.address}`);
    console.log(`   To Analyst: ${analystWallet}`);
    console.log(`   Platform Fee (10%): ${priceInEth * 0.1} ETH`);
    
    // In production, use Smart Contract for payment
    // const contract = getContract({ address: CONTRACT_ADDRESS, abi: ABI });
    // const tx = await contract.write.purchaseSignal([signalId], {
    //   value: parseEther(priceInEth.toString())
    // });
    // await tx.wait();
    
    // Mock transaction for development
    const mockTxHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
    
    // Simulate balance update
    connectedWallet.balance = (balance - priceInEth).toFixed(4);
    
    console.log(`✅ Transaction successful: ${mockTxHash}`);
    
    return {
      success: true,
      transactionHash: mockTxHash
    };
  } catch (error) {
    console.error('❌ Error processing payment:', error);
    return {
      success: false,
      error: String(error)
    };
  }
}

/**
 * Switch to Base network
 * In production, use wagmi to switch network
 */
export async function switchToBase(): Promise<boolean> {
  try {
    // In production, use wagmi.switchChain
    // await switchChain({ chainId: 8453 });
    
    if (connectedWallet) {
      connectedWallet.chainId = 8453;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error switching network:', error);
    return false;
  }
}

/**
 * Format ETH amount
 */
export function formatEth(amount: number): string {
  return `${amount.toFixed(4)} ETH`;
}

/**
 * Parse ETH amount
 */
export function parseEthInput(input: string): number {
  const parsed = parseFloat(input);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Check if on correct network (Base)
 */
export function isOnBaseNetwork(): boolean {
  return connectedWallet?.chainId === 8453;
}

// ============= React Hooks for Wagmi Integration =============

/**
 * Hook to get wallet connection status
 * Use this in React components instead of getConnectedWallet()
 */
export function useWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const walletConnection: WalletConnection | null = address && isConnected 
    ? {
        address,
        chainId: chainId || 8453,
        balance: balanceData ? formatEther(balanceData.value) : '0'
      }
    : null;

  // Sync with global state
  if (walletConnection) {
    setConnectedWallet(walletConnection);
  }

  return {
    wallet: walletConnection,
    isConnected,
    connect: () => {
      const connector = connectors[0]; // Farcaster connector
      if (connector) {
        connect({ connector });
      }
    },
    disconnect
  };
}
