"""
Script de teste rápido para CNPJRepository
Testa conexão direta e operações básicas
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus

from app.crud.cnpj import CNPJRepository
from app.models.cnpj import Empresa, Estabelecimento, Socio

# Configuração direta (mesma do analyze_database.py)
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'basecerta',
    'user': 'aian_db',
    'password': 'P@lm315@s'
}

def main():
    """Testa CNPJRepository com dados reais"""
    
    print("🔍 Testando CNPJRepository\n")
    
    # Criar engine
    password = quote_plus(DB_CONFIG['password'])
    db_url = (
        f"postgresql://{DB_CONFIG['user']}:{password}"
        f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
    )
    
    engine = create_engine(db_url, echo=False)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # TEST 1: Buscar empresa por CNPJ básico
        print("=" * 60)
        print("TEST 1: get_empresa_by_cnpj_basico")
        print("=" * 60)
        
        empresa_exemplo = db.query(Empresa).first()
        if empresa_exemplo:
            cnpj_basico = empresa_exemplo.cnpj_basico
            
            empresa = CNPJRepository.get_empresa_by_cnpj_basico(db, cnpj_basico)
            print(f"✅ Empresa encontrada: {cnpj_basico}")
            print(f"   Razão Social: {empresa.razao_social[:50]}...")
            print(f"   Porte: {empresa.porte_empresa}")
            print(f"   Natureza: {empresa.natureza_juridica}")
        else:
            print("❌ Nenhuma empresa encontrada no banco")
        
        # TEST 2: Buscar por razão social
        print("\n" + "=" * 60)
        print("TEST 2: search_empresas_by_razao_social")
        print("=" * 60)
        
        empresas, total = CNPJRepository.search_empresas_by_razao_social(
            db,
            termo="LTDA",
            limit=5
        )
        print(f"✅ Busca 'LTDA': {len(empresas)} resultados de {total} total")
        for i, emp in enumerate(empresas[:3], 1):
            print(f"   {i}. {emp.razao_social[:50]}...")
        
        # TEST 3: Buscar estabelecimentos por empresa
        print("\n" + "=" * 60)
        print("TEST 3: get_estabelecimentos_by_empresa")
        print("=" * 60)
        
        if empresa_exemplo:
            estabelecimentos = CNPJRepository.get_estabelecimentos_by_empresa(
                db,
                empresa_exemplo.cnpj_basico
            )
            print(f"✅ Estabelecimentos encontrados: {len(estabelecimentos)}")
            for i, estab in enumerate(estabelecimentos[:3], 1):
                cnpj_completo = estab.cnpj_basico + estab.cnpj_ordem + estab.cnpj_dv
                tipo = "MATRIZ" if estab.identificador_matriz_filial == '1' else "FILIAL"
                print(f"   {i}. {cnpj_completo} - {tipo}")
        
        # TEST 4: Buscar CNPJ completo
        print("\n" + "=" * 60)
        print("TEST 4: get_estabelecimento_by_cnpj_completo")
        print("=" * 60)
        
        estab_exemplo = db.query(Estabelecimento).first()
        if estab_exemplo:
            cnpj_completo = (
                estab_exemplo.cnpj_basico +
                estab_exemplo.cnpj_ordem +
                estab_exemplo.cnpj_dv
            )
            
            estab = CNPJRepository.get_estabelecimento_by_cnpj_completo(
                db,
                cnpj_completo
            )
            print(f"✅ Estabelecimento {cnpj_completo} encontrado")
            print(f"   Situação: {estab.situacao_cadastral}")
            print(f"   CNAE: {estab.cnae_fiscal_principal}")
        
        # TEST 5: Buscar sócios
        print("\n" + "=" * 60)
        print("TEST 5: get_socios_by_empresa")
        print("=" * 60)
        
        # Buscar empresa com sócios
        empresa_com_socios = (
            db.query(Empresa)
            .join(Socio)
            .first()
        )
        
        if empresa_com_socios:
            socios = CNPJRepository.get_socios_by_empresa(
                db,
                empresa_com_socios.cnpj_basico
            )
            print(f"✅ Sócios encontrados: {len(socios)}")
            for i, socio in enumerate(socios[:3], 1):
                print(f"   {i}. {socio.nome_socio[:40]}...")
        else:
            print("⚠️  Nenhuma empresa com sócios encontrada")
        
        # TEST 6: Buscar sócios por nome
        print("\n" + "=" * 60)
        print("TEST 6: search_socios_by_nome")
        print("=" * 60)
        
        socios, total = CNPJRepository.search_socios_by_nome(
            db,
            nome="SILVA",
            limit=5
        )
        print(f"✅ Busca 'SILVA': {len(socios)} resultados de {total} total")
        for i, socio in enumerate(socios[:3], 1):
            print(f"   {i}. {socio.nome_socio[:40]}...")
        
        # TEST 7: Simples Nacional
        print("\n" + "=" * 60)
        print("TEST 7: get_simples_by_empresa")
        print("=" * 60)
        
        empresas_simples = CNPJRepository.get_empresas_simples(db, limit=5)
        if empresas_simples:
            print(f"✅ Empresas Simples: {len(empresas_simples)}")
            for i, simples in enumerate(empresas_simples[:3], 1):
                mei = " (MEI)" if simples.is_mei else ""
                print(f"   {i}. {simples.cnpj_basico}{mei}")
            
            # Testar busca individual
            simples_test = CNPJRepository.get_simples_by_empresa(
                db,
                empresas_simples[0].cnpj_basico
            )
            print(f"\n   Teste individual: {simples_test.cnpj_basico}")
            print(f"   Simples: {simples_test.is_simples}")
            print(f"   MEI: {simples_test.is_mei}")
        else:
            print("⚠️  Nenhuma empresa Simples encontrada")
        
        # TEST 8: Empresa completa
        print("\n" + "=" * 60)
        print("TEST 8: get_empresa_completa (query complexa)")
        print("=" * 60)
        
        if empresa_exemplo:
            resultado = CNPJRepository.get_empresa_completa(
                db,
                empresa_exemplo.cnpj_basico
            )
            
            if resultado:
                print(f"✅ Dados completos:")
                print(f"   Empresa: {resultado['empresa'].razao_social[:40]}...")
                print(f"   Estabelecimentos: {resultado['total_estabelecimentos']}")
                print(f"   Sócios: {resultado['total_socios']}")
                print(f"   Simples: {resultado['is_simples']}")
                print(f"   MEI: {resultado['is_mei']}")
        
        print("\n" + "=" * 60)
        print("🎉 TODOS OS TESTES CONCLUÍDOS!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        db.close()
        engine.dispose()


if __name__ == "__main__":
    main()
