// WebRTC Load Test Script
const { RTCPeerConnection } = require('wrtc');

async function runWebRTCLoadTest(numPairs) {
  const pairs = [];
  
  for (let i = 0; i < numPairs; i++) {
    const pc1 = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    const pc2 = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    
    pc1.onicecandidate = e => e.candidate && pc2.addIceCandidate(e.candidate);
    pc2.onicecandidate = e => e.candidate && pc1.addIceCandidate(e.candidate);
    
    const offer = await pc1.createOffer();
    await pc1.setLocalDescription(offer);
    await pc2.setRemoteDescription(offer);
    
    const answer = await pc2.createAnswer();
    await pc2.setLocalDescription(answer);
    await pc1.setRemoteDescription(answer);
    
    pairs.push({ pc1, pc2 });
  }
  
  await new Promise(r => setTimeout(r, 5000));
  const connected = pairs.filter(p => p.pc1.connectionState === 'connected');
  console.log(`Connected: ${connected.length}/${numPairs}`);
  pairs.forEach(p => { p.pc1.close(); p.pc2.close(); });
}

runWebRTCLoadTest(100);
