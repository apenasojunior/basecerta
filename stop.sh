#!/bin/bash
echo "🛑 Parando BaseCerta..."

# Parar frontend
pkill -f "next dev" 2>/dev/null || true

# Parar backend
docker-compose down

echo "✅ BaseCerta parado"
