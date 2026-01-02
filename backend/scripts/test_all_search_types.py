#!/usr/bin/env python3
"""Teste de Performance - 7 Tipos de Busca | SUB-SPRINT-FIX-SEARCH-TYPES"""
import time
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://aian_db:aian_db@localhost:5432/basecerta"
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

G, R, Y, B, RST = '\033[92m', '\033[91m', '\033[93m', '\033[94m', '\033[0m'

def fmt_time(ms):
    return f"{G}{ms:.2f}ms{RST}" if ms<200 else f"{Y}{ms:.2f}ms{RST}" if ms<1000 else f"{R}{ms:.2f}ms{RST}"

def test(db, name, sql):
    print(f"\n{B}[TEST]{RST} {name}...")
    try:
        start = time.time()
        rows = db.execute(text(sql)).fetchall()
        ms = (time.time() - start) * 1000
        status = "✅ PASS" if ms<200 else "⚠️  SLOW" if ms<1000 else "❌ FAIL"
        print(f"{status} - {len(rows)} resultados - {fmt_time(ms)}")
        return ms < 1000
    except Exception as e:
        print(f"{R}❌ ERRO:{RST} {str(e)[:100]}")
        return False

def main():
    print(f"\n{B}{'='*70}{RST}\n{B}TESTE DE PERFORMANCE - 7 TIPOS DE BUSCA{RST}")
    print(f"{B}Target: <200ms | Acceptable: <1000ms{RST}\n{B}{'='*70}{RST}")
    
    db = SessionLocal()
    
    tests = [
        ("1️⃣  CNPJ - 33345748", """
            SELECT e.cnpj_basico, e.razao_social, 
                   (est.cnpj_basico || est.cnpj_ordem || est.cnpj_dv) as cnpj_completo,
                   est.nome_fantasia
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            WHERE est.cnpj_basico = '33345748'
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
        """),
        
        ("2️⃣  Razão Social - GOOGLE", """
            SELECT e.cnpj_basico, e.razao_social,
                   (est.cnpj_basico || est.cnpj_ordem || est.cnpj_dv) as cnpj_completo,
                   est.nome_fantasia
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            WHERE e.razao_social ILIKE '%GOOGLE%'
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
        """),
        
        ("3️⃣  CNAE/Segmento - 6201", """
            SELECT e.cnpj_basico, e.razao_social,
                   (est.cnpj_basico || est.cnpj_ordem || est.cnpj_dv) as cnpj_completo,
                   est.cnae_fiscal_principal
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            WHERE est.cnae_fiscal_principal LIKE '6201%'
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
        """),
        
        ("4️⃣  Email - @google.com", """
            SELECT e.cnpj_basico, e.razao_social,
                   (est.cnpj_basico || est.cnpj_ordem || est.cnpj_dv) as cnpj_completo,
                   est.correio_eletronico
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            WHERE est.correio_eletronico ILIKE '%@google.com%'
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
        """),
        
        ("5️⃣  Telefone - 1140004000", """
            SELECT e.cnpj_basico, e.razao_social,
                   (est.cnpj_basico || est.cnpj_ordem || est.cnpj_dv) as cnpj_completo,
                   (est.ddd_1 || est.telefone_1) as tel1
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            WHERE ((est.ddd_1 || est.telefone_1) LIKE '%1140004000%'
                   OR (est.ddd_2 || est.telefone_2) LIKE '%1140004000%')
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
        """),
        
        ("6️⃣  Nome Sócio - SILVA", """
            SELECT DISTINCT e.cnpj_basico, e.razao_social,
                   (est.cnpj_basico || est.cnpj_ordem || est.cnpj_dv) as cnpj_completo,
                   s.nome_socio
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            JOIN cnpj.socios s ON e.cnpj_basico = s.cnpj_basico
            WHERE s.nome_socio ILIKE '%SILVA%'
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
        """),
        
        ("7️⃣  CEP - 01310", """
            SELECT e.cnpj_basico, e.razao_social,
                   (est.cnpj_basico || est.cnpj_ordem || est.cnpj_dv) as cnpj_completo,
                   est.cep
            FROM cnpj.empresas e
            JOIN cnpj.estabelecimentos est ON e.cnpj_basico = est.cnpj_basico
            WHERE est.cep LIKE '01310%'
            AND est.identificador_matriz_filial = '1'
            AND est.situacao_cadastral = '02'
            LIMIT 50;
        """),
    ]
    
    results = [(n, test(db, n, q)) for n, q in tests]
    
    print(f"\n{B}{'='*70}{RST}\n{B}RESUMO{RST}\n{B}{'='*70}{RST}")
    passed = sum(1 for _, s in results if s)
    for n, s in results:
        print(f"{'✅' if s else '❌'} - {n}")
    
    print(f"\n{B}Total:{RST} {passed}/{len(results)} testes passaram")
    print(f"\n{G if passed==len(results) else Y}{'🎉 COMPLETO!' if passed==len(results) else '⚠️  Revisar'}{RST}\n")
    db.close()

if __name__ == "__main__":
    main()
