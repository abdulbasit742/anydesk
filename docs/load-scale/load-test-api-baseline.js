// API baseline test
import http from 'k6/http';
export let options = {
  vus: 10,
  duration: '5m',
};
export default function() {
  http.get('https://api.remotedesk.io/health');
}
