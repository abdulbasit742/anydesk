// Socket.IO baseline test
import ws from 'k6/ws';
export let options = {
  vus: 10,
  duration: '5m',
};
export default function() {
  ws.connect('wss://api.remotedesk.io/signaling', null, function(socket) {
    socket.on('open', function() {
      socket.send(JSON.stringify({type: 'ping'}));
    });
    socket.setTimeout(function() { socket.close(); }, 30000);
  });
}
