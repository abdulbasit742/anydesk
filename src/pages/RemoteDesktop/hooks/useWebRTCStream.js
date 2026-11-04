import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing WebRTC streaming, RTCPeerConnection lifecycle,
 * SDP negotiation, and robust renegotiation handling.
 */
export function useuseWebRTCStream({
  signalingSocket,
  roomId,
  constraints = { video: true, audio: true },
  iceServers = [{ urls: 'stun:stun.l.google.com:19302' }]
} = {}) {
  const [connectionState, setConnectionState] = useState('new');
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [error, setError] = useState(null);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const isNegotiatingRef = useRef(false);

  // Initialize Local Media Stream Lifecycle
  const startLocalStream = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = s;
      setStream(s);
      if (pcRef.current) {
        s.getTracks().forEach(track => {
          pcRef.current.addTrack(track, s);
        });
      }
      return s;
    } catch (err) {
      console.error('Failed to get local media stream:', err);
      setError(err);
      throw err;
    }
  }, [constraints]);

  // Stop Local Media Stream Lifecycle
  const stopLocalStream = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
      setStream(null);
    }
  }, []);

  // Initialize RTCPeerConnection & Event Handlers
  const initPeerConnection = useCallback(() => {
    if (pcRef.current) return pcRef.current;

    const pc = new RTCPeerConnection({ iceServers });
    pcRef.current = pc;

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        console.warn('WebRTC connection state degraded:', pc.connectionState);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && signalingSocket && signalingSocket.send) {
        signalingSocket.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate, roomId }));
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    // Robust renegotiation handling via onnegotiationneeded
    pc.onnegotiationneeded = async () => {
      try {
        if (isNegotiatingRef.current) return;
        isNegotiatingRef.current = true;

        const offer = await pc.createOffer();
        if (pc.signalingState !== 'stable') return;
        
        await pc.setLocalDescription(offer);
        if (signalingSocket && signalingSocket.send) {
          signalingSocket.send(JSON.stringify({ type: 'offer', sdp: pc.localDescription, roomId }));
        }
      } catch (err) {
        console.error('Renegotiation / negotiation error:', err);
        setError(err);
      } finally {
        isNegotiatingRef.current = false;
      }
    };

    // Attach existing local tracks if any
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    return pc;
  }, [iceServers, roomId, signalingSocket]);

  // Handle incoming signaling messages (offer, answer, ice-candidate)
  const handleSignalingMessage = useCallback(async (msg) => {
    const pc = initPeerConnection();
    try {
      if (msg.type === 'offer') {
        if (pc.signalingState !== 'stable') {
          // Handle glare / polite-impolite peer logic if needed
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          if (signalingSocket && signalingSocket.send) {
            signalingSocket.send(JSON.stringify({ type: 'answer', sdp: pc.localDescription, roomId }));
          }
        }
      } else if (msg.type === 'answer') {
        if (pc.signalingState === 'have-local-offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        }
      } else if (msg.type === 'ice-candidate' && msg.candidate) {
        if (pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
        }
      }
    } catch (err) {
      console.error('Error handling signaling message:', err);
      setError(err);
    }
  }, [initPeerConnection, roomId, signalingSocket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocalStream();
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, [stopLocalStream]);

  return {
    stream,
    remoteStream,
    connectionState,
    error,
    startLocalStream,
    stopLocalStream,
    initPeerConnection,
    handleSignalingMessage,
  };
}
