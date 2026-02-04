"""
Testes de Performance para API CNPJ
Sprint S02-F05-I02

Valida que queries utilizam índices corretamente e executam em < 500ms.
Usa pytest-benchmark para métricas precisas.
"""
import time
import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.crud.cnpj import CNPJRepository


# Configuração do banco - Usa database_url do settings (já faz quote_plus da senha)
engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="module")
def db_session():
    """Cria sessão do banco para testes"""
    session = SessionLocal()
    yield session
    session.close()


class TestQueryPerformance:
    """Testa performance de queries críticas"""
    
    def test_search_empresas_razao_social_performance(self, db_session, benchmark):
        """Search por razão social deve executar em < 500ms usando índice"""
        def query_empresas():
            return CNPJRepository.search_empresas_by_razao_social(
                db=db_session,
                razao_social="SERVICOS",
                limit=10
            )
        
        # Primeira execução para cache
        query_empresas()
        
        # Benchmark
        start = time.time()
        result = benchmark(query_empresas)
        elapsed = time.time() - start
        
        assert result.total > 0, "Deve retornar resultados"
        assert elapsed < 0.5, f"Query levou {elapsed:.3f}s - deve ser < 500ms"
        
        # Valida que retornou até o limite
        assert result.count <= 10
    
    def test_search_socios_nome_performance(self, db_session, benchmark):
        """Search por nome de sócio deve executar em < 500ms usando índice"""
        def query_socios():
            return CNPJRepository.search_socios_by_nome(
                db=db_session,
                nome="SILVA",
                limit=10
            )
        
        # Primeira execução para cache
        query_socios()
        
        # Benchmark
        start = time.time()
        result = benchmark(query_socios)
        elapsed = time.time() - start
        
        assert result.total > 0, "Deve retornar resultados"
        assert elapsed < 0.5, f"Query levou {elapsed:.3f}s - deve ser < 500ms"
        assert result.count <= 10
    
    def test_get_empresa_completa_performance(self, db_session, benchmark):
        """Get empresa completa deve executar em < 1s (query complexa com joins)"""
        # Busca um CNPJ que tenha dados
        cnpj_result = db_session.execute(
            text("SELECT cnpj_basico FROM cnpj.empresas LIMIT 1")
        ).fetchone()
        
        if not cnpj_result:
            pytest.skip("Banco sem dados de empresas")
        
        cnpj_basico = cnpj_result[0]
        
        def query_completa():
            return CNPJRepository.get_empresa_completa(
                db=db_session,
                cnpj_basico=cnpj_basico
            )
        
        # Primeira execução para cache
        query_completa()
        
        # Benchmark
        start = time.time()
        result = benchmark(query_completa)
        elapsed = time.time() - start
        
        assert result is not None, "Deve retornar empresa"
        assert elapsed < 1.0, f"Query complexa levou {elapsed:.3f}s - deve ser < 1s"
    
    def test_get_estabelecimento_cnpj_performance(self, db_session, benchmark):
        """Get estabelecimento por CNPJ deve executar em < 100ms (lookup simples)"""
        # Busca um CNPJ completo
        cnpj_result = db_session.execute(
            text(
                "SELECT cnpj_basico || cnpj_ordem || cnpj_dv "
                "FROM cnpj.estabelecimentos LIMIT 1"
            )
        ).fetchone()
        
        if not cnpj_result:
            pytest.skip("Banco sem dados de estabelecimentos")
        
        cnpj_completo = cnpj_result[0]
        
        def query_estabelecimento():
            return CNPJRepository.get_estabelecimento_by_cnpj_completo(
                db=db_session,
                cnpj_completo=cnpj_completo
            )
        
        # Primeira execução para cache
        query_estabelecimento()
        
        # Benchmark
        start = time.time()
        result = benchmark(query_estabelecimento)
        elapsed = time.time() - start
        
        assert result is not None, "Deve retornar estabelecimento"
        assert elapsed < 0.1, f"Query simples levou {elapsed:.3f}s - deve ser < 100ms"


class TestIndexUsage:
    """Valida uso correto de índices nas queries"""
    
    def test_empresas_razao_social_usa_indice(self, db_session):
        """Valida que search por razão social usa idx_empresas_razao_social"""
        # Executa EXPLAIN para verificar plano de execução
        explain_query = text("""
            EXPLAIN (FORMAT JSON)
            SELECT e.* 
            FROM cnpj.empresas e
            WHERE e.razao_social ILIKE :razao
            LIMIT 10
        """)
        
        result = db_session.execute(
            explain_query,
            {"razao": "%SERVICOS%"}
        ).fetchone()
        
        plan = result[0][0]
        plan_str = str(plan).lower()
        
        # Deve usar index scan, NÃO seq scan
        assert "index" in plan_str or "bitmap" in plan_str, \
            f"Query deve usar índice. Plano: {plan}"
        
        # NÃO deve fazer sequential scan
        if "seq scan" in plan_str:
            pytest.fail(f"Query fazendo Sequential Scan (sem índice)! Plano: {plan}")
    
    def test_socios_nome_usa_indice(self, db_session):
        """Valida que search por nome de sócio usa idx_socios_nome"""
        explain_query = text("""
            EXPLAIN (FORMAT JSON)
            SELECT s.* 
            FROM cnpj.socios s
            WHERE s.nome_socio ILIKE :nome
            LIMIT 10
        """)
        
        result = db_session.execute(
            explain_query,
            {"nome": "%SILVA%"}
        ).fetchone()
        
        plan = result[0][0]
        plan_str = str(plan).lower()
        
        # Deve usar índice
        assert "index" in plan_str or "bitmap" in plan_str, \
            f"Query deve usar índice. Plano: {plan}"
        
        # NÃO deve fazer sequential scan
        if "seq scan" in plan_str and "limit" not in plan_str:
            pytest.fail(f"Query fazendo Sequential Scan! Plano: {plan}")
    
    def test_estabelecimento_pk_lookup(self, db_session):
        """Valida que lookup por CNPJ usa Primary Key (mais rápido)"""
        # Busca um CNPJ real
        cnpj_result = db_session.execute(
            text("SELECT cnpj_basico, cnpj_ordem, cnpj_dv FROM cnpj.estabelecimentos LIMIT 1")
        ).fetchone()
        
        if not cnpj_result:
            pytest.skip("Banco sem estabelecimentos")
        
        cnpj_basico, cnpj_ordem, cnpj_dv = cnpj_result
        
        explain_query = text("""
            EXPLAIN (FORMAT JSON)
            SELECT * FROM cnpj.estabelecimentos
            WHERE cnpj_basico = :basico 
              AND cnpj_ordem = :ordem 
              AND cnpj_dv = :dv
        """)
        
        result = db_session.execute(
            explain_query,
            {"basico": cnpj_basico, "ordem": cnpj_ordem, "dv": cnpj_dv}
        ).fetchone()
        
        plan = result[0][0]
        plan_str = str(plan).lower()
        
        # Deve usar index scan na PK
        assert "index scan" in plan_str, \
            f"Lookup por PK deve usar Index Scan. Plano: {plan}"


