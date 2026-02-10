"""
Seed de estatísticas geográficas para F04
Cria dados dos 27 estados brasileiros + principais municípios
"""
import sys
from pathlib import Path
from datetime import datetime
import random
import json

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy import create_engine, text
from app.core.config import settings

def seed_geographic():
    """Create geographic statistics for Brazilian states and top municipalities"""
    
    engine = create_engine(settings.database_url)
    
    # 27 Brazilian states with realistic data
    states = [
        # REGIÃO NORTE
        {'uf': 'AC', 'nome': 'Acre', 'regiao': 'Norte', 'empresas': 12500, 'capital_bi': 2.5, 'growth_1y': 5.2},
        {'uf': 'AP', 'nome': 'Amapá', 'regiao': 'Norte', 'empresas': 9800, 'capital_bi': 1.8, 'growth_1y': 4.8},
        {'uf': 'AM', 'nome': 'Amazonas', 'regiao': 'Norte', 'empresas': 78500, 'capital_bi': 15.2, 'growth_1y': 6.1},
        {'uf': 'PA', 'nome': 'Pará', 'regiao': 'Norte', 'empresas': 125000, 'capital_bi': 22.5, 'growth_1y': 7.3},
        {'uf': 'RO', 'nome': 'Rondônia', 'regiao': 'Norte', 'empresas': 42000, 'capital_bi': 8.5, 'growth_1y': 5.9},
        {'uf': 'RR', 'nome': 'Roraima', 'regiao': 'Norte', 'empresas': 8200, 'capital_bi': 1.5, 'growth_1y': 4.5},
        {'uf': 'TO', 'nome': 'Tocantins', 'regiao': 'Norte', 'empresas': 35000, 'capital_bi': 6.8, 'growth_1y': 6.2},
        
        # REGIÃO NORDESTE
        {'uf': 'AL', 'nome': 'Alagoas', 'regiao': 'Nordeste', 'empresas': 52000, 'capital_bi': 9.5, 'growth_1y': 5.1},
        {'uf': 'BA', 'nome': 'Bahia', 'regiao': 'Nordeste', 'empresas': 285000, 'capital_bi': 48.5, 'growth_1y': 6.8},
        {'uf': 'CE', 'nome': 'Ceará', 'regiao': 'Nordeste', 'empresas': 195000, 'capital_bi': 35.2, 'growth_1y': 7.2},
        {'uf': 'MA', 'nome': 'Maranhão', 'regiao': 'Nordeste', 'empresas': 98000, 'capital_bi': 16.5, 'growth_1y': 6.5},
        {'uf': 'PB', 'nome': 'Paraíba', 'regiao': 'Nordeste', 'empresas': 78000, 'capital_bi': 13.2, 'growth_1y': 5.8},
        {'uf': 'PE', 'nome': 'Pernambuco', 'regiao': 'Nordeste', 'empresas': 225000, 'capital_bi': 42.8, 'growth_1y': 7.1},
        {'uf': 'PI', 'nome': 'Piauí', 'regiao': 'Nordeste', 'empresas': 62000, 'capital_bi': 10.5, 'growth_1y': 5.6},
        {'uf': 'RN', 'nome': 'Rio Grande do Norte', 'regiao': 'Nordeste', 'empresas': 85000, 'capital_bi': 15.8, 'growth_1y': 6.3},
        {'uf': 'SE', 'nome': 'Sergipe', 'regiao': 'Nordeste', 'empresas': 48000, 'capital_bi': 8.9, 'growth_1y': 5.4},
        
        # REGIÃO CENTRO-OESTE
        {'uf': 'DF', 'nome': 'Distrito Federal', 'regiao': 'Centro-Oeste', 'empresas': 235000, 'capital_bi': 58.5, 'growth_1y': 8.2},
        {'uf': 'GO', 'nome': 'Goiás', 'regiao': 'Centro-Oeste', 'empresas': 185000, 'capital_bi': 38.5, 'growth_1y': 7.5},
        {'uf': 'MT', 'nome': 'Mato Grosso', 'regiao': 'Centro-Oeste', 'empresas': 95000, 'capital_bi': 22.5, 'growth_1y': 6.9},
        {'uf': 'MS', 'nome': 'Mato Grosso do Sul', 'regiao': 'Centro-Oeste', 'empresas': 78000, 'capital_bi': 18.2, 'growth_1y': 6.4},
        
        # REGIÃO SUDESTE
        {'uf': 'ES', 'nome': 'Espírito Santo', 'regiao': 'Sudeste', 'empresas': 145000, 'capital_bi': 32.5, 'growth_1y': 6.8},
        {'uf': 'MG', 'nome': 'Minas Gerais', 'regiao': 'Sudeste', 'empresas': 625000, 'capital_bi': 142.8, 'growth_1y': 7.4},
        {'uf': 'RJ', 'nome': 'Rio de Janeiro', 'regiao': 'Sudeste', 'empresas': 685000, 'capital_bi': 198.5, 'growth_1y': 5.9},
        {'uf': 'SP', 'nome': 'São Paulo', 'regiao': 'Sudeste', 'empresas': 2150000, 'capital_bi': 625.8, 'growth_1y': 8.5},
        
        # REGIÃO SUL
        {'uf': 'PR', 'nome': 'Paraná', 'regiao': 'Sul', 'empresas': 425000, 'capital_bi': 95.5, 'growth_1y': 7.8},
        {'uf': 'RS', 'nome': 'Rio Grande do Sul', 'regiao': 'Sul', 'empresas': 485000, 'capital_bi': 108.2, 'growth_1y': 6.9},
        {'uf': 'SC', 'nome': 'Santa Catarina', 'regiao': 'Sul', 'empresas': 385000, 'capital_bi': 88.5, 'growth_1y': 8.9},
    ]
    
    # Top municipalities (capitals + major cities)
    municipalities = [
        # Capitais e principais cidades
        {'ibge': '3550308', 'nome': 'São Paulo', 'uf': 'SP', 'capital': True, 'empresas': 785000, 'capital_bi': 285.5},
        {'ibge': '3304557', 'nome': 'Rio de Janeiro', 'uf': 'RJ', 'capital': True, 'empresas': 395000, 'capital_bi': 125.8},
        {'ibge': '3106200', 'nome': 'Belo Horizonte', 'uf': 'MG', 'capital': True, 'empresas': 145000, 'capital_bi': 42.5},
        {'ibge': '4106902', 'nome': 'Curitiba', 'uf': 'PR', 'capital': True, 'empresas': 135000, 'capital_bi': 38.9},
        {'ibge': '4314902', 'nome': 'Porto Alegre', 'uf': 'RS', 'capital': True, 'empresas': 125000, 'capital_bi': 35.2},
        {'ibge': '2304400', 'nome': 'Fortaleza', 'uf': 'CE', 'capital': True, 'empresas': 98000, 'capital_bi': 22.5},
        {'ibge': '2927408', 'nome': 'Salvador', 'uf': 'BA', 'capital': True, 'empresas': 115000, 'capital_bi': 28.5},
        {'ibge': '5300108', 'nome': 'Brasília', 'uf': 'DF', 'capital': True, 'empresas': 185000, 'capital_bi': 52.8},
        {'ibge': '2611606', 'nome': 'Recife', 'uf': 'PE', 'capital': True, 'empresas': 92000, 'capital_bi': 21.5},
        {'ibge': '1302603', 'nome': 'Manaus', 'uf': 'AM', 'capital': True, 'empresas': 52000, 'capital_bi': 12.8},
        
        # Principais cidades não capitais
        {'ibge': '3509502', 'nome': 'Campinas', 'uf': 'SP', 'capital': False, 'empresas': 68000, 'capital_bi': 18.5},
        {'ibge': '3518800', 'nome': 'Guarulhos', 'uf': 'SP', 'capital': False, 'empresas': 52000, 'capital_bi': 14.2},
        {'ibge': '3547809', 'nome': 'Santo André', 'uf': 'SP', 'capital': False, 'empresas': 35000, 'capital_bi': 9.8},
        {'ibge': '3303500', 'nome': 'Niterói', 'uf': 'RJ', 'capital': False, 'empresas': 28000, 'capital_bi': 8.5},
        {'ibge': '4205407', 'nome': 'Florianópolis', 'uf': 'SC', 'capital': True, 'empresas': 42000, 'capital_bi': 12.5},
        {'ibge': '4209102', 'nome': 'Joinville', 'uf': 'SC', 'capital': False, 'empresas': 38000, 'capital_bi': 11.2},
        {'ibge': '4202404', 'nome': 'Blumenau', 'uf': 'SC', 'capital': False, 'empresas': 32000, 'capital_bi': 9.5},
        {'ibge': '3136702', 'nome': 'Juiz de Fora', 'uf': 'MG', 'capital': False, 'empresas': 28000, 'capital_bi': 7.8},
        {'ibge': '3170206', 'nome': 'Uberlândia', 'uf': 'MG', 'capital': False, 'empresas': 35000, 'capital_bi': 10.2},
        {'ibge': '4113700', 'nome': 'Londrina', 'uf': 'PR', 'capital': False, 'empresas': 32000, 'capital_bi': 8.9},
    ]
    
    with engine.connect() as conn:
        # Clear existing data
        conn.execute(text("DELETE FROM geographic_stats"))
        conn.commit()
        
        count = 0
        
        # Insert states
        for state in states:
            conn.execute(text("""
                INSERT INTO geographic_stats (
                    municipio_ibge, municipio_nome, estado_uf, estado_nome, regiao,
                    is_capital, total_empresas, total_capital_social,
                    cnae_principal, porte_predominante,
                    growth_rate_30d, growth_rate_90d, growth_rate_1y,
                    metadata, calculated_at, created_at, updated_at
                ) VALUES (
                    NULL, NULL, :uf, :nome, :regiao,
                    FALSE, :empresas, :capital,
                    :cnae, :porte,
                    :growth_30d, :growth_90d, :growth_1y,
                    CAST(:metadata AS jsonb), :calculated_at, :created_at, :updated_at
                )
            """), {
                'uf': state['uf'],
                'nome': state['nome'],
                'regiao': state['regiao'],
                'empresas': state['empresas'],
                'capital': state['capital_bi'] * 1000000000,  # Convert to decimal
                'cnae': random.choice(['6201501', '4711302', '4744005', '8621601']),
                'porte': random.choice(['01', '03', '05']),  # 01=ME, 03=EPP, 05=DEMAIS
                'growth_30d': round(state['growth_1y'] / 12 + random.uniform(-0.5, 0.5), 2),
                'growth_90d': round(state['growth_1y'] / 4 + random.uniform(-1, 1), 2),
                'growth_1y': state['growth_1y'],
                'metadata': json.dumps({
                    'regiao': state['regiao'],
                    'tipo': 'estado',
                    'data_source': 'demo_seed'
                }),
                'calculated_at': datetime.utcnow(),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            })
            count += 1
        
        # Insert municipalities
        for city in municipalities:
            # Get state info
            state = next(s for s in states if s['uf'] == city['uf'])
            
            conn.execute(text("""
                INSERT INTO geographic_stats (
                    municipio_ibge, municipio_nome, estado_uf, estado_nome, regiao,
                    is_capital, total_empresas, total_capital_social,
                    cnae_principal, porte_predominante,
                    growth_rate_30d, growth_rate_90d, growth_rate_1y,
                    metadata, calculated_at, created_at, updated_at
                ) VALUES (
                    :ibge, :nome, :uf, :estado_nome, :regiao,
                    :is_capital, :empresas, :total_capital,
                    :cnae, :porte,
                    :growth_30d, :growth_90d, :growth_1y,
                    CAST(:metadata AS jsonb), :calculated_at, :created_at, :updated_at
                )
            """), {
                'ibge': city['ibge'],
                'nome': city['nome'],
                'uf': city['uf'],
                'estado_nome': state['nome'],
                'regiao': state['regiao'],
                'is_capital': city['capital'],
                'empresas': city['empresas'],
                'total_capital': city['capital_bi'] * 1000000000,
                'cnae': random.choice(['6201501', '4711302', '4744005', '8621601', '6202300']),
                'porte': random.choice(['01', '03', '05']),  # 01=ME, 03=EPP, 05=DEMAIS
                'growth_30d': round(random.uniform(0.3, 1.2), 2),
                'growth_90d': round(random.uniform(1.5, 4.5), 2),
                'growth_1y': round(random.uniform(5.0, 9.5), 2),
                'metadata': json.dumps({
                    'regiao': state['regiao'],
                    'tipo': 'municipio',
                    'is_capital': city['capital'],
                    'data_source': 'demo_seed'
                }),
                'calculated_at': datetime.utcnow(),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            })
            count += 1
        
        conn.commit()
        print(f"✅ {count} registros geográficos criados ({len(states)} estados + {len(municipalities)} municípios)!")
        
        # Show summary
        result = conn.execute(text("""
            SELECT regiao, COUNT(*) as total, SUM(total_empresas) as empresas
            FROM geographic_stats
            WHERE municipio_ibge IS NULL
            GROUP BY regiao
            ORDER BY empresas DESC
        """))
        
        print("\nResumo por região:")
        for row in result:
            print(f"  • {row.regiao:15} | Estados: {row.total} | Empresas: {row.empresas:>10,}")
        
        result = conn.execute(text("""
            SELECT estado_uf, municipio_nome, total_empresas
            FROM geographic_stats
            WHERE municipio_ibge IS NOT NULL
            ORDER BY total_empresas DESC
            LIMIT 10
        """))
        
        print("\nTop 10 municípios:")
        for row in result:
            print(f"  • {row.municipio_nome:20} ({row.estado_uf}) | {row.total_empresas:>8,} empresas")

if __name__ == "__main__":
    seed_geographic()
