# Mobile WebRTC QA Checklist

## Signaling
- [ ] Socket connects with auth token
- [ ] Reconnects after 5s offline
- [ ] Reconnects after 30s offline (max 5 attempts)
- [ ] Error event shows toast

## Offer/Answer
- [ ] Host creates offer
- [ ] Client creates answer
- [ ] Exchange completes < 3s on LAN

## ICE
- [ ] Candidates exchanged
- [ ] Connection established via STUN
- [ ] Connection established via TURN (force relay)

## Media
- [ ] Remote stream renders in RTCView
- [ ] Aspect ratio correct (contain)
- [ ] Orientation change handled

## Stats
- [ ] Quality badge shows excellent on LAN
- [ ] Quality degrades on throttled network
- [ ] Stats update every 3s

## Data Channel
- [ ] Chat messages deliver
- [ ] Input events deliver
- [ ] Heartbeats keep alive
