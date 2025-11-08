import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Prefix for all routes
const prefix = '/make-server-45dfd248';

// ============= SIGNALS ROUTES =============

// Get all signals
app.get(`${prefix}/signals`, async (c) => {
  try {
    const signals = await kv.getByPrefix('signal:');
    return c.json({ success: true, signals });
  } catch (error) {
    console.log('Error fetching signals:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get signal by ID
app.get(`${prefix}/signals/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const signal = await kv.get(`signal:${id}`);
    
    if (!signal) {
      return c.json({ success: false, error: 'Signal not found' }, 404);
    }
    
    return c.json({ success: true, signal });
  } catch (error) {
    console.log('Error fetching signal:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create new signal
app.post(`${prefix}/signals`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { signal } = body;
    
    if (!signal || !signal.id) {
      return c.json({ success: false, error: 'Invalid signal data' }, 400);
    }
    
    await kv.set(`signal:${signal.id}`, signal);
    
    // Update analyst stats
    const statsKey = `analyst_stats:${signal.analystFid}`;
    const stats = await kv.get(statsKey) || {
      fid: signal.analystFid,
      totalSignals: 0,
      activeSignals: 0,
      successRate: 0,
      totalEarnings: 0,
      followers: 0,
      rating: 0
    };
    
    stats.totalSignals += 1;
    stats.activeSignals += 1;
    await kv.set(statsKey, stats);
    
    return c.json({ success: true, signal });
  } catch (error) {
    console.log('Error creating signal:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= PURCHASE ROUTES =============

// Purchase signal
app.post(`${prefix}/purchase`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { signalId, buyerFid, amount, transactionHash } = body;
    
    if (!signalId || !buyerFid || !amount) {
      return c.json({ success: false, error: 'Invalid purchase data' }, 400);
    }
    
    // Get signal
    const signal = await kv.get(`signal:${signalId}`);
    if (!signal) {
      return c.json({ success: false, error: 'Signal not found' }, 404);
    }
    
    // Create purchase record
    const purchaseId = `${buyerFid}_${signalId}_${Date.now()}`;
    const purchase = {
      id: purchaseId,
      signalId,
      buyerFid,
      amount,
      transactionHash,
      timestamp: new Date().toISOString(),
      quickRating: null,
      finalRating: null
    };
    
    await kv.set(`purchase:${purchaseId}`, purchase);
    
    // Add to user's purchases
    const userPurchasesKey = `user_purchases:${buyerFid}`;
    const userPurchases = await kv.get(userPurchasesKey) || [];
    userPurchases.push(purchaseId);
    await kv.set(userPurchasesKey, userPurchases);
    
    // Update signal purchase count
    signal.purchaseCount = (signal.purchaseCount || 0) + 1;
    await kv.set(`signal:${signalId}`, signal);
    
    // Update analyst earnings and total sales
    const statsKey = `analyst_stats:${signal.analystFid}`;
    const stats = await kv.get(statsKey);
    if (stats) {
      // 90% goes to analyst (10% platform fee)
      stats.totalEarnings += amount * 0.9;
      stats.totalSales = (stats.totalSales || 0) + 1;
      await kv.set(statsKey, stats);
    }
    
    // Create notification for seller
    const notificationId = `notification_${signal.analystFid}_${Date.now()}`;
    const notification = {
      id: notificationId,
      userFid: signal.analystFid,
      type: 'purchase_success',
      signalId: signalId,
      message: `New sale! User purchased "${signal.title}" for ${amount.toFixed(3)} ETH`,
      timestamp: new Date().toISOString(),
      read: false,
      buyerFid: buyerFid,
      amount: amount
    };
    await kv.set(`notification:${notificationId}`, notification);
    
    // Add to analyst's notifications list
    const analystNotificationsKey = `user_notifications:${signal.analystFid}`;
    const analystNotifications = await kv.get(analystNotificationsKey) || [];
    analystNotifications.push(notificationId);
    await kv.set(analystNotificationsKey, analystNotifications);
    
    return c.json({ success: true, purchase });
  } catch (error) {
    console.log('Error processing purchase:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get user purchases
app.get(`${prefix}/purchases/:fid`, async (c) => {
  try {
    const fid = c.req.param('fid');
    const userPurchasesKey = `user_purchases:${fid}`;
    const purchaseIds = await kv.get(userPurchasesKey) || [];
    
    const purchases = await Promise.all(
      purchaseIds.map((id: string) => kv.get(`purchase:${id}`))
    );
    
    return c.json({ success: true, purchases: purchases.filter(Boolean) });
  } catch (error) {
    console.log('Error fetching purchases:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Check if user purchased signal
app.get(`${prefix}/check-purchase/:fid/:signalId`, async (c) => {
  try {
    const fid = c.req.param('fid');
    const signalId = c.req.param('signalId');
    
    const userPurchasesKey = `user_purchases:${fid}`;
    const purchaseIds = await kv.get(userPurchasesKey) || [];
    
    const hasPurchased = purchaseIds.some((id: string) => id.includes(signalId));
    
    return c.json({ success: true, hasPurchased });
  } catch (error) {
    console.log('Error checking purchase:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= RATING ROUTES =============

// Submit quick rating
app.post(`${prefix}/rate-quick`, async (c) => {
  try {
    const body = await c.req.json();
    const { purchaseId, rating } = body;
    
    if (!purchaseId || !rating) {
      return c.json({ success: false, error: 'Invalid rating data' }, 400);
    }
    
    const purchase = await kv.get(`purchase:${purchaseId}`);
    if (!purchase) {
      return c.json({ success: false, error: 'Purchase not found' }, 404);
    }
    
    purchase.quickRating = rating;
    await kv.set(`purchase:${purchaseId}`, purchase);
    
    // Update signal rating
    const signal = await kv.get(`signal:${purchase.signalId}`);
    if (signal) {
      const ratingsKey = `signal_ratings:${purchase.signalId}`;
      const ratings = await kv.get(ratingsKey) || [];
      ratings.push(rating);
      await kv.set(ratingsKey, ratings);
      
      // Calculate new average
      const avgRating = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
      signal.rating = Math.round(avgRating * 10) / 10;
      signal.reviewCount = ratings.length;
      await kv.set(`signal:${purchase.signalId}`, signal);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error submitting quick rating:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Submit final rating (success/loss)
app.post(`${prefix}/rate-final`, async (c) => {
  try {
    const body = await c.req.json();
    const { purchaseId, rating } = body; // rating: "success" or "loss"
    
    if (!purchaseId || !rating) {
      return c.json({ success: false, error: 'Invalid rating data' }, 400);
    }
    
    const purchase = await kv.get(`purchase:${purchaseId}`);
    if (!purchase) {
      return c.json({ success: false, error: 'Purchase not found' }, 404);
    }
    
    purchase.finalRating = rating;
    await kv.set(`purchase:${purchaseId}`, purchase);
    
    // Update analyst success rate
    const signal = await kv.get(`signal:${purchase.signalId}`);
    if (signal) {
      const statsKey = `analyst_stats:${signal.analystFid}`;
      const stats = await kv.get(statsKey);
      
      if (stats) {
        // Get all final ratings for this analyst
        const allSignals = await kv.getByPrefix('signal:');
        const analystSignals = allSignals.filter((s: any) => s.analystFid === signal.analystFid);
        
        let totalRatings = 0;
        let successCount = 0;
        
        for (const s of analystSignals) {
          const purchases = await kv.getByPrefix(`purchase:${stats.fid}_${s.id}`);
          for (const p of purchases) {
            if (p.finalRating) {
              totalRatings++;
              if (p.finalRating === 'success') successCount++;
            }
          }
        }
        
        if (totalRatings > 0) {
          stats.successRate = Math.round((successCount / totalRatings) * 100);
          await kv.set(statsKey, stats);
        }
      }
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error submitting final rating:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= ANALYST ROUTES =============

// Get analyst stats
app.get(`${prefix}/analyst/:fid`, async (c) => {
  try {
    const fid = c.req.param('fid');
    const statsKey = `analyst_stats:${fid}`;
    const stats = await kv.get(statsKey);
    
    if (!stats) {
      // Return default stats
      return c.json({
        success: true,
        stats: {
          fid: parseInt(fid),
          totalSignals: 0,
          activeSignals: 0,
          successRate: 0,
          totalEarnings: 0,
          followers: 0,
          rating: 0
        }
      });
    }
    
    return c.json({ success: true, stats });
  } catch (error) {
    console.log('Error fetching analyst stats:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get analyst signals
app.get(`${prefix}/analyst/:fid/signals`, async (c) => {
  try {
    const fid = parseInt(c.req.param('fid'));
    const allSignals = await kv.getByPrefix('signal:');
    const analystSignals = allSignals.filter((s: any) => s.analystFid === fid);
    
    return c.json({ success: true, signals: analystSignals });
  } catch (error) {
    console.log('Error fetching analyst signals:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all analysts (sorted by success rate)
app.get(`${prefix}/analysts`, async (c) => {
  try {
    const allStats = await kv.getByPrefix('analyst_stats:');
    const sortedAnalysts = allStats.sort((a: any, b: any) => b.successRate - a.successRate);
    
    return c.json({ success: true, analysts: sortedAnalysts });
  } catch (error) {
    console.log('Error fetching analysts:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= NOTIFICATIONS ROUTES =============

// Get user notifications
app.get(`${prefix}/notifications/:fid`, async (c) => {
  try {
    const fid = c.req.param('fid');
    const notificationsKey = `notifications:${fid}`;
    const notifications = await kv.get(notificationsKey) || [];
    
    return c.json({ success: true, notifications });
  } catch (error) {
    console.log('Error fetching notifications:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create notification
app.post(`${prefix}/notifications`, async (c) => {
  try {
    const body = await c.req.json();
    const { notification } = body;
    
    if (!notification || !notification.userFid) {
      return c.json({ success: false, error: 'Invalid notification data' }, 400);
    }
    
    const notificationsKey = `notifications:${notification.userFid}`;
    const notifications = await kv.get(notificationsKey) || [];
    notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }
    
    await kv.set(notificationsKey, notifications);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error creating notification:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= FOLLOW ROUTES =============

// Follow analyst
app.post(`${prefix}/follow`, async (c) => {
  try {
    const body = await c.req.json();
    const { userFid, analystFid } = body;
    
    if (!userFid || !analystFid) {
      return c.json({ success: false, error: 'Invalid follow data' }, 400);
    }
    
    const followsKey = `user_follows:${userFid}`;
    const follows = await kv.get(followsKey) || [];
    
    if (!follows.includes(analystFid)) {
      follows.push(analystFid);
      await kv.set(followsKey, follows);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error following analyst:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Unfollow analyst
app.post(`${prefix}/unfollow`, async (c) => {
  try {
    const body = await c.req.json();
    const { userFid, analystFid } = body;
    
    if (!userFid || !analystFid) {
      return c.json({ success: false, error: 'Invalid unfollow data' }, 400);
    }
    
    const followsKey = `user_follows:${userFid}`;
    const follows = await kv.get(followsKey) || [];
    
    const index = follows.indexOf(analystFid);
    if (index > -1) {
      follows.splice(index, 1);
      await kv.set(followsKey, follows);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error unfollowing analyst:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get user follows
app.get(`${prefix}/follows/:fid`, async (c) => {
  try {
    const fid = c.req.param('fid');
    const followsKey = `user_follows:${fid}`;
    const follows = await kv.get(followsKey) || [];
    
    return c.json({ success: true, follows });
  } catch (error) {
    console.log('Error fetching follows:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============= EXPIRED SIGNALS NOTIFICATION =============

// Check for expired signals and send rating requests
app.get(`${prefix}/check-expired-signals`, async (c) => {
  try {
    const allSignals = await kv.getByPrefix('signal:');
    const now = new Date();
    
    for (const signal of allSignals) {
      const expiryDate = new Date(signal.expiryDate);
      
      // If signal expired within last hour and status is still active
      if (expiryDate < now && signal.status === 'active') {
        // Update signal status
        signal.status = 'expired';
        await kv.set(`signal:${signal.id}`, signal);
        
        // Get all purchases for this signal
        const allPurchases = await kv.getByPrefix('purchase:');
        const signalPurchases = allPurchases.filter((p: any) => 
          p.signalId === signal.id && !p.finalRating
        );
        
        // Send rating request notification to each buyer
        for (const purchase of signalPurchases) {
          const notificationId = `notification_${purchase.buyerFid}_${Date.now()}_${Math.random()}`;
          const notification = {
            id: notificationId,
            userFid: purchase.buyerFid,
            type: 'rating_request',
            signalId: signal.id,
            message: `Rate the outcome: Was "${signal.title}" successful?`,
            timestamp: new Date().toISOString(),
            read: false
          };
          
          await kv.set(`notification:${notificationId}`, notification);
          
          const userNotificationsKey = `user_notifications:${purchase.buyerFid}`;
          const userNotifications = await kv.get(userNotificationsKey) || [];
          userNotifications.push(notificationId);
          await kv.set(userNotificationsKey, userNotifications);
        }
      }
    }
    
    return c.json({ success: true, message: 'Checked expired signals' });
  } catch (error) {
    console.log('Error checking expired signals:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

console.log('🚀 Data Signals Hub Server started');

Deno.serve(app.fetch);
