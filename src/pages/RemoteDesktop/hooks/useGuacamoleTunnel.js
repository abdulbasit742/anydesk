/**
 * useGuacamoleTunnel Hook
 * Manages WebSocket tunnel connection for Apache Guacamole remote desktop sessions,
 * featuring robust ping/pong heartbeats and exponential backoff reconnection logic.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export function useGuacamoleTunnel(tunnelUrl, options = {}) {
  const {
    pingInterval = 30000,      // Ping heartbeat every 30 seconds
    maxReconnectAttempts = 5,  // Maximum backoff attempts
    initialBackoff = 1000,     // Initial backoff delay in ms (1s)
    maxBackoff = 30000,        // Max backoff delay in ms (30s)
    onStateChange,
  } = options;

  const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected, reconnecting, error
  const [error, setError] = useState(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const wsRef = useRef(null);
  const pingTimerRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const isUnmountedRef = useRef(false);

  const updateStatus = useCallback((newStatus, err = null) => {
    if (isUnmountedRef.current) return;
    setStatus(newStatus);
    if (err) setError(err);
    if (onStateChange) onStateChange(newStatus, err);
  }, [onStateChange]);

  const clearTimers = useCallback(() => {
    if (pingTimerRef.current) {
      clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const sendPing = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Guacamole instruction format for ping or standard heartbeat frame
      try {
        wsRef.current.send('4.ping,4.keep;');
      } catch (err) {
        console.error('[GuacamoleTunnel] Failed to send ping heartbeat:', err);
      }
    }
  }, []);

  const connect = useCallback(() => {
    if (!tunnelUrl || isUnmountedRef.current) return;

    clearTimers();
    updateStatus('connecting');

    try {
      const ws = new WebSocket(tunnelUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isUnmountedRef.current) {
          ws.close();
          return;
        }
        console.log('[GuacamoleTunnel] WebSocket tunnel connected');
        updateStatus('connected');
        setReconnectAttempt(0);
        setError(null);

        // Start ping/pong heartbeat
        pingTimerRef.current = setInterval(sendPing, pingInterval);
      };

      ws.onmessage = (event) => {
        // Handle incoming Guacamole protocol instructions or pong responses
        // e.g. "4.pong,4.keep;"
        if (event.data && event.data.includes('pong')) {
          // Heartbeat acknowledged
        }
      };

      ws.onerror = (event) => {
        console.error('[GuacamoleTunnel] WebSocket error:', event);
        setError(new Error('WebSocket connection error'));
      };

      ws.onclose = (event) => {
        clearTimers();
        if (isUnmountedRef.current) return;

        console.warn(`[GuacamoleTunnel] WebSocket closed (code: ${event.code}, reason: ${event.reason})`);

        if (event.code === 1000) {
          // Normal closure
          updateStatus('disconnected');
          return;
        }

        // Handle reconnection with exponential backoff
        if (reconnectAttempt < maxReconnectAttempts) {
          const attempt = reconnectAttempt + 1;
          setReconnectAttempt(attempt);
          updateStatus('reconnecting');

          const backoff = Math.min(initialBackoff * Math.pow(2, reconnectAttempt), maxBackoff);
          const jitter = Math.random() * 500; // Add jitter to prevent thundering herd
          const delay = backoff + jitter;

          console.log(`[GuacamoleTunnel] Reconnecting in ${Math.round(delay)}ms (Attempt ${attempt}/${maxReconnectAttempts})...`);

          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          updateStatus('error', new Error('Max reconnection attempts reached. Connection failed.'));
        }
      };
    } catch (err) {
      console.error('[GuacamoleTunnel] Exception during connection setup:', err);
      updateStatus('error', err);
    }
  }, [tunnelUrl, reconnectAttempt, maxReconnectAttempts, initialBackoff, maxBackoff, pingInterval, sendPing, clearTimers, updateStatus]);

  const disconnect = useCallback(() => {
    clearTimers();
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnected');
      wsRef.current = null;
    }
    updateStatus('disconnected');
  }, [clearTimers, updateStatus]);

  useEffect(() => {
    isUnmountedRef.current = false;
    connect();

    return () => {
      isUnmountedRef.current = true;
      clearTimers();
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
        wsRef.current = null;
      }
    };
  }, [connect, clearTimers]);

  return {
    status,
    error,
    reconnectAttempt,
    connect,
    disconnect,
    socket: wsRef.current,
  };
}
