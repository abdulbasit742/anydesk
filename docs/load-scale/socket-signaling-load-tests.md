# Socket Signaling Load Tests

## Tools: custom Node.js script

### Connection Test
```javascript
// tests/load/socket-connections.js
const { io } = require("socket.io-client");

async function runConnectionTest(targetConnections) {
  const connections = [];
  const startTime = Date.now();

  for (let i = 0; i < targetConnections; i++) {
    const socket = io("wss://api.remotedesk.io/signaling", {
      transports: ["websocket"],
    });

    await new Promise((resolve, reject) => {
      socket.on("connect", resolve);
      socket.on("connect_error", reject);
      setTimeout(reject, 10000);
    });

    connections.push(socket);
  }

  const elapsed = Date.now() - startTime;
  console.log(`Connected ${connections.length} clients in ${elapsed}ms`);
  console.log(`Avg connection time: ${elapsed / targetConnections}ms`);

  // Cleanup
  connections.forEach((s) => s.disconnect());
}

runConnectionTest(1000).catch(console.error);
```

### Signaling Throughput
```javascript
async function runMessageThroughputTest(numClients, messagesPerClient) {
  const received = new Map();
  const sockets = [];

  for (let i = 0; i < numClients; i += 2) {
    const s1 = io("wss://api.remotedesk.io/signaling");
    const s2 = io("wss://api.remotedesk.io/signaling");
    await Promise.all([waitForConnect(s1), waitForConnect(s2)]);

    s1.emit("signaling:join", { deskId: `desk_${i}` });
    s2.emit("signaling:join", { deskId: `desk_${i + 1}` });

    let receivedCount = 0;
    s2.on("signaling:offer", () => receivedCount++);
    received.set(i, () => receivedCount);

    sockets.push(s1, s2);
  }

  const start = Date.now();
  for (let i = 0; i < numClients; i += 2) {
    for (let m = 0; m < messagesPerClient; m++) {
      sockets[i].emit("signaling:offer", {
        targetDeskId: `desk_${i + 1}`,
        offer: { type: "offer", sdp: "v=0\r\n..." },
      });
    }
  }

  await delay(5000);
  const elapsed = Date.now() - start;
  const totalReceived = Array.from(received.values()).reduce((sum, fn) => sum + fn(), 0);
  console.log(`Throughput: ${totalReceived} messages in ${elapsed}ms`);
  console.log(`Rate: ${(totalReceived / elapsed * 1000).toFixed(0)} msg/sec`);

  sockets.forEach((s) => s.disconnect());
}

function waitForConnect(socket) {
  return new Promise((resolve) => socket.on("connect", resolve));
}
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms)); }

runMessageThroughputTest(100, 100);
```

## Expected Results
| Metric | Target |
|--------|--------|
| Max concurrent connections | 10,000 |
| Connection time (p95) | < 1s |
| Message latency (p95) | < 100ms |
| Message throughput | > 10,000/sec |
