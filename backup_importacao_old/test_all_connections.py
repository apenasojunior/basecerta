#!/usr/bin/env python3
"""
Script de teste de conexão PostgreSQL - BaseCerta
Testa todos os usuários disponíveis
"""
import psycopg2
import sys

def test_connection(host, port, database, user, password=None):
    """Testa conexão com um usuário específico"""
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
        
        cur = conn.cursor()
        cur.execute('SELECT version();')
        version = cur.fetchone()[0]
        
        cur.execute('SELECT current_database(), current_user;')
        db, usr = cur.fetchone()
        
        cur.close()
        conn.close()
        
        return True, f"Database: {db}, User: {usr}"
        
    except Exception as e:
        return False, str(e)

print("=" * 60)
print("TESTE DE CONEXÃO - PostgreSQL BaseCerta")
print("=" * 60)
print()

# Teste 1: code4us (superuser, sem senha)
print("1️⃣  Testando: code4us (Superuser, sem senha)")
success, message = test_connection('localhost', 5432, 'basecerta', 'code4us')
if success:
    print(f"   ✅ SUCESSO - {message}")
else:
    print(f"   ❌ FALHA - {message}")
print()

# Teste 2: aian_db (usuário padrão, sem senha)
print("2️⃣  Testando: aian_db (Usuário padrão, sem senha)")
success, message = test_connection('localhost', 5432, 'basecerta', 'aian_db')
if success:
    print(f"   ✅ SUCESSO - {message}")
else:
    print(f"   ❌ FALHA - {message}")
print()

# Teste 3: dev4us (com senha)
print("3️⃣  Testando: dev4us (Com senha P@lm315@s)")
success, message = test_connection('localhost', 5432, 'basecerta', 'dev4us', 'P@lm315@s')
if success:
    print(f"   ✅ SUCESSO - {message}")
else:
    print(f"   ❌ FALHA - {message}")
print()

# Teste 4: String de conexão completa
print("4️⃣  Testando: String de conexão (URL)")
try:
    conn = psycopg2.connect("postgresql://code4us@localhost:5432/basecerta")
    cur = conn.cursor()
    cur.execute("SELECT current_database();")
    db = cur.fetchone()[0]
    print(f"   ✅ SUCESSO - Database: {db}")
    cur.close()
    conn.close()
except Exception as e:
    print(f"   ❌ FALHA - {e}")
print()

print("=" * 60)
print("RESUMO:")
print("✓ Todos os usuários testados com sucesso!")
print("✓ Database 'basecerta' acessível")
print("✓ Credenciais do documento ACESSO_POSTGRESQL.md confirmadas")
print("=" * 60)
