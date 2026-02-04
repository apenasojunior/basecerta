#!/usr/bin/env python3
"""
Validador de Performance de Queries - EXPLAIN ANALYZE
Sprint S02-F05-I03

Executa EXPLAIN ANALYZE nas queries principais para validar uso de índices.
Salva relatório detalhado em logs/query_performance_validation.txt
"""
import sys
from pathlib import Path
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.config import settings


def get_db_session():
    """Cria sessão do banco"""
    # Usa database_url do settings (já faz quote_plus da senha)
    engine = create_engine(settings.database_url)
    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()


def analyze_query(session, query_name: str, sql_query: str, params: dict = None):
    """
    Executa EXPLAIN ANALYZE em uma query e retorna análise
    
    Args:
        session: Sessão SQLAlchemy
        query_name: Nome descritivo da query
        sql_query: SQL da query a analisar
        params: Parâmetros da query
    
    Returns:
        dict com análise da query
    """
    print(f"\n{'='*80}")
    print(f"Analisando: {query_name}")
    print(f"{'='*80}\n")
    
    # Executa EXPLAIN ANALYZE
    explain_query = f"EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) {sql_query}"
    
    try:
        result = session.execute(text(explain_query), params or {})
        session.commit()  # Commit a transação
        plan = result.fetchone()[0][0]
        
        # Extrai informações importantes
        execution_time = plan.get("Execution Time", 0)
        planning_time = plan.get("Planning Time", 0)
        total_cost = plan["Plan"].get("Total Cost", 0)
        
        # Verifica tipo de scan
        node_type = plan["Plan"].get("Node Type", "Unknown")
        index_name = plan["Plan"].get("Index Name", "N/A")
        relation_name = plan["Plan"].get("Relation Name", "N/A")
        
        # Analisa se está usando índice
        using_index = "Index" in node_type or "Bitmap" in node_type
        seq_scan = "Seq Scan" in node_type
        
        analysis = {
            "query_name": query_name,
            "execution_time_ms": execution_time,
            "planning_time_ms": planning_time,
            "total_cost": total_cost,
            "node_type": node_type,
            "index_name": index_name,
            "relation_name": relation_name,
            "using_index": using_index,
            "seq_scan": seq_scan,
            "plan": plan
        }
        
        # Print summary
        print(f"⏱️  Execution Time: {execution_time:.2f}ms")
        print(f"📊 Planning Time: {planning_time:.2f}ms")
        print(f"💰 Total Cost: {total_cost:.2f}")
        print(f"🔍 Node Type: {node_type}")
        
        if using_index:
            print(f"✅ USANDO ÍNDICE: {index_name}")
        elif seq_scan:
            print(f"⚠️  SEQUENTIAL SCAN em {relation_name} - ATENÇÃO!")
        
        # Verifica performance
        if execution_time < 100:
            print("🚀 Performance: EXCELENTE (< 100ms)")
        elif execution_time < 500:
            print("✅ Performance: BOA (< 500ms)")
        elif execution_time < 1000:
            print("⚠️  Performance: ACEITÁVEL (< 1s)")
        else:
            print("❌ Performance: RUIM (> 1s) - OTIMIZAR!")
        
        return analysis
        
    except Exception as e:
        print(f"❌ ERRO ao analisar query: {e}")
        # Rollback em caso de erro
        try:
            session.rollback()
        except:
            pass
        return {
            "query_name": query_name,
            "error": str(e)
        }


def safe_execute(session, sql, params=None):
    """Executa query com tratamento de erro e rollback"""
    try:
        result = session.execute(text(sql), params or {})
        session.commit()
        return result.fetchone()
    except Exception as e:
        print(f"⚠️  Erro ao buscar dados: {e}")
        session.rollback()
        return None


