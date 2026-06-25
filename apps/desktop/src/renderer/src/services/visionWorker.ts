/**
 * Vision Worker Service
 * Handles frame sampling, OCR, object detection, and event generation
 * Runs in a background Web Worker to avoid blocking the main thread
 */

export interface VisionEvent {
  eventType: string;
  confidence: number;
  metadata: Record<string, any>;
  timestamp: number;
}

export interface VisionWorkerMessage {
  type: "init" | "analyze-frame" | "get-status";
  data?: any;
}

export interface VisionWorkerResponse {
  type: "ready" | "event" | "error" | "status";
  data?: any;
}

export class VisionWorkerManager {
  private worker: Worker | null = null;
  private eventListeners: ((event: VisionEvent) => void)[] = [];
  private isReady = false;

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker() {
    // Create an inline worker using a blob
    const workerCode = `
      let ocrReady = false;
      let lastFrameTime = 0;
      const FRAME_ANALYSIS_INTERVAL = 200; // ms between analyses

      // Initialize Tesseract.js for OCR
      async function initOCR() {
        try {
          // Tesseract.js will be loaded from CDN
          if (typeof Tesseract !== 'undefined') {
            ocrReady = true;
            self.postMessage({ type: 'ready', data: { ocr: true } });
          }
        } catch (error) {
          console.error('Failed to initialize OCR:', error);
          self.postMessage({ type: 'error', data: { message: 'OCR init failed' } });
        }
      }

      // Analyze frame for OCR and patterns
      async function analyzeFrame(frameData) {
        const now = Date.now();
        if (now - lastFrameTime < FRAME_ANALYSIS_INTERVAL) {
          return; // Skip if too soon
        }
        lastFrameTime = now;

        const events = [];

        // Basic pattern detection (without Tesseract for now)
        // In production, integrate Tesseract.js for actual OCR
        try {
          // Detect common error patterns in the image
          const errorPatterns = [
            { pattern: /error/i, eventType: 'error_detected', confidence: 0.7 },
            { pattern: /crash/i, eventType: 'error_detected', confidence: 0.8 },
            { pattern: /not responding/i, eventType: 'app_unresponsive', confidence: 0.75 },
          ];

          // Simulate OCR by analyzing image metadata
          // In production, use Tesseract.js to extract actual text
          const ocrText = frameData.metadata?.text || '';
          
          for (const { pattern, eventType, confidence } of errorPatterns) {
            if (pattern.test(ocrText)) {
              events.push({
                eventType,
                confidence,
                metadata: { text: ocrText, pattern: pattern.source },
                timestamp: now,
              });
            }
          }

          // Detect screen idle (no significant changes)
          if (frameData.isIdle) {
            events.push({
              eventType: 'idle',
              confidence: 0.9,
              metadata: { duration: frameData.idleDuration },
              timestamp: now,
            });
          }

          // Send all detected events
          for (const event of events) {
            self.postMessage({ type: 'event', data: event });
          }
        } catch (error) {
          console.error('Frame analysis error:', error);
        }
      }

      // Handle messages from main thread
      self.onmessage = async (e) => {
        const { type, data } = e.data;

        switch (type) {
          case 'init':
            await initOCR();
            break;
          case 'analyze-frame':
            await analyzeFrame(data);
            break;
          case 'get-status':
            self.postMessage({
              type: 'status',
              data: { ocrReady, lastFrameTime },
            });
            break;
          default:
            console.warn('Unknown worker message type:', type);
        }
      };

      // Notify that worker is ready
      self.postMessage({ type: 'ready', data: { worker: true } });
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);

    try {
      this.worker = new Worker(workerUrl);
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);
      this.worker.postMessage({ type: 'init' });
    } catch (error) {
      console.error('Failed to create vision worker:', error);
    }
  }

  private handleWorkerMessage(event: MessageEvent<VisionWorkerResponse>) {
    const { type, data } = event.data;

    switch (type) {
      case 'ready':
        this.isReady = true;
        console.log('Vision worker ready');
        break;
      case 'event':
        this.eventListeners.forEach((listener) => listener(data as VisionEvent));
        break;
      case 'status':
        console.log('Vision worker status:', data);
        break;
      case 'error':
        console.error('Vision worker error:', data);
        break;
    }
  }

  private handleWorkerError(error: ErrorEvent) {
    console.error('Vision worker error:', error.message);
    this.isReady = false;
  }

  public analyzeFrame(frameCanvas: HTMLCanvasElement, metadata?: Record<string, any>) {
    if (!this.worker || !this.isReady) {
      return;
    }

    try {
      const imageData = frameCanvas.getContext('2d')?.getImageData(0, 0, frameCanvas.width, frameCanvas.height);
      if (!imageData) return;

      // Send frame data to worker
      this.worker.postMessage({
        type: 'analyze-frame',
        data: {
          imageData,
          metadata,
        },
      });
    } catch (error) {
      console.error('Failed to analyze frame:', error);
    }
  }

  public onVisionEvent(listener: (event: VisionEvent) => void) {
    this.eventListeners.push(listener);
  }

  public removeEventListener(listener: (event: VisionEvent) => void) {
    this.eventListeners = this.eventListeners.filter((l) => l !== listener);
  }

  public getStatus() {
    if (this.worker) {
      this.worker.postMessage({ type: 'get-status' });
    }
  }

  public dispose() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.eventListeners = [];
  }
}
