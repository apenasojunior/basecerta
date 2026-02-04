"""
Testes para CNPJRepository
Feature: S02-F02-I06
Sprint: S02 - Integração Base CNPJ

Testes unitários e de integração para repository pattern.
IMPORTANTE: Requer conexão com PostgreSQL e dados reais da base CNPJ.
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import os
from dotenv import load_dotenv

from app.crud.cnpj import CNPJRepository
from app.models.cnpj import Empresa, Estabelecimento, Socio, SimplesNacional

# Carregar variáveis de ambiente
load_dotenv()


# ================================================================
# FIXTURES - Configuração de DB de Teste
# ================================================================

@pytest.fixture(scope="module")
def db_engine():
    """
    Cria engine do SQLAlchemy para testes
    
    ATENÇÃO: Usa banco de PRODUÇÃO - NÃO modifica dados, apenas lê
    """
    from urllib.parse import quote_plus
    
    # Escapar caracteres especiais na senha
    password = quote_plus(os.getenv('DB_PASSWORD', ''))
    
    db_url = (
        f"postgresql://{os.getenv('DB_USER')}:{password}"
        f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    )
    
    engine = create_engine(db_url, echo=False)
    yield engine
    engine.dispose()


@pytest.fixture(scope="function")
def db_session(db_engine) -> Generator[Session, None, None]:
    """
    Cria sessão de banco para cada teste
    """
    SessionLocal = sessionmaker(bind=db_engine)
    session = SessionLocal()
    
    yield session
    
    session.close()


# ================================================================
# TESTES DE EMPRESAS
# ================================================================

def test_get_empresa_by_cnpj_basico(db_session):
    """
    Testa busca de empresa por CNPJ básico
    """
    # Pegar primeira empresa do banco
    empresa_exemplo = db_session.query(Empresa).first()
    
    assert empresa_exemplo is not None, "Banco deve ter ao menos 1 empresa"
    
    # Testar repository
    empresa = CNPJRepository.get_empresa_by_cnpj_basico(
        db_session, 
        empresa_exemplo.cnpj_basico
    )
    
    assert empresa is not None
    assert empresa.cnpj_basico == empresa_exemplo.cnpj_basico
    assert empresa.razao_social == empresa_exemplo.razao_social


def test_get_empresa_with_relations(db_session):
    """
    Testa carregamento de empresa com relações (natureza, qualificação)
    """
    empresa_exemplo = db_session.query(Empresa).first()
    
    empresa = CNPJRepository.get_empresa_by_cnpj_basico(
        db_session,
        empresa_exemplo.cnpj_basico,
        include_relations=True
    )
    
    assert empresa is not None
    # Verificar que relações foram carregadas (joinedload)
    # SQLAlchemy deve ter carregado sem queries adicionais


def test_search_empresas_by_razao_social(db_session):
    """
    Testa busca de empresas por razão social
    """
    # Buscar termo comum (ex: "LTDA")
    empresas, total = CNPJRepository.search_empresas_by_razao_social(
        db_session,
        termo="LTDA",
        limit=10
    )
    
    assert total > 0, "Deve encontrar empresas com 'LTDA'"
    assert len(empresas) <= 10, "Deve respeitar limite"
    
    for empresa in empresas:
        assert "LTDA" in empresa.razao_social.upper()


def test_search_empresas_pagination(db_session):
    """
    Testa paginação na busca por razão social
    """
    termo = "COMERCIO"
    
    # Primeira página
    empresas_p1, total = CNPJRepository.search_empresas_by_razao_social(
        db_session,
        termo=termo,
        limit=5,
        offset=0
    )
    
    # Segunda página
    empresas_p2, total2 = CNPJRepository.search_empresas_by_razao_social(
        db_session,
        termo=termo,
        limit=5,
        offset=5
    )
    
    assert total == total2, "Total deve ser o mesmo"
    assert len(empresas_p1) <= 5
    assert len(empresas_p2) <= 5
    
    # CNPJs diferentes entre páginas
    cnpjs_p1 = {e.cnpj_basico for e in empresas_p1}
    cnpjs_p2 = {e.cnpj_basico for e in empresas_p2}
    assert cnpjs_p1.isdisjoint(cnpjs_p2), "Páginas não devem ter duplicatas"


def test_get_empresas_by_natureza_juridica(db_session):
    """
    Testa busca por natureza jurídica
    """
    # Código 206-2: Sociedade Empresária Limitada (muito comum)
    empresas = CNPJRepository.get_empresas_by_natureza_juridica(
        db_session,
        codigo_natureza="206-2",
        limit=10
    )
    
    # Se houver empresas 206-2 no banco
    if empresas:
        assert len(empresas) <= 10
        for empresa in empresas:
            assert empresa.natureza_juridica == "206-2"


def test_get_empresas_by_porte(db_session):
    """
    Testa busca por porte
    """
    # Código 01: Micro Empresa
    empresas = CNPJRepository.get_empresas_by_porte(
        db_session,
        porte="01",
        limit=10
    )
    
    if empresas:
        assert len(empresas) <= 10
        for empresa in empresas:
            assert empresa.porte_empresa == "01"


# ================================================================
# TESTES DE ESTABELECIMENTOS
# ================================================================

def test_get_estabelecimento_by_cnpj_completo(db_session):
    """
    Testa busca de estabelecimento por CNPJ completo
    """
    # Pegar primeiro estabelecimento
    estab_exemplo = db_session.query(Estabelecimento).first()
    
    assert estab_exemplo is not None
    
    # Montar CNPJ completo
    cnpj_completo = (
        estab_exemplo.cnpj_basico +
        estab_exemplo.cnpj_ordem +
        estab_exemplo.cnpj_dv
    )
    
    # Testar repository
    estab = CNPJRepository.get_estabelecimento_by_cnpj_completo(
        db_session,
        cnpj_completo
    )
    
    assert estab is not None
    assert estab.cnpj_basico == estab_exemplo.cnpj_basico
    assert estab.cnpj_ordem == estab_exemplo.cnpj_ordem
    assert estab.cnpj_dv == estab_exemplo.cnpj_dv


def test_get_estabelecimentos_by_empresa(db_session):
    """
    Testa listagem de estabelecimentos de uma empresa
    """
    # Pegar empresa com múltiplos estabelecimentos
    empresa_exemplo = db_session.query(Empresa).first()
    
    estabelecimentos = CNPJRepository.get_estabelecimentos_by_empresa(
        db_session,
        empresa_exemplo.cnpj_basico
    )
    
    assert len(estabelecimentos) > 0
    
    for estab in estabelecimentos:
        assert estab.cnpj_basico == empresa_exemplo.cnpj_basico


def test_get_estabelecimentos_apenas_matriz(db_session):
    """
    Testa filtro de apenas matriz
    """
    empresa_exemplo = db_session.query(Empresa).first()
    
    estabelecimentos = CNPJRepository.get_estabelecimentos_by_empresa(
        db_session,
        empresa_exemplo.cnpj_basico,
        apenas_matriz=True
    )
    
    # Deve retornar apenas matriz (identificador=1)
    if estabelecimentos:
        for estab in estabelecimentos:
            assert estab.identificador_matriz_filial == '1'


def test_get_estabelecimentos_by_cnae(db_session):
    """
    Testa busca por CNAE principal
    """
    # CNAE comum: 4713-0/02 - Lojas de departamentos ou magazines
    estabelecimentos = CNPJRepository.get_estabelecimentos_by_cnae(
        db_session,
        codigo_cnae="4713002",
        limit=5
    )
    
    if estabelecimentos:
        assert len(estabelecimentos) <= 5
        for estab in estabelecimentos:
            assert estab.cnae_fiscal_principal == "4713002"


def test_get_estabelecimentos_by_municipio(db_session):
    """
    Testa busca por município
    """
    # Município de São Paulo: 7107
    estabelecimentos = CNPJRepository.get_estabelecimentos_by_municipio(
        db_session,
        codigo_municipio="7107",
        limit=5
    )
    
    if estabelecimentos:
        assert len(estabelecimentos) <= 5
        for estab in estabelecimentos:
            assert estab.municipio == "7107"


# ================================================================
# TESTES DE SÓCIOS
# ================================================================

def test_get_socios_by_empresa(db_session):
    """
    Testa listagem de sócios de uma empresa
    """
    # Buscar empresa que tenha sócios
    empresa_com_socios = (
        db_session.query(Empresa)
        .join(Socio)
        .first()
    )
    
    if empresa_com_socios:
        socios = CNPJRepository.get_socios_by_empresa(
            db_session,
            empresa_com_socios.cnpj_basico
        )
        
        assert len(socios) > 0
        for socio in socios:
            assert socio.cnpj_basico == empresa_com_socios.cnpj_basico


def test_search_socios_by_nome(db_session):
    """
    Testa busca de sócios por nome
    """
    # Buscar nome comum
    socios, total = CNPJRepository.search_socios_by_nome(
        db_session,
        nome="SILVA",
        limit=10
    )
    
    if total > 0:
        assert len(socios) <= 10
        for socio in socios:
            assert "SILVA" in socio.nome_socio.upper()


def test_search_by_cnpj_cpf_socio(db_session):
    """
    Testa busca de participações societárias por CPF/CNPJ
    """
    # Pegar CPF/CNPJ de um sócio existente
    socio_exemplo = db_session.query(Socio).filter(
        Socio.cnpj_cpf_socio.isnot(None)
    ).first()
    
    if socio_exemplo and socio_exemplo.cnpj_cpf_socio:
        participacoes = CNPJRepository.search_by_cnpj_cpf_socio(
            db_session,
            socio_exemplo.cnpj_cpf_socio
        )
        
        assert len(participacoes) > 0
        for p in participacoes:
            assert p.cnpj_cpf_socio == socio_exemplo.cnpj_cpf_socio


def test_get_socio_by_pk(db_session):
    """
    Testa busca de sócio por PK composta
    """
    socio_exemplo = db_session.query(Socio).first()
    
    if socio_exemplo:
        socio = CNPJRepository.get_socio_by_pk(
            db_session,
            socio_exemplo.cnpj_basico,
            socio_exemplo.identificador_socio
        )
        
        assert socio is not None
        assert socio.cnpj_basico == socio_exemplo.cnpj_basico
        assert socio.identificador_socio == socio_exemplo.identificador_socio


# ================================================================
# TESTES DE SIMPLES NACIONAL
# ================================================================

def test_get_simples_by_empresa(db_session):
    """
    Testa consulta de Simples Nacional
    """
    # Buscar empresa optante do Simples
    empresa_simples = (
        db_session.query(SimplesNacional)
        .filter(SimplesNacional.opcao_simples == 'S')
        .first()
    )
    
    if empresa_simples:
        simples = CNPJRepository.get_simples_by_empresa(
            db_session,
            empresa_simples.cnpj_basico
        )
        
        assert simples is not None
        assert simples.cnpj_basico == empresa_simples.cnpj_basico
        assert simples.is_simples is True


def test_get_empresas_simples(db_session):
    """
    Testa listagem de empresas do Simples Nacional
    """
    empresas = CNPJRepository.get_empresas_simples(
        db_session,
        limit=10
    )
    
    if empresas:
        assert len(empresas) <= 10
        for emp in empresas:
            assert emp.opcao_simples == 'S'


def test_get_empresas_mei(db_session):
    """
    Testa listagem de MEIs
    """
    empresas = CNPJRepository.get_empresas_simples(
        db_session,
        apenas_mei=True,
        limit=10
    )
    
    if empresas:
        assert len(empresas) <= 10
        for emp in empresas:
            assert emp.opcao_mei == 'S'


# ================================================================
# TESTES DE TABELAS AUXILIARES
# ================================================================

def test_get_cnae_by_codigo(db_session):
    """
    Testa busca de CNAE por código
    """
    cnae = CNPJRepository.get_cnae_by_codigo(db_session, "4712100")
    
    if cnae:
        assert cnae.codigo == "4712100"
        assert cnae.descricao is not None


def test_search_cnaes_by_descricao(db_session):
    """
    Testa busca de CNAEs por descrição
    """
    cnaes = CNPJRepository.search_cnaes_by_descricao(
        db_session,
        termo="COMERCIO",
        limit=5
    )
    
    if cnaes:
        assert len(cnaes) <= 5
        for cnae in cnaes:
            assert "COMERCIO" in cnae.descricao.upper()


def test_get_natureza_juridica(db_session):
    """
    Testa busca de natureza jurídica
    """
    natureza = CNPJRepository.get_natureza_juridica(db_session, "206-2")
    
    if natureza:
        assert natureza.codigo == "206-2"
        assert natureza.descricao is not None


# ================================================================
# TESTES DE QUERIES COMPLEXAS
# ================================================================

def test_get_empresa_completa(db_session):
    """
    Testa query completa de empresa
    """
    # Pegar empresa com estabelecimentos e sócios
    empresa_exemplo = db_session.query(Empresa).first()
    
    resultado = CNPJRepository.get_empresa_completa(
        db_session,
        empresa_exemplo.cnpj_basico
    )
    
    assert resultado is not None
    assert resultado['empresa'] is not None
    assert isinstance(resultado['estabelecimentos'], list)
    assert isinstance(resultado['socios'], list)
    assert 'total_estabelecimentos' in resultado
    assert 'total_socios' in resultado
    assert 'is_simples' in resultado
    assert 'is_mei' in resultado


def test_empresa_inexistente(db_session):
    """
    Testa busca de empresa que não existe
    """
    empresa = CNPJRepository.get_empresa_by_cnpj_basico(
        db_session,
        "99999999"
    )
    
    assert empresa is None


def test_cnpj_completo_invalido(db_session):
    """
    Testa busca com CNPJ completo inválido
    """
    estab = CNPJRepository.get_estabelecimento_by_cnpj_completo(
        db_session,
        "99999999999999"
    )
    
    assert estab is None


# ================================================================
# TESTES DE PERFORMANCE (Opcional - comentados por padrão)
# ================================================================

@pytest.mark.skip(reason="Performance test - executar manualmente")
def test_performance_search_razao_social(db_session):
    """
    Testa performance de busca por razão social
    
    DEVE usar índice idx_empresas_razao_social
    Tempo esperado: < 500ms para 50 resultados
    """
    import time
    
    start = time.time()
    empresas, total = CNPJRepository.search_empresas_by_razao_social(
        db_session,
        termo="COMERCIO",
        limit=50
    )
    elapsed = time.time() - start
    
    print(f"\n⏱️  Busca por razão social: {elapsed:.3f}s")
    print(f"📊 Total encontrado: {total}")
    print(f"📦 Retornados: {len(empresas)}")
    
    assert elapsed < 0.5, f"Query lenta: {elapsed:.3f}s (esperado: < 0.5s)"


@pytest.mark.skip(reason="Performance test - executar manualmente")
def test_performance_get_estabelecimentos_by_empresa(db_session):
    """
    Testa performance de busca de estabelecimentos
    
    DEVE usar índice idx_estabelecimentos_cnpj_basico
    Tempo esperado: < 100ms
    """
    import time
    
    empresa = db_session.query(Empresa).first()
    
    start = time.time()
    estabelecimentos = CNPJRepository.get_estabelecimentos_by_empresa(
        db_session,
        empresa.cnpj_basico
    )
    elapsed = time.time() - start
    
    print(f"\n⏱️  Busca estabelecimentos: {elapsed:.3f}s")
    print(f"📦 Total: {len(estabelecimentos)}")
    
    assert elapsed < 0.1, f"Query lenta: {elapsed:.3f}s (esperado: < 0.1s)"


if __name__ == "__main__":
    """
    Executar testes:
    
    # Todos os testes
    pytest backend/tests/test_cnpj_crud.py -v
    
    # Apenas um teste específico
    pytest backend/tests/test_cnpj_crud.py::test_get_empresa_by_cnpj_basico -v
    
    # Com output detalhado
    pytest backend/tests/test_cnpj_crud.py -v -s
    
    # Incluindo testes de performance
    pytest backend/tests/test_cnpj_crud.py -v --run-all
    """
    pytest.main([__file__, "-v", "-s"])
