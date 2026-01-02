#!/usr/bin/env python3
"""
Script para testar performance de TODOS os 7 tipos de busca
SUB-SPRINT-FIX-SEARCH-TYPES - Validação de Performance
"""
import asyncio
import time
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://basecerta:senhaultrasecreta@localhost:5434/basecerta")

# Create engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cores ANSI
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def format_time(ms):
    """Formata tempo em ms com cor"""
    if ms < 200:
        return f"{GREEN}{ms:.2f}ms{RESET}"
    elif ms < 1000:
        return f"{YELLOW}{ms:.2f}ms{RESET}"
    else:
        return f"{RED}{ms:.2f}ms{RESET}"

def test_query(db, query_name, sql_query):
    """Executa query e mede performance"""
    print(f"\n{BLUE}[TEST]{RESET} {query_name}...")
    
    try:
        start = time.time()
        result = db.execute(text(sql_query))
        rows = result.fetchall()
        elapsed = (time.time() - start) * 1000
        
        count = len(rows)
        status = "✅ PASS" if elapsed < 200 else "⚠️  SLOW" if elapsed < 1000 else "❌ FAIL"
        
        print(f"{status} - {count} resultados - {format_time(elapsed)}")
        return elapsed < 1000  # Sucesso se < 1s
        
    except Exception as e:
        print(f"{RED}❌ ERRO:{RESET} {str(e)[:100]}")
        return False

def main():
    print(f"\n{BLUE}{'='*70}{RESET}")
    print(f"{BLUE}TESTE DE PERFORMANCE - 7 TIPOS DE BUSCA{RESET}")
    print(f"{BLUE}Target: <200ms | Acceptable: <1000ms{RESET}")
    print(f"{BLUE}{'='*70}{RESET}")
    
    db = SessionLocal()
    
    tests = [
        # 1. CNPJ (já funcionava)
        (
            "1️⃣  CNPJ - 33345748000185",
            """
            SELECT e.cnpj_basico, e.razao_social, est.cnpj, est.nome_fantasia
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            WHERE est.cnpj LIKE '33345748000185%'
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
            """
        ),
        
        # 2. Razão Social (ISSUE-FIX-01 - COMPLETO)
        (
            "2️⃣  Razão Social - GOOGLE",
            """
            SELECT e.cnpj_basico, e.razao_social, est.cnpj, est.nome_fantasia
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            WHERE e.razao_social ILIKE '%GOOGLE%'
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
            """
        ),
        
        # 3. CNAE/Segmento (ISSUE-FIX-02 - COMPLETO)
        (
            "3️⃣  CNAE/Segmento - 6201",
            """
            SELECT e.cnpj_basico, e.razao_social, est.cnpj, est.cnae_fiscal_principal
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            WHERE est.cnae_fiscal_principal LIKE '6201%'
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
            """
        ),
        
        # 4. Email (ISSUE-FIX-03 - COMPLETO)
        (
            "4️⃣  Email - @google.com",
            """
            SELECT e.cnpj_basico, e.razao_social, est.cnpj, est.correio_eletronico
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            WHERE est.correio_eletronico ILIKE '%@google.com%'
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
            """
        ),
        
        # 5. Telefone (ISSUE-FIX-04 - COMPLETO)
        (
            "5️⃣  Telefone - 1140004000",
            """
            SELECT e.cnpj_basico, e.razao_social, est.cnpj, 
                   est.ddd_telefone_1 || est.telefone_1 as tel1
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            WHERE (est.ddd_telefone_1 || est.telefone_1 LIKE '%1140004000%'
                   OR est.ddd_telefone_2 || est.telefone_2 LIKE '%1140004000%')
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
            """
        ),
        
        # 6. Nome Sócio (ISSUE-FIX-05 - COMPLETO)
        (
            "6️⃣  Nome Sócio - SILVA",
            """
            SELECT DISTINCT e.cnpj_basico, e.razao_social, est.cnpj, s.nome_socio
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            JOIN cnpj.socios s ON e.cnpj_basico = s.cnpj_basico
            WHERE s.nome_socio ILIKE '%SILVA%'
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
            """
        ),
        
        # 7. CEP (ISSUE-FIX-06 - COMPLETO)
        (
            "7️⃣  CEP - 01310",
            """
            SELECT e.cnpj_basico, e.razao_social, est.cnpj, est.cep
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            WHERE est.cep LIKE '01310%'
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
            """
        ),
    ]
    
    results = []
    for name, query in tests:
        success = test_query(db, name, query)
        results.append((name, success))
    
    # Summary
    print(f"\n{BLUE}{'='*70}{RESET}")
    print(f"{BLUE}RESUMO{RESET}")
    print(f"{BLUE}{'='*70}{RESET}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        status = f"{GREEN}✅ PASS{RESET}" if success else f"{RED}❌ FAIL{RESET}"
        print(f"{status} - {name}")
    
    print(f"\n{BLUE}Total:{RESET} {passed}/{total} testes passaram")
    
    if passed == total:
        print(f"\n{GREEN}🎉 TODOS OS TESTES PASSARAM! SUB-SPRINT COMPLETO!{RESET}\n")
    else:
        print(f"\n{YELLOW}⚠️  Alguns testes falharam. Revisar queries.{RESET}\n")
    
    db.close()

if __name__ == "__main__":
    main()
