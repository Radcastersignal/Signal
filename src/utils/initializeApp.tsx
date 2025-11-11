// Initialize app with real data (no mock)
import { fetchSignalsFromAPI } from './api';
import { projectId, publicAnonKey } from './supabase/info';

export async function initializeAppData() {
  try {
    console.log('🎬 Initializing app with real data...');

    // Fetch signals from your backend API or Supabase
    const signals = await fetchSignalsFromAPI();

    if (!signals || signals.length === 0) {
      console.warn('⚠️ No signals found in database.');
      return false;
    }

    console.log(`✅ Loaded ${signals.length} signals from API.`);
    return true;
  } catch (error) {
    console.error('❌ Error initializing app with real data:', error);
    return false;
  }
}


// Check for expired signals periodically
async function checkExpiredSignals() {
  try {
    const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-45dfd248`;
    await fetch(`${API_BASE}/check-expired-signals`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    console.log('✅ Checked expired signals');
  } catch (error) {
    console.error('Error checking expired signals:', error);
  }
}

// Call this once when the app first loads
export async function checkAndInitialize() {
  const initialized = localStorage.getItem('app_initialized');
  
  if (!initialized) {
    await initializeAppData();
    localStorage.setItem('app_initialized', 'true');
  }
  
  // Check expired signals immediately
  await checkExpiredSignals();
  
  // Check every hour for expired signals
  setInterval(checkExpiredSignals, 60 * 60 * 1000);
}
