#!/bin/bash
# TURN Server Test Script

TURN_SERVER="${TURN_SERVER:-turn:localhost:3478}"
USERNAME="${TURN_USERNAME:-user}"
PASSWORD="${TURN_PASSWORD:-pass}"

echo "Testing TURN server at $TURN_SERVER..."

turnutils_uclient -u "$USERNAME" -w "$PASSWORD" "$TURN_SERVER"   2>&1 | head -20

echo "TURN test complete"
