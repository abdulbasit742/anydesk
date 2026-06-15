# TURN Server Deployment Checklist

## Prerequisites
- [ ] Domain with SSL certificate
- [ ] Firewall ports open (3478, 5349, UDP 10000-20000)
- [ ] Server with sufficient bandwidth

## Configuration
- [ ] Install coturn: `apt-get install coturn`
- [ ] Configure `/etc/turnserver.conf`
- [ ] Set static auth secret
- [ ] Enable TLS/DTLS
- [ ] Configure realm

## coturn Config Example
```
listening-port=3478
tls-listening-port=5349
fingerprint
use-auth-secret
static-auth-secret=YOUR_SECRET
realm=your-domain.com
cert=/path/to/cert.pem
pkey=/path/to/key.pem
no-cli
```

## Testing
- [ ] Test with `turnutils_uclient`
- [ ] Verify Trickle ICE
- [ ] Check firewall rules
- [ ] Monitor bandwidth usage

## Integration
- [ ] Add TURN config to WebRTC
- [ ] Test fallback scenario
- [ ] Monitor connection success rate
