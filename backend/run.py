#!/usr/bin/env python3
"""
Script para iniciar o servidor FastAPI
"""
import sys
import os

# Adiciona o diretório backend ao PYTHONPATH
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
