#!/usr/bin/env python3
import psycopg2

try:
    conn = psycopg2.connect(
        host='localhost',
        port=5432,
        database='basecerta',
        user='code4us'
    )
    
    cur = conn.cursor()
    cur.execute('SELECT version();')
    version = cur.fetchone()
    
    print('✅ Conexão bem-sucedida!')
    print(f'📊 PostgreSQL: {version[0]}')
    
    cur.execute('SELECT current_database(), current_user;')
    info = cur.fetchone()
    print(f'🗄️  Database: {info[0]}')
    print(f'👤 User: {info[1]}')
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f'❌ Erro: {e}')
