# API QA Test Scripts

## Base URL: https://api.remotedesk.io/v1

### Auth Endpoints
```bash
# Register
curl -X POST $BASE/auth/register -d '{"email":"test@example.com","password":"SecurePass123!"}'
# Expect: 201, user object

# Login
curl -X POST $BASE/auth/login -d '{"email":"test@example.com","password":"SecurePass123!"}'
# Expect: 200, {token, deskId}

# Invalid login
curl -X POST $BASE/auth/login -d '{"email":"test@example.com","password":"wrong"}'
# Expect: 401
```

### Session Endpoints
```bash
# Create session (auth required)
curl -H "Authorization: Bearer $TOKEN" -X POST $BASE/sessions
# Expect: 201, session object

# Get session
curl -H "Authorization: Bearer $TOKEN" $BASE/sessions/$DESK_ID
# Expect: 200, session object

# End session
curl -H "Authorization: Bearer $TOKEN" -X DELETE $BASE/sessions/$DESK_ID
# Expect: 200
```

### Device Endpoints
```bash
# List devices
curl -H "Authorization: Bearer $TOKEN" $BASE/devices
# Expect: 200, array of devices

# Trust device
curl -H "Authorization: Bearer $TOKEN" -X POST $BASE/devices/$ID/trust
# Expect: 200
```

### Rate Limiting
```bash
# Exceed login limit
for i in {1..10}; do
  curl -X POST $BASE/auth/login -d '{"email":"test@example.com","password":"wrong"}'
done
# Expect: 429 on requests 6+
```
