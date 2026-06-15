# RemoteDesk WebRTC Examples

## Screen Capture
```javascript
// Get display media (screen/window/tab)
async function startCapture(displaySurface = "monitor") {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      displaySurface,
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 30 }
    },
    audio: false
  });
  return stream;
}

// Show in video element
const video = document.getElementById("preview");
video.srcObject = stream;
video.play();
```

## Create Peer Connection
```javascript
const config = {
  iceServers: [
    { urls: "stun:stun.remotedesk.io:3478" },
    {
      urls: "turn:turn.remotedesk.io:3478",
      username: "user",
      credential: "pass"
    }
  ],
  iceTransportPolicy: "all"
};

const pc = new RTCPeerConnection(config);

// Add local stream
stream.getTracks().forEach(track => {
  pc.addTrack(track, stream);
});

// Handle remote stream
pc.ontrack = (event) => {
  const remoteVideo = document.getElementById("remote");
  remoteVideo.srcObject = event.streams[0];
};

// Handle ICE candidates
pc.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit("signaling:ice-candidate", {
      targetDeskId,
      candidate: event.candidate
    });
  }
};

// Monitor connection state
pc.onconnectionstatechange = () => {
  console.log("Connection state:", pc.connectionState);
};
```

## Create Offer
```javascript
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

socket.emit("signaling:offer", {
  targetDeskId: "987654321",
  offer
});
```

## Handle Answer
```javascript
socket.on("signaling:answer", async ({ answer }) => {
  await pc.setRemoteDescription(answer);
});
```

## Data Channel (File Transfer, Chat, Clipboard)
```javascript
const dataChannel = pc.createDataChannel("fileTransfer", {
  ordered: true
});

dataChannel.onopen = () => {
  console.log("Data channel open");
};

dataChannel.onmessage = (event) => {
  const data = JSON.parse(event.data);
  handleDataChannelMessage(data);
};

// Send file
function sendFile(file) {
  const chunkSize = 16384;
  let offset = 0;
  
  const reader = new FileReader();
  reader.onload = () => {
    if (dataChannel.readyState === "open") {
      dataChannel.send(reader.result);
      offset += chunkSize;
      if (offset < file.size) {
        readSlice(offset);
      }
    }
  };
  
  function readSlice(o) {
    const slice = file.slice(o, o + chunkSize);
    reader.readAsArrayBuffer(slice);
  }
  
  readSlice(0);
}
```
