// Farcaster SDK integration
import { FarcasterUser } from '../types';
import { sdk } from '@farcaster/miniapp-sdk';

/**
 * Farcaster Mini App SDK Integration
 * Documentation: https://docs.farcaster.xyz/developers/miniapps
 */

// Mock Farcaster data for development
// In production, replace this with real API calls
const MOCK_USERS: Record<number, FarcasterUser> = {
  1: {
    fid: 1,
    username: "cryptomax",
    displayName: "CryptoMax",
    pfpUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
    bio: "Onchain analytics specialist with 5+ years experience. Focused on whale movements and institutional flows.",
    followerCount: 1423,
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"
  },
  2: {
    fid: 2,
    username: "memeanalyst",
    displayName: "MemeAnalyst",
    pfpUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop",
    bio: "Memecoin specialist. Finding gems before they moon 🚀",
    followerCount: 2156,
    walletAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
  },
  3: {
    fid: 3,
    username: "defiguru",
    displayName: "DeFiGuru",
    pfpUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    bio: "DeFi protocol analyst. Tracking TVL, yields, and risks.",
    followerCount: 3421,
    walletAddress: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"
  }
};

let currentUser: FarcasterUser | null = null;

/**
 * Initialize Farcaster connection
 * Uses real Farcaster Mini App SDK
 */
export async function initializeFarcaster(): Promise<FarcasterUser | null> {
  try {
    // Get user context from Farcaster Mini App SDK
    const context = await sdk.context;
    
    if (context?.user) {
      const farcasterUser = context.user;
      
      currentUser = {
        fid: farcasterUser.fid,
        username: farcasterUser.username || `user-${farcasterUser.fid}`,
        displayName: farcasterUser.displayName || farcasterUser.username || `User ${farcasterUser.fid}`,
        pfpUrl: farcasterUser.pfpUrl || '',
        bio: farcasterUser.profile?.bio?.text || '',
        followerCount: 0, // SDK doesn't provide this directly
        walletAddress: farcasterUser.verifications?.[0] || null
      };
      
      console.log('✅ Farcaster user loaded:', currentUser);
      return currentUser;
    }
    
    // Fallback to mock data if SDK doesn't return user (development mode)
    console.warn('⚠️ No user from SDK, using mock data');
    currentUser = MOCK_USERS[1];
    return currentUser;
  } catch (error) {
    console.error('❌ Error initializing Farcaster:', error);
    // Fallback to mock data on error
    currentUser = MOCK_USERS[1];
    return currentUser;
  }
}

/**
 * Get current Farcaster user
 */
export function getCurrentUser(): FarcasterUser | null {
  return currentUser;
}

/**
 * Get user by FID
 */
export async function getUserByFid(fid: number): Promise<FarcasterUser | null> {
  try {
    // In production, use API to get user data
    // const user = await farcaster.getUser(fid);
    
    // For development
    return MOCK_USERS[fid] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

/**
 * Post to Farcaster (Cast)
 * في الإنتاج، هذا سينشر على Farcaster
 */
export async function postToFarcaster(
  text: string,
  embeds?: { url?: string; castId?: string }[]
): Promise<{ success: boolean; castHash?: string }> {
  try {
    // في الإنتاج، استخدم Farcaster SDK للنشر
    // const cast = await farcaster.publishCast({ text, embeds });
    
    console.log('📝 Publishing to Farcaster:', text);
    
    // Mock success response
    return {
      success: true,
      castHash: `0x${Math.random().toString(16).substring(2)}`
    };
  } catch (error) {
    console.error('Error posting to Farcaster:', error);
    return { success: false };
  }
}

/**
 * Send notification to Farcaster user
 * في الإنتاج، هذا سيرسل إشعار عبر Farcaster
 */
export async function sendFarcasterNotification(
  fid: number,
  message: string
): Promise<boolean> {
  try {
    // في الإنتاج، استخدم Farcaster notifications API
    console.log(`🔔 Sending notification to FID ${fid}:`, message);
    
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

/**
 * Get user's wallet address from Farcaster
 */
export async function getUserWallet(fid: number): Promise<string | null> {
  try {
    const user = await getUserByFid(fid);
    return user?.walletAddress || null;
  } catch (error) {
    console.error('Error getting wallet:', error);
    return null;
  }
}

/**
 * Mock sign-in with different users (for testing)
 */
export function mockSignIn(fid: number) {
  currentUser = MOCK_USERS[fid] || null;
  return currentUser;
}
