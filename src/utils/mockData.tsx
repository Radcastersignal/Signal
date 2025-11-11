// Real data fetcher (replacing mockData)
import { Signal } from '../types';
import { fetchSignalsFromAPI } from './api';

/**
 * Fetch all signals from the backend (no mock).
 */
export async function getRealSignals(): Promise<Signal[]> {
  try {
    console.log("📡 Fetching real signals from API...");
    const signals = await fetchSignalsFromAPI();

    if (!signals || signals.length === 0) {
      console.warn("⚠️ No signals found in the database.");
      return [];
    }

    console.log(`✅ Loaded ${signals.length} real signals.`);
    return signals;
  } catch (error) {
    console.error("❌ Error fetching real signals:", error);
    return [];
  }
}

/**
 * Initialize or refresh data (optional for first load)
 */
export async function initializeAppData() {
  try {
    console.log("🚀 Initializing app with real data...");
    const signals = await getRealSignals();
    console.log(`✅ App initialized with ${signals.length} signals.`);
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize real data:", error);
    return false;
  }
}
