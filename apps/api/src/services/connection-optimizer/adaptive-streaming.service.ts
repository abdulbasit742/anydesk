import { prisma } from "../../lib/prisma.js";

// Quality profiles with their parameters
export const QUALITY_PROFILES = {
  "4k": { resolution: "3840x2160", fps: 60, bitrate: 50, compression: "lossless", minBandwidth: 80 },
  "1080p_high": { resolution: "1920x1080", fps: 60, bitrate: 20, compression: "h265", minBandwidth: 25 },
  "1080p": { resolution: "1920x1080", fps: 30, bitrate: 10, compression: "h265", minBandwidth: 12 },
  "720p": { resolution: "1280x720", fps: 30, bitrate: 5, compression: "h264", minBandwidth: 6 },
  "720p_low": { resolution: "1280x720", fps: 15, bitrate: 2, compression: "h264", minBandwidth: 2.5 },
  "480p": { resolution: "854x480", fps: 15, bitrate: 1, compression: "h264", minBandwidth: 1.2 },
  "360p": { resolution: "640x360", fps: 10, bitrate: 0.5, compression: "h264", minBandwidth: 0.6 },
  text_only: { resolution: "native", fps: 5, bitrate: 0.1, compression: "text_priority", minBandwidth: 0.05 },
} as const;

export type QualityProfile = keyof typeof QUALITY_PROFILES;

// Protocol fallback chain
export const PROTOCOL_CHAIN = ["custom_udp", "quic", "websocket", "http_longpoll"] as const;

