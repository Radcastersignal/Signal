// Initialize app with mock data for development
import { generateMockSignals } from './mockData';
import { createSignal } from './api';
import { projectId, publicAnonKey } from './supabase/info';

export async function initializeAppData() {
  try {
    console.log('🎬 Initializing app with mock data...');
    
    // Generate mock signals
    const signals = generateMockSignals();
    
    // Store them in the database (one by one to avoid rate limits)
    for (const signal of signals) {
      try {
        await createSignal(signal);
        console.log(`✅ Created signal: ${signal.title}`);
      } catch (error) {
        // Signal might already exist, that's ok
        console.log(`⚠️ Signal already exists or error: ${signal.id}`);
      }
    }
    
    console.log('✅ App initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing app:', error);
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
