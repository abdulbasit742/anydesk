# RemoteDesk Smoke Test Suite

## Test Schedule: Run after every deployment
## Duration: < 5 minutes

### Authentication
- [ ] User can register with email
- [ ] User can login with credentials
- [ ] Login fails with wrong password
- [ ] Session token is generated
- [ ] Token expires correctly

### Session Management
- [ ] 9-digit desk ID is generated
- [ ] Desk ID is unique
- [ ] Session starts successfully
- [ ] Session ends correctly
- [ ] Multiple sessions per user work

### WebRTC
- [ ] Can capture screen
- [ ] Offer/Answer exchange works
- [ ] ICE candidates are gathered
- [ ] Connection state reaches "connected"
- [ ] Video stream is received

### Core Features
- [ ] Remote input is received
- [ ] Clipboard sync works (if enabled)
- [ ] File transfer completes
- [ ] Chat messages are delivered

### API Health
- [ ] /health returns 200
- [ ] /ready returns 200
- [ ] API response time < 500ms
- [ ] Rate limiting works
