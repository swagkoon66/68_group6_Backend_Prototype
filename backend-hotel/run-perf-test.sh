# test caching
# !/bin/bash

<<<<<<< HEAD
BASE_URL="http://localhost:3000"
=======
BASE_URL="http://127.0.0.1:8084"
>>>>>>> 90af5447b71666944bbec50db47e0003fea6b5a2

echo "--- Performance Test with Autocannon ---"
echo "Target: $BASE_URL/room"
echo ""

npx autocannon -c 100 -d 10 "$BASE_URL/room"