export const adaptiveStreamingService = {
  // Determine optimal quality profile based on network conditions
  determineQualityProfile(metrics: {
    bandwidth: number; // Mbps
    latency: number; // ms
    packetLoss: number; // percentage
    jitter: number; // ms
  }): { profile: QualityProfile; confidence: number; enableFEC: boolean; enablePredictive: boolean } {
    const { bandwidth, latency, packetLoss, jitter } = metrics;

    let enableFEC = false;
    let enablePredictive = false;

    // Enable FEC if packet loss detected
    if (packetLoss > 1) enableFEC = true;

    // Enable predictive rendering if high latency
    if (latency > 100) enablePredictive = true;

    // Determine profile based on available bandwidth
    let profile: QualityProfile;
    let confidence = 0.9;

    if (bandwidth >= 80 && latency < 20 && packetLoss < 0.1) {
      profile = "4k";
    } else if (bandwidth >= 25 && latency < 30) {
      profile = "1080p_high";
    } else if (bandwidth >= 12 && latency < 50) {
      profile = "1080p";
    } else if (bandwidth >= 6 && latency < 80) {
      profile = "720p";
    } else if (bandwidth >= 2.5) {
      profile = "720p_low";
    } else if (bandwidth >= 1.2) {
      profile = "480p";
    } else if (bandwidth >= 0.6) {
      profile = "360p";
      confidence = 0.7;
    } else {
      profile = "text_only";
      confidence = 0.6;
    }

    // Degrade if high jitter or packet loss
    if (jitter > 50 || packetLoss > 5) {
      const profiles = Object.keys(QUALITY_PROFILES) as QualityProfile[];
      const currentIdx = profiles.indexOf(profile);
      if (currentIdx < profiles.length - 1) {
        profile = profiles[currentIdx + 1];
        confidence -= 0.1;
      }
    }

    return { profile, confidence, enableFEC, enablePredictive };
  },

  // Record a quality adaptation event
  async recordAdaptation(
    sessionId: string,
    reason: string,
    previous: { profile: string; bitrate: number; resolution: string; fps: number },
    current: { profile: string; bitrate: number; resolution: string; fps: number },
    aiConfidence?: number
  ) {
    return prisma.qualityAdaptationEvent.create({
      data: {
        sessionId,
        reason,
        previousProfile: previous.profile,
        newProfile: current.profile,
        previousBitrate: previous.bitrate,
        newBitrate: current.bitrate,
        previousResolution: previous.resolution,
        newResolution: current.resolution,
        previousFps: previous.fps,
        newFps: current.fps,
        aiConfidence,
      },
    });
  },

  // Get adaptation history for a session
  async getAdaptationHistory(sessionId: string) {
    return prisma.qualityAdaptationEvent.findMany({
      where: { sessionId },
      orderBy: { timestamp: "desc" },
    });
  },

  // Determine optimal protocol based on network conditions
  selectProtocol(metrics: {
    latency: number;
    packetLoss: number;
    firewallRestrictions?: boolean;
    browserBased?: boolean;
  }): string {
    const { latency, packetLoss, firewallRestrictions, browserBased } = metrics;

    // Browser-based: use WebSocket or WebTransport
    if (browserBased) {
      return latency < 50 ? "webtransport" : "websocket";
    }

    // Firewall restrictions: fall back to WebSocket
    if (firewallRestrictions) {
      return "websocket";
    }

    // Low latency, low packet loss: custom UDP
    if (latency < 50 && packetLoss < 2) {
      return "custom_udp";
    }

    // Moderate conditions: QUIC (handles network changes well)
    if (latency < 150) {
      return "quic";
    }

    // Poor conditions: WebSocket (reliable)
    return "websocket";
  },

  // Calculate compression strategy for a frame
  getCompressionStrategy(frameInfo: {
    hasText: boolean;
    hasVideo: boolean;
    hasPhotos: boolean;
    cursorX: number;
    cursorY: number;
    frameWidth: number;
    frameHeight: number;
    bandwidth: number;
  }) {
    const { hasText, hasVideo, hasPhotos, cursorX, cursorY, frameWidth, frameHeight, bandwidth } = frameInfo;

    // Region of Interest (ROI) around cursor
    const roiRadius = Math.min(200, Math.max(100, bandwidth * 10)); // pixels
    const roi = {
      x: Math.max(0, cursorX - roiRadius),
      y: Math.max(0, cursorY - roiRadius),
      width: Math.min(roiRadius * 2, frameWidth - cursorX + roiRadius),
      height: Math.min(roiRadius * 2, frameHeight - cursorY + roiRadius),
      quality: "high",
    };

    // Content-aware compression
    const regions: Array<{
      type: string;
      compression: string;
      quality: number;
    }> = [];

    if (hasText) {
      regions.push({ type: "text", compression: "lossless", quality: 100 });
    }
    if (hasVideo) {
      regions.push({ type: "video", compression: "h265", quality: 70 });
    }
    if (hasPhotos) {
      regions.push({ type: "photo", compression: "jpeg", quality: 80 });
    }

    // AI super-resolution: send low-res if bandwidth is limited
    const useSuperResolution = bandwidth < 5;

    return {
      roi,
      regions,
      useSuperResolution,
      useDeltaEncoding: true, // Always use delta encoding
      useTextDetection: hasText && bandwidth < 2,
    };
  },

  // Predict next frame requirements (for predictive rendering)
  predictNextFrame(history: Array<{ cursorX: number; cursorY: number; scrollY: number; timestamp: number }>) {
    if (history.length < 3) return null;

    const recent = history.slice(-5);
    
    // Calculate cursor velocity
    const last = recent[recent.length - 1];
    const prev = recent[recent.length - 2];
    const dt = (last.timestamp - prev.timestamp) / 1000; // seconds

    if (dt === 0) return null;

    const velocityX = (last.cursorX - prev.cursorX) / dt;
    const velocityY = (last.cursorY - prev.cursorY) / dt;
    const scrollVelocity = (last.scrollY - prev.scrollY) / dt;

    // Predict position 100ms ahead
    const predictTime = 0.1; // seconds
    const predictedX = last.cursorX + velocityX * predictTime;
    const predictedY = last.cursorY + velocityY * predictTime;
    const predictedScroll = last.scrollY + scrollVelocity * predictTime;

    // Determine if user is scrolling
    const isScrolling = Math.abs(scrollVelocity) > 100;

    return {
      predictedCursorX: Math.round(predictedX),
      predictedCursorY: Math.round(predictedY),
      predictedScrollY: Math.round(predictedScroll),
      isScrolling,
      confidence: Math.min(0.95, 0.5 + (recent.length * 0.1)),
      preRenderArea: {
        x: Math.round(predictedX - 200),
        y: isScrolling ? Math.round(predictedScroll) : Math.round(predictedY - 200),
        width: 400,
        height: isScrolling ? 800 : 400,
      },
    };
  },
};
