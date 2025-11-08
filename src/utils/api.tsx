// API utilities for communicating with backend
import { projectId, publicAnonKey } from './supabase/info';
import { Signal, Purchase, AnalystStats, Notification } from '../types';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-45dfd248`;

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  
  if (!response.ok) {
    console.error(`API Error [${endpoint}]:`, data);
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
}

// ============= SIGNALS API =============

export async function getAllSignals(): Promise<Signal[]> {
  const data = await apiCall('/signals');
  return data.signals || [];
}

export async function getSignalById(id: string): Promise<Signal | null> {
  try {
    const data = await apiCall(`/signals/${id}`);
    return data.signal;
  } catch (error) {
    console.error('Error fetching signal:', error);
    return null;
  }
}

export async function createSignal(signal: Signal): Promise<Signal> {
  const data = await apiCall('/signals', {
    method: 'POST',
    body: JSON.stringify({ signal }),
  });
  return data.signal;
}

// ============= PURCHASE API =============

export async function purchaseSignal(
  signalId: string,
  buyerFid: number,
  amount: number,
  transactionHash: string
): Promise<Purchase> {
  const data = await apiCall('/purchase', {
    method: 'POST',
    body: JSON.stringify({ signalId, buyerFid, amount, transactionHash }),
  });
  return data.purchase;
}

export async function getUserPurchases(fid: number): Promise<Purchase[]> {
  const data = await apiCall(`/purchases/${fid}`);
  return data.purchases || [];
}

export async function checkUserPurchase(
  fid: number,
  signalId: string
): Promise<boolean> {
  const data = await apiCall(`/check-purchase/${fid}/${signalId}`);
  return data.hasPurchased || false;
}

// ============= RATING API =============

export async function submitQuickRating(
  purchaseId: string,
  rating: number
): Promise<void> {
  await apiCall('/rate-quick', {
    method: 'POST',
    body: JSON.stringify({ purchaseId, rating }),
  });
}

export async function submitFinalRating(
  purchaseId: string,
  rating: 'success' | 'loss'
): Promise<void> {
  await apiCall('/rate-final', {
    method: 'POST',
    body: JSON.stringify({ purchaseId, rating }),
  });
}

// ============= ANALYST API =============

export async function getAnalystStats(fid: number): Promise<AnalystStats> {
  const data = await apiCall(`/analyst/${fid}`);
  return data.stats;
}

export async function getAnalystSignals(fid: number): Promise<Signal[]> {
  const data = await apiCall(`/analyst/${fid}/signals`);
  return data.signals || [];
}

export async function getAllAnalysts(): Promise<AnalystStats[]> {
  const data = await apiCall('/analysts');
  return data.analysts || [];
}

// ============= NOTIFICATIONS API =============

export async function getUserNotifications(fid: number): Promise<Notification[]> {
  const data = await apiCall(`/notifications/${fid}`);
  return data.notifications || [];
}

export async function createNotification(notification: Notification): Promise<void> {
  await apiCall('/notifications', {
    method: 'POST',
    body: JSON.stringify({ notification }),
  });
}

// ============= FOLLOW API =============

export async function followAnalyst(userFid: number, analystFid: number): Promise<void> {
  await apiCall('/follow', {
    method: 'POST',
    body: JSON.stringify({ userFid, analystFid }),
  });
}

export async function unfollowAnalyst(userFid: number, analystFid: number): Promise<void> {
  await apiCall('/unfollow', {
    method: 'POST',
    body: JSON.stringify({ userFid, analystFid }),
  });
}

export async function getUserFollows(fid: number): Promise<number[]> {
  const data = await apiCall(`/follows/${fid}`);
  return data.follows || [];
}