class TestLargeResultSetPerformance:
    """Testa performance com grandes volumes de dados"""
    
    def test_paginacao_1000_resultados(self, db_session):
        """Buscar 1000 empresas com paginação deve ser eficiente"""
        total_fetched = 0
        limit = 100
        max_iterations = 10
        
        start = time.time()
        
        for page in range(max_iterations):
            result = CNPJRepository.search_empresas_by_razao_social(
                db=db_session,
                razao_social="LTDA",
                limit=limit,
                offset=page * limit
            )
            
            total_fetched += result.count
            
            if result.count < limit:
                break
        
        elapsed = time.time() - start
        
        assert total_fetched > 0, "Deve retornar resultados"
        assert elapsed < 5.0, \
            f"Buscar {total_fetched} empresas levou {elapsed:.3f}s - deve ser < 5s"
    
    def test_search_com_multiplos_filtros(self, db_session):
        """Search com múltiplos filtros deve ser eficiente"""
        start = time.time()
        
        result = CNPJRepository.search_empresas(
            db=db_session,
            razao_social="SERVICOS",
            porte=5,  # DEMAIS
            limit=50
        )
        
        elapsed = time.time() - start
        
        # Com múltiplos filtros, ainda deve ser rápido
        assert elapsed < 1.0, \
            f"Search com filtros levou {elapsed:.3f}s - deve ser < 1s"
        
        # Valida que aplicou os filtros
        if result.count > 0:
            for empresa in result.items:
                assert empresa.porte_empresa == 5


class TestConcurrentQueries:
    """Testa performance de queries concorrentes"""
    
    def test_multiplas_queries_simultaneas(self, db_session):
        """Múltiplas queries simultâneas não devem degradar performance"""
        import concurrent.futures
        
        def execute_query(query_type):
            """Executa uma query"""
            if query_type == "empresas":
                return CNPJRepository.search_empresas_by_razao_social(
                    db=db_session,
                    razao_social="SERVICOS",
                    limit=10
                )
            elif query_type == "socios":
                return CNPJRepository.search_socios_by_nome(
                    db=db_session,
                    nome="SILVA",
                    limit=10
                )
        
        # Executa 10 queries simultâneas (5 empresas + 5 sócios)
        queries = ["empresas", "socios"] * 5
        
        start = time.time()
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(execute_query, q) for q in queries]
            results = [f.result() for f in concurrent.futures.as_completed(futures)]
        
        elapsed = time.time() - start
        
        assert len(results) == 10, "Todas as queries devem completar"
        assert all(r.total > 0 for r in results), "Todas devem retornar resultados"
        assert elapsed < 3.0, \
            f"10 queries simultâneas levaram {elapsed:.3f}s - deve ser < 3s"


class TestMemoryEfficiency:
    """Testa eficiência de memória nas queries"""
    
    def test_large_query_nao_carrega_tudo_memoria(self, db_session):
        """Query com limit deve retornar apenas o solicitado, não tudo"""
        # Esta query poderia retornar milhões de registros
        result = CNPJRepository.search_empresas_by_razao_social(
            db=db_session,
            razao_social="LTDA",
            limit=10
        )
        
        # Deve retornar apenas 10 items
        assert len(result.items) <= 10, \
            f"Retornou {len(result.items)} items, deveria retornar apenas 10"
        
        # Total pode ser milhões, mas items carregados só 10
        assert result.count <= 10
    
    def test_offset_alto_performance(self, db_session):
        """Offset alto não deve degradar muito a performance"""
        # Offset alto (pula 10.000 registros)
        start = time.time()
        
        result = CNPJRepository.search_empresas_by_razao_social(
            db=db_session,
            razao_social="LTDA",
            limit=10,
            offset=10000
        )
        
        elapsed = time.time() - start
        
        # Mesmo com offset alto, deve ser razoavelmente rápido
        assert elapsed < 2.0, \
            f"Query com offset 10000 levou {elapsed:.3f}s - deve ser < 2s"


# Executar com: 
# pip install pytest-benchmark
# pytest backend/tests/integration/test_cnpj_performance.py -v --benchmark-only
