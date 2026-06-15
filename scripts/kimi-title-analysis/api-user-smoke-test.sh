#!/bin/bash

# API User Endpoint Smoke Test Script
# Performs a basic smoke test on the API user-related endpoints.

API_BASE_URL="${1:-http://localhost:3000/api}"

# --- Helper function to get an access token ---
get_access_token() {
  local email="testuser_$(date +%s%N)_user@example.com"
  local password="password123"

  # Signup a new user
  signup_response=$(curl -s -X POST "${API_BASE_URL}/auth/signup" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"${email}\", \"password\": \"${password}\"}")

  if echo "$signup_response" | grep -q "accessToken"; then
    echo $(echo "$signup_response" | grep -oP '"accessToken":"\K[^"-]+')
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

# --- Test 1: Get current user profile (/user/me)
echo "\n--- Testing Get Current User Profile (/user/me) ---"
user_me_response=$(curl -s -X GET "${API_BASE_URL}/user/me" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

if echo "$user_me_response" | grep -q "id" && echo "$user_me_response" | grep -q "email"; then
  echo "Get current user profile successful."
  echo "Response: $user_me_response"
else
  echo "Get current user profile failed or returned unexpected response:"
  echo "$user_me_response"
  exit 1
fi

# --- Test 2: Update user profile (example: change name)
# Assuming there's an endpoint like /user/:id or /user/me for updates
# This test might need adjustment based on actual API implementation
echo "\n--- Testing Update User Profile (e.g., /user/me) ---"
UPDATE_PAYLOAD='{"name": "Test User Updated"}'
update_user_response=$(curl -s -X PATCH "${API_BASE_URL}/user/me" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "$UPDATE_PAYLOAD")

if echo "$update_user_response" | grep -q "name": "Test User Updated"; then
  echo "Update user profile successful."
  echo "Response: $update_user_response"
else
  echo "Update user profile failed or returned unexpected response:"
  echo "$update_user_response"
  exit 1
fi

echo "\nAPI User Endpoint Smoke Test Completed Successfully."
exit 0
