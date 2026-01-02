#!/usr/bin/env python3
"""
Script para testar as conexões com PostgreSQL e Redis
"""

import sys
import os

# Adicionar o diretório backend ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_postgres():
    """Testa conexão com PostgreSQL"""
    try:
        import psycopg2
        
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            database="basecerta",
            user="dev4us",
            password="P@lm315@s"
        )
        
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        
        print("✅ PostgreSQL: Conectado com sucesso!")
        print(f"   Versão: {version.split(',')[0]}")
        
        # Verificar tabelas existentes
        cursor.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename;
        """)
        tables = cursor.fetchall()
        
        if tables:
            print(f"   Tabelas encontradas: {len(tables)}")
            for table in tables[:5]:  # Mostrar apenas as 5 primeiras
                print(f"   - {table[0]}")
            if len(tables) > 5:
                print(f"   ... e mais {len(tables) - 5} tabelas")
        else:
            print("   ⚠️  Nenhuma tabela encontrada. Execute as migrações!")
        
        cursor.close()
        conn.close()
        return True
        
    except ImportError:
        print("❌ PostgreSQL: Biblioteca psycopg2 não instalada")
        print("   Instale com: pip install psycopg2-binary")
        return False
    except Exception as e:
        print(f"❌ PostgreSQL: Erro ao conectar - {str(e)}")
        return False


def test_redis():
    """Testa conexão com Redis"""
    try:
        import redis
        
        r = redis.Redis(
            host='localhost',
            port=6379,
            password='P@lm315@s',
            decode_responses=True
        )
        
        # Testar ping
        r.ping()
        
        # Testar set/get
        r.set('test_connection', 'OK')
        value = r.get('test_connection')
        r.delete('test_connection')
        
        # Obter informações
        info = r.info('server')
        
        print("✅ Redis: Conectado com sucesso!")
        print(f"   Versão: {info.get('redis_version', 'N/A')}")
        print(f"   Modo: {info.get('redis_mode', 'N/A')}")
        
        # Verificar quantidade de chaves
        dbsize = r.dbsize()
        print(f"   Chaves armazenadas: {dbsize}")
        
        return True
        
    except ImportError:
        print("❌ Redis: Biblioteca redis não instalada")
        print("   Instale com: pip install redis")
        return False
    except Exception as e:
        print(f"❌ Redis: Erro ao conectar - {str(e)}")
        return False


def test_sqlalchemy():
    """Testa conexão usando SQLAlchemy (como a aplicação usa)"""
    try:
        from sqlalchemy import create_engine, text
        
        DATABASE_URL = "postgresql://dev4us:P@lm315@s@localhost:5432/basecerta"
        
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
        
        print("✅ SQLAlchemy: Conexão OK!")
        return True
        
    except ImportError:
        print("❌ SQLAlchemy: Biblioteca não instalada")
        print("   Instale com: pip install sqlalchemy")
        return False
    except Exception as e:
        print(f"❌ SQLAlchemy: Erro - {str(e)}")
        return False


def main():
    """Executa todos os testes"""
    print("=" * 60)
    print("🔍 TESTANDO CONEXÕES DO BASECERTA")
    print("=" * 60)
    print()
    
    results = []
    
    # Teste PostgreSQL
    print("1️⃣  POSTGRESQL")
    print("-" * 60)
    results.append(test_postgres())
    print()
    
    # Teste Redis
    print("2️⃣  REDIS")
    print("-" * 60)
    results.append(test_redis())
    print()
    
    # Teste SQLAlchemy
    print("3️⃣  SQLALCHEMY (ORM)")
    print("-" * 60)
    results.append(test_sqlalchemy())
    print()
    
    # Resumo
    print("=" * 60)
    print("📊 RESUMO")
    print("=" * 60)
    
    if all(results):
        print("✅ Todas as conexões estão funcionando!")
        print()
        print("🚀 Próximos passos:")
        print("   1. Execute as migrações: cd backend && alembic upgrade head")
        print("   2. Inicie o backend: uvicorn app.main:app --reload")
        print("   3. Inicie o frontend: cd frontend && npm run dev")
        return 0
    else:
        print("⚠️  Algumas conexões falharam. Verifique os erros acima.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