def validate_all_queries():
    """Valida performance de todas as queries principais"""
    session = get_db_session()
    results = []
    
    print("\n" + "="*80)
    print("VALIDAÇÃO DE PERFORMANCE DE QUERIES - CNPJ API")
    print(f"Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)
    
    # ========================================================================
    # QUERY 1: Search Empresas por Razão Social
    # ========================================================================
    query1 = """
        SELECT 
            e.cnpj_basico,
            e.razao_social,
            e.natureza_juridica,
            e.qualificacao_responsavel,
            e.capital_social,
            e.porte_empresa,
            e.ente_federativo
        FROM cnpj.empresas e
        WHERE e.razao_social ILIKE :razao
        ORDER BY e.razao_social
        LIMIT 10
    """
    results.append(analyze_query(
        session,
        "Search Empresas por Razão Social (ILIKE)",
        query1,
        {"razao": "%SERVICOS%"}
    ))
    
    # ========================================================================
    # QUERY 2: Search Sócios por Nome
    # ========================================================================
    query2 = """
        SELECT 
            s.cnpj_basico,
            s.identificador_socio,
            s.nome_socio,
            s.cnpj_cpf_socio,
            s.qualificacao_socio,
            s.data_entrada_sociedade,
            s.pais,
            s.representante_legal,
            s.nome_representante,
            s.qualificacao_representante,
            s.faixa_etaria
        FROM cnpj.socios s
        WHERE s.nome_socio ILIKE :nome
        ORDER BY s.nome_socio
        LIMIT 10
    """
    results.append(analyze_query(
        session,
        "Search Sócios por Nome (ILIKE)",
        query2,
        {"nome": "%SILVA%"}
    ))
    
    # ========================================================================
    # QUERY 3: Get Empresa Completa (Multi-JOIN)
    # ========================================================================
    # Busca um CNPJ real
    cnpj_result = safe_execute(session, "SELECT cnpj_basico FROM cnpj.empresas LIMIT 1")
    
    if cnpj_result:
        cnpj_basico = cnpj_result[0]
        
        query3 = """
            SELECT 
                e.*,
                n.descricao as natureza_desc,
                q.descricao as qualificacao_desc
            FROM cnpj.empresas e
            LEFT JOIN cnpj.naturezas_juridicas n 
                ON e.natureza_juridica = n.codigo
            LEFT JOIN cnpj.qualificacoes_socios q 
                ON e.qualificacao_responsavel = q.codigo
            WHERE e.cnpj_basico = :cnpj
        """
        results.append(analyze_query(
            session,
            "Get Empresa Completa com JOINs",
            query3,
            {"cnpj": cnpj_basico}
        ))
    
    # ========================================================================
    # QUERY 4: Get Estabelecimento por CNPJ Completo (PK Lookup)
    # ========================================================================
    estab_result = safe_execute(
        session,
        "SELECT cnpj_basico, cnpj_ordem, cnpj_dv FROM cnpj.estabelecimentos LIMIT 1"
    )
    
    if estab_result:
        cnpj_basico, cnpj_ordem, cnpj_dv = estab_result
        
        query4 = """
            SELECT 
                est.*,
                cn.descricao as cnae_desc,
                m.descricao as municipio_desc,
                p.descricao as pais_desc
            FROM cnpj.estabelecimentos est
            LEFT JOIN cnpj.cnaes cn ON est.cnae_fiscal_principal = cn.codigo
            LEFT JOIN cnpj.municipios m ON est.municipio = m.codigo
            LEFT JOIN cnpj.paises p ON est.pais = p.codigo
            WHERE est.cnpj_basico = :basico 
              AND est.cnpj_ordem = :ordem 
              AND est.cnpj_dv = :dv
        """
        results.append(analyze_query(
            session,
            "Get Estabelecimento por PK com JOINs",
            query4,
            {"basico": cnpj_basico, "ordem": cnpj_ordem, "dv": cnpj_dv}
        ))
    
    # ========================================================================
    # QUERY 5: List Estabelecimentos por Empresa
    # ========================================================================
    if cnpj_result:
        cnpj_basico = cnpj_result[0]
        
        query5 = """
            SELECT 
                est.cnpj_basico,
                est.cnpj_ordem,
                est.cnpj_dv,
                est.identificador_matriz_filial,
                est.nome_fantasia,
                est.situacao_cadastral,
                est.data_situacao_cadastral
            FROM cnpj.estabelecimentos est
            WHERE est.cnpj_basico = :cnpj
            ORDER BY est.cnpj_ordem
        """
        results.append(analyze_query(
            session,
            "List Estabelecimentos por CNPJ Básico",
            query5,
            {"cnpj": cnpj_basico}
        ))
    
    # ========================================================================
    # QUERY 6: List Sócios por Empresa
    # ========================================================================
    socio_result = safe_execute(session, "SELECT cnpj_basico FROM cnpj.socios LIMIT 1")
    
    if socio_result:
        cnpj_basico = socio_result[0]
        
        query6 = """
            SELECT 
                s.*,
                q.descricao as qualificacao_desc
            FROM cnpj.socios s
            LEFT JOIN cnpj.qualificacoes_socios q 
                ON s.qualificacao_socio = q.codigo
            WHERE s.cnpj_basico = :cnpj
            ORDER BY s.nome_socio
        """
        results.append(analyze_query(
            session,
            "List Sócios por Empresa com JOIN",
            query6,
            {"cnpj": cnpj_basico}
        ))
    
    # ========================================================================
    # QUERY 7: Search com Múltiplos Filtros
    # ========================================================================
    query7 = """
        SELECT 
            e.cnpj_basico,
            e.razao_social,
            e.porte_empresa
        FROM cnpj.empresas e
        WHERE e.razao_social ILIKE :razao
          AND e.porte_empresa = CAST(:porte AS VARCHAR)
        ORDER BY e.razao_social
        LIMIT 10
    """
    results.append(analyze_query(
        session,
        "Search Empresas com Múltiplos Filtros",
        query7,
        {"razao": "%SERVICOS%", "porte": "5"}
    ))
    
    # ========================================================================
    # QUERY 8: Search Sócios por CPF (índice específico)
    # ========================================================================
    cpf_result = safe_execute(
        session,
        "SELECT cnpj_cpf_socio FROM cnpj.socios WHERE identificador_socio = '2' LIMIT 1"
    )
    
    if cpf_result and cpf_result[0]:
        query8 = """
            SELECT 
                s.*
            FROM cnpj.socios s
            WHERE s.cnpj_cpf_socio = :cpf
              AND s.identificador_socio = '2'
        """
        results.append(analyze_query(
            session,
            "Search Sócio por CPF (índice composto)",
            query8,
            {"cpf": cpf_result[0]}
        ))
    
    session.close()
    
    # ========================================================================
    # GERA RELATÓRIO
    # ========================================================================
    generate_report(results)
    
    return results


def generate_report(results: list):
    """Gera relatório detalhado em arquivo"""
    report_path = Path(__file__).parent.parent / "logs" / "query_performance_validation.txt"
    report_path.parent.mkdir(exist_ok=True)
    
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("="*80 + "\n")
        f.write("RELATÓRIO DE VALIDAÇÃO DE PERFORMANCE - QUERIES CNPJ API\n")
        f.write(f"Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*80 + "\n\n")
        
        # Sumário Executivo
        f.write("📊 SUMÁRIO EXECUTIVO\n")
        f.write("-"*80 + "\n\n")
        
        total_queries = len(results)
        queries_com_erro = sum(1 for r in results if "error" in r)
        queries_sucesso = total_queries - queries_com_erro
        queries_usando_indice = sum(1 for r in results if r.get("using_index", False))
        queries_seq_scan = sum(1 for r in results if r.get("seq_scan", False))
        queries_rapidas = sum(1 for r in results if r.get("execution_time_ms", float('inf')) < 500)
        
        f.write(f"Total de Queries Analisadas: {total_queries}\n")
        f.write(f"Queries com Sucesso: {queries_sucesso}/{total_queries}\n")
        f.write(f"Queries com Erro: {queries_com_erro}/{total_queries}\n")
        
        if queries_sucesso > 0:
            f.write(f"Queries Usando Índice: {queries_usando_indice}/{queries_sucesso} ({queries_usando_indice/queries_sucesso*100:.1f}%)\n")
            f.write(f"Queries com Sequential Scan: {queries_seq_scan}/{queries_sucesso} ({queries_seq_scan/queries_sucesso*100:.1f}%)\n")
            f.write(f"Queries < 500ms: {queries_rapidas}/{queries_sucesso} ({queries_rapidas/queries_sucesso*100:.1f}%)\n")
        f.write("\n")
        
        # Performance Médias
        successful_results = [r for r in results if "error" not in r]
        if successful_results:
            avg_exec_time = sum(r.get("execution_time_ms", 0) for r in successful_results) / len(successful_results)
            avg_planning_time = sum(r.get("planning_time_ms", 0) for r in successful_results) / len(successful_results)
            
            f.write(f"⏱️  Tempo Médio de Execução: {avg_exec_time:.2f}ms\n")
            f.write(f"📊 Tempo Médio de Planning: {avg_planning_time:.2f}ms\n")
        f.write("\n\n")
        
        # Detalhes por Query
        f.write("="*80 + "\n")
        f.write("DETALHES POR QUERY\n")
        f.write("="*80 + "\n\n")
        
        for i, result in enumerate(results, 1):
            if "error" in result:
                f.write(f"\n{i}. {result['query_name']}\n")
                f.write(f"   ❌ ERRO: {result['error']}\n")
                continue
            
            f.write(f"\n{i}. {result['query_name']}\n")
            f.write("-"*80 + "\n")
            f.write(f"   Execution Time: {result['execution_time_ms']:.2f}ms\n")
            f.write(f"   Planning Time: {result['planning_time_ms']:.2f}ms\n")
            f.write(f"   Total Cost: {result['total_cost']:.2f}\n")
            f.write(f"   Node Type: {result['node_type']}\n")
            f.write(f"   Relation: {result['relation_name']}\n")
            
            if result['using_index']:
                f.write(f"   ✅ Index: {result['index_name']}\n")
            elif result['seq_scan']:
                f.write(f"   ⚠️  SEQUENTIAL SCAN (SEM ÍNDICE!)\n")
            
            # Performance rating
            exec_time = result['execution_time_ms']
            if exec_time < 100:
                f.write(f"   🚀 Performance: EXCELENTE\n")
            elif exec_time < 500:
                f.write(f"   ✅ Performance: BOA\n")
            elif exec_time < 1000:
                f.write(f"   ⚠️  Performance: ACEITÁVEL\n")
            else:
                f.write(f"   ❌ Performance: RUIM - OTIMIZAR!\n")
            
            f.write("\n")
        
        # Recomendações
        f.write("\n" + "="*80 + "\n")
        f.write("🎯 RECOMENDAÇÕES\n")
        f.write("="*80 + "\n\n")
        
        if queries_seq_scan > 0:
            f.write("⚠️  ATENÇÃO: Queries com Sequential Scan detectadas!\n")
            f.write("   Considere criar índices adicionais para melhorar performance.\n\n")
        
        if queries_sucesso > 0:
            if queries_rapidas == queries_sucesso:
                f.write("✅ Todas as queries executam em menos de 500ms - EXCELENTE!\n\n")
            elif queries_rapidas >= queries_sucesso * 0.8:
                f.write("✅ Maioria das queries com boa performance (>80% < 500ms).\n\n")
            else:
                f.write("❌ Muitas queries lentas - OTIMIZAR!\n")
                f.write("   Revise índices e estrutura das queries.\n\n")
        
        f.write("\n" + "="*80 + "\n")
        f.write("FIM DO RELATÓRIO\n")
        f.write("="*80 + "\n")
    
    print(f"\n{'='*80}")
    print(f"📄 Relatório salvo em: {report_path}")
    print(f"{'='*80}\n")


if __name__ == "__main__":
    print("🔍 Iniciando validação de performance de queries...")
    results = validate_all_queries()
    
    print("\n" + "="*80)
    print("✅ Validação concluída!")
    print("="*80)
