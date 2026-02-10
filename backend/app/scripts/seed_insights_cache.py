"""
Seed script for insights_cache table
Populates 15-20 strategic insights across different categories
"""
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path to import app modules
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, text
from app.core.config import settings


def seed_insights_cache():
    """Populate insights_cache with strategic insights"""
    
    engine = create_engine(settings.database_url)
    
    insights = [
        # CATEGORIA: SETOR
        {
            'insight_key': 'setor_tecnologia',
            'categoria': 'setor',
            'titulo': 'Tecnologia da Informação em Alta',
            'descricao': 'Setor de TI apresenta crescimento de 45% nos últimos 12 meses',
            'total_empresas': 125430,
            'percentual': 8.5,
            'valor_medio': 250000.0,
            'taxa_crescimento': 45.2,
            'classificacao_anomalia': 'high_growth',
            'z_score': 2.8,
            'prioridade_score': 92.5,
            'metadata': {'cnaes': ['6201-5/00', '6202-3/00', '6209-1/00'], 'principais_estados': ['SP', 'RJ', 'MG']},
            'filtros': {'setor': 'tecnologia', 'periodo': '12m'}
        },
        {
            'insight_key': 'setor_saude',
            'categoria': 'setor',
            'titulo': 'Saúde e Bem-Estar Crescente',
            'descricao': 'Empresas de saúde crescem 32% com demanda pós-pandemia',
            'total_empresas': 98650,
            'percentual': 6.7,
            'valor_medio': 180000.0,
            'taxa_crescimento': 32.1,
            'classificacao_anomalia': 'high_growth',
            'z_score': 2.3,
            'prioridade_score': 85.3,
            'metadata': {'cnaes': ['8610-1/01', '8630-5/04', '4771-7/01'], 'principais_estados': ['SP', 'RJ', 'RS']},
            'filtros': {'setor': 'saude', 'periodo': '12m'}
        },
        {
            'insight_key': 'setor_ecommerce',
            'categoria': 'setor',
            'titulo': 'E-commerce em Expansão',
            'descricao': 'Comércio eletrônico mantém crescimento de 28%',
            'total_empresas': 87320,
            'percentual': 5.9,
            'valor_medio': 95000.0,
            'taxa_crescimento': 28.4,
            'classificacao_anomalia': 'emerging',
            'z_score': 1.9,
            'prioridade_score': 78.6,
            'metadata': {'cnaes': ['4751-2/01', '4789-0/99'], 'principais_estados': ['SP', 'SC', 'PR']},
            'filtros': {'setor': 'comercio_eletronico', 'periodo': '12m'}
        },
        {
            'insight_key': 'setor_energia_renovavel',
            'categoria': 'setor',
            'titulo': 'Energia Renovável Emergente',
            'descricao': 'Setor de energia limpa cresce 52% com incentivos governamentais',
            'total_empresas': 15680,
            'percentual': 1.1,
            'valor_medio': 450000.0,
            'taxa_crescimento': 52.3,
            'classificacao_anomalia': 'high_growth',
            'z_score': 3.1,
            'prioridade_score': 95.2,
            'metadata': {'cnaes': ['3511-5/01', '3514-0/00'], 'principais_estados': ['SP', 'MG', 'BA']},
            'filtros': {'setor': 'energia_renovavel', 'periodo': '12m'}
        },
        {
            'insight_key': 'setor_construcao',
            'categoria': 'setor',
            'titulo': 'Construção Civil em Recuperação',
            'descricao': 'Construção apresenta crescimento moderado de 12%',
            'total_empresas': 156890,
            'percentual': 10.6,
            'valor_medio': 320000.0,
            'taxa_crescimento': 12.3,
            'classificacao_anomalia': None,
            'z_score': 0.8,
            'prioridade_score': 58.4,
            'metadata': {'cnaes': ['4120-4/00', '4399-1/03'], 'principais_estados': ['SP', 'RJ', 'MG']},
            'filtros': {'setor': 'construcao', 'periodo': '12m'}
        },
        {
            'insight_key': 'setor_educacao',
            'categoria': 'setor',
            'titulo': 'Educação Online em Destaque',
            'descricao': 'EdTech e educação online crescem 38%',
            'total_empresas': 42560,
            'percentual': 2.9,
            'valor_medio': 125000.0,
            'taxa_crescimento': 38.1,
            'classificacao_anomalia': 'high_growth',
            'z_score': 2.4,
            'prioridade_score': 82.7,
            'metadata': {'cnaes': ['8599-6/04', '8513-9/00'], 'principais_estados': ['SP', 'RJ', 'PR']},
            'filtros': {'setor': 'educacao', 'periodo': '12m'}
        },
        
        # CATEGORIA: ESTADO
        {
            'insight_key': 'estado_sp',
            'categoria': 'estado',
            'titulo': 'São Paulo Lidera Criação de Empresas',
            'descricao': 'SP concentra 35% das novas empresas do país',
            'total_empresas': 520000,
            'percentual': 35.2,
            'valor_medio': 185000.0,
            'taxa_crescimento': 18.5,
            'classificacao_anomalia': None,
            'z_score': 1.2,
            'prioridade_score': 72.3,
            'metadata': {'principais_cidades': ['São Paulo', 'Campinas', 'Santos'], 'setores_destaque': ['tecnologia', 'servicos']},
            'filtros': {'estado': 'SP', 'periodo': '12m'}
        },
        {
            'insight_key': 'estado_sc',
            'categoria': 'estado',
            'titulo': 'Santa Catarina com Maior Crescimento',
            'descricao': 'SC registra 42% de crescimento em novas empresas',
            'total_empresas': 78650,
            'percentual': 5.3,
            'valor_medio': 210000.0,
            'taxa_crescimento': 42.1,
            'classificacao_anomalia': 'high_growth',
            'z_score': 2.6,
            'prioridade_score': 88.9,
            'metadata': {'principais_cidades': ['Florianópolis', 'Joinville', 'Blumenau'], 'setores_destaque': ['tecnologia', 'industria']},
            'filtros': {'estado': 'SC', 'periodo': '12m'}
        },
        {
            'insight_key': 'estado_mg',
            'categoria': 'estado',
            'titulo': 'Minas Gerais com Crescimento Sólido',
            'descricao': 'MG cresce 22% com foco em tecnologia e mineração',
            'total_empresas': 142300,
            'percentual': 9.6,
            'valor_medio': 165000.0,
            'taxa_crescimento': 22.3,
            'classificacao_anomalia': 'emerging',
            'z_score': 1.7,
            'prioridade_score': 74.5,
            'metadata': {'principais_cidades': ['Belo Horizonte', 'Uberlândia', 'Contagem'], 'setores_destaque': ['tecnologia', 'mineracao']},
            'filtros': {'estado': 'MG', 'periodo': '12m'}
        },
        {
            'insight_key': 'estado_pr',
            'categoria': 'estado',
            'titulo': 'Paraná em Expansão Agroindustrial',
            'descricao': 'PR cresce 25% com agroindústria e logística',
            'total_empresas': 98420,
            'percentual': 6.7,
            'valor_medio': 195000.0,
            'taxa_crescimento': 25.2,
            'classificacao_anomalia': 'emerging',
            'z_score': 1.8,
            'prioridade_score': 76.8,
            'metadata': {'principais_cidades': ['Curitiba', 'Londrina', 'Maringá'], 'setores_destaque': ['agroindustria', 'logistica']},
            'filtros': {'estado': 'PR', 'periodo': '12m'}
        },
        {
            'insight_key': 'estado_rs',
            'categoria': 'estado',
            'titulo': 'Rio Grande do Sul Estável',
            'descricao': 'RS mantém crescimento de 15% em diversos setores',
            'total_empresas': 123560,
            'percentual': 8.4,
            'valor_medio': 175000.0,
            'taxa_crescimento': 15.1,
            'classificacao_anomalia': None,
            'z_score': 1.0,
            'prioridade_score': 65.2,
            'metadata': {'principais_cidades': ['Porto Alegre', 'Caxias do Sul', 'Pelotas'], 'setores_destaque': ['agroindustria', 'tecnologia']},
            'filtros': {'estado': 'RS', 'periodo': '12m'}
        },
        {
            'insight_key': 'estado_rj',
            'categoria': 'estado',
            'titulo': 'Rio de Janeiro em Recuperação',
            'descricao': 'RJ registra crescimento de 10% após anos de retração',
            'total_empresas': 185640,
            'percentual': 12.6,
            'valor_medio': 155000.0,
            'taxa_crescimento': 10.2,
            'classificacao_anomalia': None,
            'z_score': 0.6,
            'prioridade_score': 52.7,
            'metadata': {'principais_cidades': ['Rio de Janeiro', 'Niterói', 'Duque de Caxias'], 'setores_destaque': ['petroleo', 'tecnologia']},
            'filtros': {'estado': 'RJ', 'periodo': '12m'}
        },
        
        # CATEGORIA: CAPITAL SOCIAL
        {
            'insight_key': 'capital_micro',
            'categoria': 'capital',
            'titulo': 'Microempresas Dominam Criação',
            'descricao': '78% das novas empresas têm capital até R$ 100 mil',
            'total_empresas': 1150000,
            'percentual': 78.0,
            'valor_medio': 35000.0,
            'taxa_crescimento': 20.5,
            'classificacao_anomalia': None,
            'z_score': 1.1,
            'prioridade_score': 68.3,
            'metadata': {'faixa': '0-100k', 'principais_setores': ['servicos', 'comercio']},
            'filtros': {'capital_max': 100000, 'periodo': '12m'}
        },
        {
            'insight_key': 'capital_pequeno',
            'categoria': 'capital',
            'titulo': 'Pequenas Empresas em Crescimento',
            'descricao': 'Empresas com capital R$ 100k-500k crescem 35%',
            'total_empresas': 235600,
            'percentual': 16.0,
            'valor_medio': 280000.0,
            'taxa_crescimento': 35.2,
            'classificacao_anomalia': 'high_growth',
            'z_score': 2.2,
            'prioridade_score': 81.5,
            'metadata': {'faixa': '100k-500k', 'principais_setores': ['tecnologia', 'comercio']},
            'filtros': {'capital_min': 100000, 'capital_max': 500000, 'periodo': '12m'}
        },
        {
            'insight_key': 'capital_medio',
            'categoria': 'capital',
            'titulo': 'Médias Empresas com Alto Potencial',
            'descricao': 'Empresas com capital R$ 500k-2M crescem 48%',
            'total_empresas': 68400,
            'percentual': 4.6,
            'valor_medio': 1200000.0,
            'taxa_crescimento': 48.3,
            'classificacao_anomalia': 'high_growth',
            'z_score': 2.9,
            'prioridade_score': 91.2,
            'metadata': {'faixa': '500k-2M', 'principais_setores': ['tecnologia', 'industria']},
            'filtros': {'capital_min': 500000, 'capital_max': 2000000, 'periodo': '12m'}
        },
        {
            'insight_key': 'capital_grande',
            'categoria': 'capital',
            'titulo': 'Grandes Empresas Estáveis',
            'descricao': 'Empresas com capital acima de R$ 2M crescem 8%',
            'total_empresas': 19850,
            'percentual': 1.4,
            'valor_medio': 5800000.0,
            'taxa_crescimento': 8.1,
            'classificacao_anomalia': None,
            'z_score': 0.4,
            'prioridade_score': 45.6,
            'metadata': {'faixa': '2M+', 'principais_setores': ['financeiro', 'industria']},
            'filtros': {'capital_min': 2000000, 'periodo': '12m'}
        },
        
        # CATEGORIA: IDADE
        {
            'insight_key': 'idade_startups',
            'categoria': 'idade',
            'titulo': 'Boom de Startups (0-2 anos)',
            'descricao': 'Empresas novas crescem 55% com ecossistema fortalecido',
            'total_empresas': 420000,
            'percentual': 28.5,
            'valor_medio': 85000.0,
            'taxa_crescimento': 55.2,
            'classificacao_anomalia': 'high_growth',
            'z_score': 3.3,
            'prioridade_score': 96.8,
            'metadata': {'faixa_idade': '0-2 anos', 'taxa_sobrevivencia': 68.5},
            'filtros': {'idade_max': 2, 'periodo': '12m'}
        },
        {
            'insight_key': 'idade_jovens',
            'categoria': 'idade',
            'titulo': 'Empresas Jovens Consolidando',
            'descricao': 'Empresas de 2-5 anos crescem 30% ao passar fase crítica',
            'total_empresas': 315000,
            'percentual': 21.3,
            'valor_medio': 165000.0,
            'taxa_crescimento': 30.1,
            'classificacao_anomalia': 'emerging',
            'z_score': 2.0,
            'prioridade_score': 79.4,
            'metadata': {'faixa_idade': '2-5 anos', 'taxa_sobrevivencia': 82.3},
            'filtros': {'idade_min': 2, 'idade_max': 5, 'periodo': '12m'}
        },
        {
            'insight_key': 'idade_maduras',
            'categoria': 'idade',
            'titulo': 'Empresas Maduras Resilientes',
            'descricao': 'Empresas 5+ anos mantêm crescimento de 12%',
            'total_empresas': 738000,
            'percentual': 50.2,
            'valor_medio': 285000.0,
            'taxa_crescimento': 12.3,
            'classificacao_anomalia': None,
            'z_score': 0.7,
            'prioridade_score': 61.5,
            'metadata': {'faixa_idade': '5+ anos', 'taxa_sobrevivencia': 94.7},
            'filtros': {'idade_min': 5, 'periodo': '12m'}
        },
    ]
    
    with engine.connect() as conn:
        # Clear existing data (for re-seeding)
        conn.execute(text("TRUNCATE TABLE insights_cache RESTART IDENTITY CASCADE"))
        conn.commit()
        
        # Insert insights
        for insight in insights:
            sql = text("""
                INSERT INTO insights_cache (
                    insight_key, categoria, titulo, descricao, total_empresas, 
                    percentual, valor_medio, taxa_crescimento, classificacao_anomalia,
                    z_score, prioridade_score, metadata, filtros
                ) VALUES (
                    :insight_key, :categoria, :titulo, :descricao, :total_empresas,
                    :percentual, :valor_medio, :taxa_crescimento, :classificacao_anomalia,
                    :z_score, :prioridade_score, CAST(:metadata AS jsonb), CAST(:filtros AS jsonb)
                )
            """)
            
            # Convert dict to JSON string for JSONB
            import json
            insight_copy = insight.copy()
            insight_copy['metadata'] = json.dumps(insight['metadata'])
            insight_copy['filtros'] = json.dumps(insight['filtros'])
            
            conn.execute(sql, insight_copy)
        
        conn.commit()
        print(f"✅ Successfully seeded {len(insights)} insights into insights_cache")
        print(f"   - Setores: 6")
        print(f"   - Estados: 6")
        print(f"   - Capital: 4")
        print(f"   - Idade: 3")


if __name__ == "__main__":
    seed_insights_cache()
