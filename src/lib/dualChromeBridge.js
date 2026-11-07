/**
 * src/lib/dualChromeBridge.js
 * Cross-Site / Cross-Profile Chrome Peer Bridge with Automated Cloud-to-Cloud Handoff
 * 
 * Enables two Chrome sites/profiles (e.g. Gmail 1 on Cloud A and Gmail 2 on Cloud B)
 * to maintain a synchronized real-time data channel and transfer summary points / state.
 */

const CHANNEL_NAME = 'agentflow_dual_chrome_sync_channel';

class DualChromeBridge {
  constructor() {
    this.channel = null;
    this.subscribers = new Set();
    this.siteId = null;
    this.gmailAccount = null;
    this.cloudPlatform = null;

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.handleIncoming(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel initialization skipped:', e);
      }
    }
  }

  /**
   * Initializes the local Chrome site profile
   * @param {string} siteId - 'site-1' | 'site-2'
   * @param {string} gmailAccount - e.g. 'dev.profile1@gmail.com'
   * @param {string} cloudPlatform - e.g. 'Bolt.new' | 'Lovable' | 'Claude'
   */
  initSite(siteId, gmailAccount, cloudPlatform) {
    this.siteId = siteId;
    this.gmailAccount = gmailAccount;
    this.cloudPlatform = cloudPlatform;

    this.broadcast({
      type: 'SITE_ANNOUNCE',
      senderSiteId: this.siteId,
      gmailAccount: this.gmailAccount,
      cloudPlatform: this.cloudPlatform,
      timestamp: Date.now()
    });
  }

  /**
   * Broadcasts a payload across all listening Chrome sites / tabs
   */
  broadcast(payload) {
    const packet = {
      ...payload,
      id: 'pkt_' + Math.random().toString(36).substring(2, 9),
      sentAt: Date.now()
    };

    if (this.channel) {
      this.channel.postMessage(packet);
    }

    // Also notify local subscribers for same-tab reactive state
    this.notifySubscribers(packet, true);
    return packet;
  }

  /**
   * Handles incoming packet from another Chrome site
   */
  handleIncoming(data) {
    if (!data) return;
    this.notifySubscribers(data, false);
  }

  /**
   * Subscribes a listener to bridge events
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  notifySubscribers(packet, isLocal = false) {
    this.subscribers.forEach((callback) => {
      try {
        callback(packet, isLocal);
      } catch (err) {
        console.error('Bridge subscriber error:', err);
      }
    });
  }

  /**
   * Automated Cloud Data & Main Points Handoff
   * Sends synthesized work summary from source cloud to target cloud
   */
  handoffCloudData({ sourceSiteId, targetSiteId, sourceCloud, targetCloud, mainPoints, taskContext, metrics }) {
    if (!mainPoints || mainPoints.length === 0) {
      throw new Error('Handoff requires at least one main point or summary context.');
    }

    const payload = {
      type: 'CLOUD_HANDOFF',
      sourceSiteId: sourceSiteId || this.siteId || 'site-1',
      targetSiteId: targetSiteId || 'site-2',
      sourceCloud: sourceCloud || this.cloudPlatform || 'Cloud-A',
      targetCloud: targetCloud || 'Cloud-B',
      mainPoints: Array.isArray(mainPoints) ? mainPoints : [mainPoints],
      taskContext: taskContext || 'Continuous Autonomous Task',
      metrics: {
        tokensUsed: metrics?.tokensUsed || 0,
        creditsConsumed: metrics?.creditsConsumed || 1,
        handoffTimestamp: Date.now()
      }
    };

    return this.broadcast(payload);
  }

  /**
   * Ping check between the two Chrome sites
   */
  sendHeartbeat() {
    return this.broadcast({
      type: 'PING',
      senderSiteId: this.siteId,
      timestamp: Date.now()
    });
  }
}

export const dualChromeBridge = new DualChromeBridge();
export default dualChromeBridge;
