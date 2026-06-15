#!/bin/bash

# API Session Endpoint Smoke Test Script
# Performs a basic smoke test on the API session-related endpoints.

API_BASE_URL="${1:-http://localhost:3000/api}"

# --- Helper function to get an access token ---
get_access_token() {
  local email="testuser_$(date +%s%N)_session@example.com"
  local password="password123"

  # Signup a new user
  signup_response=$(curl -s -X POST "${API_BASE_URL}/auth/signup" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"${email}\", \"password\": \"${password}\"}")

  if echo "$signup_response" | grep -q "accessToken"; then
    echo $(echo "$signup_response" | grep -oP \'"accessToken":"\K[^"]+\')
  else
    echo "Error: Could not sign up user for token."
    exit 1
  fi
}

ACCESS_TOKEN=$(get_access_token)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "Failed to obtain access token. Exiting."
  exit 1
fi

echo "Access Token obtained: ${ACCESS_TOKEN}"

# --- Test 1: Get current user's sessions (assuming an endpoint like /sessions/me)
# This test might need adjustment based on actual API implementation
echo "\n--- Testing Get User Sessions (/sessions/me) ---"
sessions_response=$(curl -s -X GET "${API_BASE_URL}/sessions/me" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

if echo "$sessions_response" | grep -q "[]" || echo "$sessions_response" | grep -q "id"; then
  echo "Get user sessions successful (might be empty array or contain sessions)."
  echo "Response: $sessions_response"
else
  echo "Get user sessions failed or returned unexpected response:"
  echo "$sessions_response"
  exit 1
fi

# --- Test 2: Create a new session (this would typically be initiated by a desktop client)
# For a smoke test, we can simulate it if the API allows direct creation for testing.
# This is a placeholder and might require more complex setup or mocking.
# If the API only allows session creation via WebSocket signaling, this part will be IDEA_ONLY.

echo "\n--- Testing Session Creation (IDEA_ONLY for direct API call) ---"
# Example payload for session creation - adjust as per your API schema
# SESSION_PAYLOAD=\'{"deviceId": "some-device-id", "sessionType": "remote-control"}\'
# create_session_response=$(curl -s -X POST "${API_BASE_URL}/sessions" \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer ${ACCESS_TOKEN}" \
#   -d "$SESSION_PAYLOAD")

# if echo "$create_session_response" | grep -q "sessionId"; then
#   echo "Session creation successful."
#   echo "Response: $create_session_response"
# else
#   echo "Session creation failed or returned unexpected response:"
#   echo "$create_session_response"
#   exit 1
# fi

echo "\nAPI Session Endpoint Smoke Test Completed Successfully (with caveats for session creation)."
exit 0
