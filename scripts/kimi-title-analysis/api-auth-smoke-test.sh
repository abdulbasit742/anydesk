#!/bin/bash

# API Authentication Endpoint Smoke Test Script
# Performs a basic smoke test on the API authentication endpoints (e.g., login, signup).

API_BASE_URL="${1:-http://localhost:3000/api}"

# --- Test 1: Signup (using a unique email each time)
EMAIL="testuser_$(date +%s%N)@example.com"
PASSWORD="password123"

echo "\n--- Testing Signup Endpoint ---"
signup_response=$(curl -s -X POST "${API_BASE_URL}/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${EMAIL}\", \"password\": \"${PASSWORD}\"}")

if echo "$signup_response" | grep -q "accessToken"; then
  echo "Signup successful for ${EMAIL}."
  ACCESS_TOKEN=$(echo "$signup_response" | grep -oP '"accessToken":"\K[^"-]+')
  echo "Access Token: ${ACCESS_TOKEN}"
else
  echo "Signup failed or returned unexpected response:"
  echo "$signup_response"
  exit 1
fi

# --- Test 2: Login with newly created user
echo "\n--- Testing Login Endpoint ---"
login_response=$(curl -s -X POST "${API_BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${EMAIL}\", \"password\": \"${PASSWORD}\"}")

if echo "$login_response" | grep -q "accessToken"; then
  echo "Login successful for ${EMAIL}."
  # Optionally, verify the access token is different or the same as signup's if applicable
else
  echo "Login failed or returned unexpected response:"
  echo "$login_response"
  exit 1
fi

# --- Test 3: Access protected endpoint (example: /user/me) with token
echo "\n--- Testing Protected Endpoint with Token ---"
if [ -n "$ACCESS_TOKEN" ]; then
  protected_response=$(curl -s -X GET "${API_BASE_URL}/user/me" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}")

  if echo "$protected_response" | grep -q "id"; then
    echo "Access to protected endpoint successful."
  else
    echo "Access to protected endpoint failed or returned unexpected response:"
    echo "$protected_response"
    exit 1
  fi
else
  echo "No access token found, skipping protected endpoint test."
  exit 1
fi

echo "\nAPI Authentication Smoke Test Completed Successfully."
exit 0
