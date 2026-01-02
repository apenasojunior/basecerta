#!/bin/bash
echo "🚀 Iniciando BaseCerta..."

# Backend
echo "📦 Iniciando Backend (Docker)..."
docker-compose up -d

# Frontend
echo "🎨 Iniciando Frontend..."
cd frontend && npm run dev &

echo ""
echo "✅ BaseCerta iniciado!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo "   Docs API: http://localhost:8000/docs"
echo ""
