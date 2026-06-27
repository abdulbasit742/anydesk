import { collectWebRtcStats, type WebRtcQualitySnapshot } from "./webrtcStats.js";

export type IceServerConfig = { urls: string; username?: string; credential?: string };

const DEFAULT_ICE_SERVERS: IceServerConfig[] = [
  { urls: "stun:stun.l.google.com:19302" }
];

export class PeerConnectionManager {
  private peer: RTCPeerConnection;
  private channels = new Map<string, RTCDataChannel>();

  constructor(iceServers: IceServerConfig[] = DEFAULT_ICE_SERVERS) {
    this.peer = new RTCPeerConnection({ iceServers });
  }

  onIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
    this.peer.onicecandidate = (event) => {
      if (event.candidate) callback(event.candidate);
    };
  }

  onTrack(callback: (stream: MediaStream) => void) {
    this.peer.ontrack = (event) => callback(event.streams[0]);
  }

  onConnectionState(callback: (state: RTCPeerConnectionState) => void) {
    this.peer.onconnectionstatechange = () => callback(this.peer.connectionState);
  }

  onDataChannel(callback: (channel: RTCDataChannel) => void) {
    this.peer.ondatachannel = (event) => {
      this.channels.set(event.channel.label, event.channel);
      callback(event.channel);
    };
  }

  addStream(stream: MediaStream) {
    stream.getTracks().forEach((track) => this.peer.addTrack(track, stream));
  }

  createDataChannel(label: string) {
    const channel = this.peer.createDataChannel(label, { ordered: true });
    this.channels.set(label, channel);
    return channel;
  }

  getDataChannel(label: string) {
    return this.channels.get(label);
  }

  getConnectionStates() {
    return {
      connectionState: this.peer.connectionState,
      iceConnectionState: this.peer.iceConnectionState,
      signalingState: this.peer.signalingState
    };
  }

  async collectQualitySnapshot(): Promise<WebRtcQualitySnapshot> {
    return collectWebRtcStats(this.peer);
  }

  async createOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

  async acceptOffer(offer: RTCSessionDescriptionInit) {
    await this.peer.setRemoteDescription(offer);
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);
    return answer;
  }

  async acceptAnswer(answer: RTCSessionDescriptionInit) {
    await this.peer.setRemoteDescription(answer);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    await this.peer.addIceCandidate(candidate);
  }

  close() {
    this.channels.forEach((channel) => channel.close());
    this.channels.clear();
    this.peer.close();
  }
}
