# test caching
# !/bin/bash

BASE_URL="http://localhost:3000"

echo "--- Performance Test with Autocannon ---"
echo "Target: $BASE_URL/room"
echo ""

npx autocannon -c 100 -d 10 "$BASE_URL/room"