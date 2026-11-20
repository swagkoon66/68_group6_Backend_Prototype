# test caching
# !/bin/bash

BASE_URL="http://127.0.0.1:8084"

echo "--- Performance Test with Autocannon ---"
echo "Target: $BASE_URL/room"
echo ""

npx autocannon -c 100 -d 10 "$BASE_URL/room"