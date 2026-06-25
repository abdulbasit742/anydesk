/**
 * Vision Pipeline Service
 * Handles frame capture, sampling, and event dispatch to backend
 */

import type { VisionEvent } from './visionWorker.js';
import { VisionWorkerManager } from './visionWorker.js';

export interface VisionPipelineConfig {
  frameRate?: number; // frames per second (1-5 recommended)
  sessionId: string;
  apiBaseUrl: string;
  authToken: string;
}

export class VisionPipeline {
  private config: VisionPipelineConfig;
  private worker: VisionWorkerManager;
  private frameCanvas: HTMLCanvasElement | null = null;
  private frameContext: CanvasRenderingContext2D | null = null;
  private stream: MediaStream | null = null;
  private video: HTMLVideoElement | null = null;
  private animationFrameId: number | null = null;
  private lastFrameTime = 0;
  private frameInterval: number;
  private isRunning = false;
  private eventQueue: VisionEvent[] = [];
  private eventDispatchInterval: NodeJS.Timeout | null = null;

  constructor(config: VisionPipelineConfig) {
    this.config = {
      frameRate: 2, // Default to 2 fps
      ...config,
    };
    this.frameInterval = 1000 / (this.config.frameRate || 2);
    this.worker = new VisionWorkerManager();
    this.setupWorkerListeners();
  }

  private setupWorkerListeners() {
    this.worker.onVisionEvent((event: VisionEvent) => {
      this.eventQueue.push(event);
    });
  }

  /**
   * Start the vision pipeline with a media stream
   */
  public start(stream: MediaStream) {
    if (this.isRunning) {
      console.warn('Vision pipeline already running');
      return;
    }

    this.stream = stream;
    this.setupFrameCapture();
    this.startFrameSampling();
    this.startEventDispatcher();
    this.isRunning = true;
    console.log('Vision pipeline started');
  }

  /**
   * Stop the vision pipeline
   */
  public stop() {
    if (!this.isRunning) return;

    this.stopFrameSampling();
    this.stopEventDispatcher();
    this.cleanupFrameCapture();
    this.isRunning = false;
    console.log('Vision pipeline stopped');
  }

  /**
   * Setup canvas for frame capture
   */
  private setupFrameCapture() {
    if (!this.stream) return;

    // Create offscreen canvas for frame capture
    this.frameCanvas = new OffscreenCanvas(1920, 1080);
    this.frameContext = this.frameCanvas.getContext('2d');

    // Create hidden video element to read stream frames
    this.video = document.createElement('video');
    this.video.srcObject = this.stream;
    this.video.autoplay = true;
    this.video.playsInline = true;
    this.video.style.display = 'none';
    document.body.appendChild(this.video);
  }

  /**
   * Cleanup frame capture resources
   */
  private cleanupFrameCapture() {
    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
      document.body.removeChild(this.video);
      this.video = null;
    }
    this.frameCanvas = null;
    this.frameContext = null;
  }

  /**
   * Start sampling frames at configured rate
   */
  private startFrameSampling() {
    const captureFrame = () => {
      const now = Date.now();
      if (now - this.lastFrameTime >= this.frameInterval) {
        this.captureAndAnalyzeFrame();
        this.lastFrameTime = now;
      }
      this.animationFrameId = requestAnimationFrame(captureFrame);
    };

    this.animationFrameId = requestAnimationFrame(captureFrame);
  }

  /**
   * Stop frame sampling
   */
  private stopFrameSampling() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Capture current frame and send to worker for analysis
   */
  private captureAndAnalyzeFrame() {
    if (!this.frameCanvas || !this.frameContext || !this.video) return;

    try {
      // Draw current video frame to canvas
      this.frameContext.drawImage(this.video, 0, 0, this.frameCanvas.width, this.frameCanvas.height);

      // Convert to regular canvas for worker processing
      const canvas = document.createElement('canvas');
      canvas.width = this.frameCanvas.width;
      canvas.height = this.frameCanvas.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const imageData = this.frameContext.getImageData(0, 0, this.frameCanvas.width, this.frameCanvas.height);
      ctx.putImageData(imageData, 0, 0);

      // Send to worker for analysis
      this.worker.analyzeFrame(canvas, {
        timestamp: Date.now(),
        width: canvas.width,
        height: canvas.height,
      });
    } catch (error) {
      console.error('Failed to capture frame:', error);
    }
  }

  /**
   * Start dispatching accumulated events to backend
   */
  private startEventDispatcher() {
    // Dispatch events every 5 seconds or when queue reaches 10 events
    this.eventDispatchInterval = setInterval(() => {
      this.dispatchEvents();
    }, 5000);
  }

  /**
   * Stop event dispatcher
   */
  private stopEventDispatcher() {
    if (this.eventDispatchInterval) {
      clearInterval(this.eventDispatchInterval);
      this.eventDispatchInterval = null;
    }
    // Dispatch any remaining events
    this.dispatchEvents();
  }

  /**
   * Send accumulated events to backend API
   */
  private async dispatchEvents() {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      for (const event of eventsToSend) {
        await this.sendEventToBackend(event);
      }
    } catch (error) {
      console.error('Failed to dispatch vision events:', error);
      // Re-queue events on failure
      this.eventQueue.unshift(...eventsToSend);
    }
  }

  /**
   * Send a single event to the backend API
   */
  private async sendEventToBackend(event: VisionEvent) {
    const response = await fetch(`${this.config.apiBaseUrl}/api/vision/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.authToken}`,
      },
      body: JSON.stringify({
        sessionId: this.config.sessionId,
        eventType: event.eventType,
        confidence: event.confidence,
        metadata: event.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send event: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get pipeline status
   */
  public getStatus() {
    return {
      isRunning: this.isRunning,
      eventQueueSize: this.eventQueue.length,
      frameRate: this.config.frameRate,
      sessionId: this.config.sessionId,
    };
  }

  /**
   * Cleanup resources
   */
  public dispose() {
    this.stop();
    this.worker.dispose();
  }
}
