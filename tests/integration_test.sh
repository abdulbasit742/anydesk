#!/bin/bash
# RemoteDesk API Integration Test
# Tests all core endpoints with real PostgreSQL database

set -e
BASE="http://localhost:5000"
PASS=0
FAIL=0

test_endpoint() {
  local desc="$1"
  local method="$2"
  local url="$3"
  local data="$4"
  local token="$5"
  local expected_status="$6"

  local headers="-H 'Content-Type: application/json'"
  if [ -n "$token" ]; then
    headers="$headers -H 'Authorization: Bearer $token'"
  fi

  if [ "$method" = "GET" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -H "Content-Type: application/json" -H "Authorization: Bearer $token" "$url")
  elif [ "$method" = "POST" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "$data" "$url")
  elif [ "$method" = "PATCH" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "$data" "$url")
  fi

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "$expected_status" ]; then
    echo "✅ PASS: $desc (HTTP $HTTP_CODE)"
    PASS=$((PASS + 1))
  else
    echo "❌ FAIL: $desc (Expected $expected_status, Got $HTTP_CODE)"
    echo "   Body: $BODY"
    FAIL=$((FAIL + 1))
  fi
  echo "$BODY" > /tmp/last_response.json
}

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  RemoteDesk API Integration Test Suite                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ─── Health Endpoints ────────────────────────────────────────────
echo "━━━ Health Endpoints ━━━"
test_endpoint "GET /health" GET "$BASE/health" "" "" "200"
test_endpoint "GET /health/ready" GET "$BASE/health/ready" "" "" "200"
test_endpoint "GET /healthz" GET "$BASE/healthz" "" "" "200"

# ─── Auth Endpoints ─────────────────────────────────────────────
echo ""
echo "━━━ Auth Endpoints ━━━"

# Signup user 1 (host)
test_endpoint "POST /api/auth/signup (host)" POST "$BASE/api/auth/signup" \
  '{"email":"host@test.io","password":"HostPass123!","fullName":"Host User"}' "" "201"
HOST_TOKEN=$(cat /tmp/last_response.json | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['tokens']['accessToken'])" 2>/dev/null || echo "")

# Signup user 2 (viewer)
test_endpoint "POST /api/auth/signup (viewer)" POST "$BASE/api/auth/signup" \
  '{"email":"viewer@test.io","password":"ViewerPass123!","fullName":"Viewer User"}' "" "201"
VIEWER_TOKEN=$(cat /tmp/last_response.json | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['tokens']['accessToken'])" 2>/dev/null || echo "")

# Login
test_endpoint "POST /api/auth/login" POST "$BASE/api/auth/login" \
  '{"email":"host@test.io","password":"HostPass123!"}' "" "200"
HOST_TOKEN=$(cat /tmp/last_response.json | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['tokens']['accessToken'])" 2>/dev/null || echo "")

# Duplicate signup (should fail)
test_endpoint "POST /api/auth/signup (duplicate)" POST "$BASE/api/auth/signup" \
  '{"email":"host@test.io","password":"HostPass123!","fullName":"Host User"}' "" "409"

# Invalid login
test_endpoint "POST /api/auth/login (wrong password)" POST "$BASE/api/auth/login" \
  '{"email":"host@test.io","password":"WrongPass!"}' "" "401"

# Get me
test_endpoint "GET /api/auth/me" GET "$BASE/api/auth/me" "" "$HOST_TOKEN" "200"

# Unauthenticated
test_endpoint "GET /api/auth/me (no token)" GET "$BASE/api/auth/me" "" "" "401"

# ─── Device Endpoints ────────────────────────────────────────────
echo ""
echo "━━━ Device Endpoints ━━━"

# Register device
test_endpoint "POST /api/devices/register" POST "$BASE/api/devices/register" \
  '{"name":"Test Laptop","platform":"windows"}' "$HOST_TOKEN" "201"

# List devices
test_endpoint "GET /api/devices" GET "$BASE/api/devices" "" "$HOST_TOKEN" "200"

# Get host remoteDeskId for session test
HOST_RDID=$(curl -s -H "Authorization: Bearer $HOST_TOKEN" "$BASE/api/auth/me" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['remoteDeskId'])" 2>/dev/null || echo "")

# ─── Session Endpoints ───────────────────────────────────────────
echo ""
echo "━━━ Session Endpoints ━━━"

# Create session (viewer connects to host)
test_endpoint "POST /api/sessions/create" POST "$BASE/api/sessions/create" \
  "{\"targetRemoteDeskId\":\"$HOST_RDID\"}" "$VIEWER_TOKEN" "201"
SESSION_ID=$(cat /tmp/last_response.json | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null || echo "")

# Get active sessions
test_endpoint "GET /api/sessions/active" GET "$BASE/api/sessions/active" "" "$HOST_TOKEN" "200"

# Get session by ID
test_endpoint "GET /api/sessions/:id" GET "$BASE/api/sessions/$SESSION_ID" "" "$HOST_TOKEN" "200"

# Accept session (host accepts)
test_endpoint "PATCH /api/sessions/:id/respond (accept)" PATCH "$BASE/api/sessions/$SESSION_ID/respond" \
  '{"accepted":true}' "$HOST_TOKEN" "200"

# End session
test_endpoint "PATCH /api/sessions/:id/end" PATCH "$BASE/api/sessions/$SESSION_ID/end" \
  '' "$HOST_TOKEN" "200"

# Session history
test_endpoint "GET /api/sessions/history" GET "$BASE/api/sessions/history" "" "$HOST_TOKEN" "200"

# ─── Summary ─────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  RESULTS: $PASS passed, $FAIL failed                     "
echo "╚══════════════════════════════════════════════════════════╝"
