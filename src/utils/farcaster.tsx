// Farcaster SDK integration
import { FarcasterUser } from '../types';
import { sdk } from '@farcaster/miniapp-sdk';

/**
 * Farcaster Mini App SDK Integration
 * Documentation: https://docs.farcaster.xyz/developers/miniapps
 */

// Mock Farcaster data for development
// In production, replace this with real API calls
import { useRealUser } from "../hooks/useRealUser";
const { user, loading } = useRealUser();


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
    // 🟢 في بيئة الإنتاج، استخدم API لجلب بيانات المستخدم الحقيقي
    // const user = await farcaster.getUser(fid);
    // return user;

    // 🟡 في الوضع الحالي (تجريبي)، نعيد null لعدم توفر بيانات فعلية
    return null;
  } catch (error) {
    console.error("❌ Error fetching user by FID:", error);
    return null;
  }
}

/**
 * 🟣 Post to Farcaster (Cast)
 * في الإنتاج، هذا الجزء سيكون مسؤول عن نشر محتوى أو تفاعل على شبكة Farcaster.
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
