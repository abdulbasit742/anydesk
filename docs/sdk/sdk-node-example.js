# Node.js SDK Example

```javascript
const { RemoteDeskClient } = require('@remotedesk/sdk');

const client = new RemoteDeskClient({
  apiUrl: 'https://api.remotedesk.io/v1',
  socketUrl: 'wss://api.remotedesk.io/signaling',
});

async function main() {
  await client.login('user@example.com', 'password');
  console.log('Desk ID:', client.getDeskId());
  
  const socket = client.connect();
  socket.on('session:request', ({ viewerDeskId }) => {
    console.log('Request from:', viewerDeskId);
  });
}

main();
```
