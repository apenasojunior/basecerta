"""
Seed de preferências de usuários para F04
Cria configurações personalizadas para cada usuário demo
"""
import sys
from pathlib import Path
from datetime import datetime
import json

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy import create_engine, text
from app.core.config import settings

def seed_preferences():
    """Create user preferences for demo users"""
    
    engine = create_engine(settings.database_url)
    
    # Preferences for each demo user
    preferences = [
        {
            'user_id': '550e8400-e29b-41d4-a716-446655440001',  # admin
            'dashboard_layout': {
                'widgets': [
                    {'id': 'insights', 'position': {'x': 0, 'y': 0, 'w': 6, 'h': 4}},
                    {'id': 'map', 'position': {'x': 6, 'y': 0, 'w': 6, 'h': 4}},
                    {'id': 'comparisons', 'position': {'x': 0, 'y': 4, 'w': 12, 'h': 3}},
                    {'id': 'favorites', 'position': {'x': 0, 'y': 7, 'w': 6, 'h': 3}},
                    {'id': 'search', 'position': {'x': 6, 'y': 7, 'w': 6, 'h': 3}}
                ],
                'columns': 12,
                'row_height': 50
            },
            'favorite_sectors': ['62', '63', '72'],  # TI, Telecom, Consultoria
            'favorite_states': ['SP', 'SC', 'RJ'],
            'favorite_cities': ['São Paulo', 'Florianópolis', 'Rio de Janeiro'],
            'default_filters': {'porte': ['DEMAIS'], 'situacao': 'ATIVA'},
            'theme': 'dark',
            'language': 'pt-BR',
            'notifications_enabled': True,
            'insights_frequency': 'daily'
        },
        {
            'user_id': '550e8400-e29b-41d4-a716-446655440002',  # premium
            'dashboard_layout': {
                'widgets': [
                    {'id': 'insights', 'position': {'x': 0, 'y': 0, 'w': 8, 'h': 5}},
                    {'id': 'favorites', 'position': {'x': 8, 'y': 0, 'w': 4, 'h': 5}},
                    {'id': 'map', 'position': {'x': 0, 'y': 5, 'w': 12, 'h': 4}}
                ],
                'columns': 12,
                'row_height': 60
            },
            'favorite_sectors': ['62', '85', '86'],  # TI, Educação, Saúde
            'favorite_states': ['SP', 'MG', 'PR'],
            'favorite_cities': ['São Paulo', 'Belo Horizonte', 'Curitiba'],
            'default_filters': {'porte': ['EPP', 'DEMAIS']},
            'theme': 'light',
            'language': 'pt-BR',
            'notifications_enabled': True,
            'insights_frequency': 'weekly'
        },
        {
            'user_id': '550e8400-e29b-41d4-a716-446655440003',  # basico
            'dashboard_layout': {
                'widgets': [
                    {'id': 'insights', 'position': {'x': 0, 'y': 0, 'w': 12, 'h': 4}},
                    {'id': 'search', 'position': {'x': 0, 'y': 4, 'w': 12, 'h': 3}}
                ],
                'columns': 12,
                'row_height': 50
            },
            'favorite_sectors': ['47'],  # Comércio varejista
            'favorite_states': ['SP', 'RJ'],
            'favorite_cities': [],
            'default_filters': {'porte': ['ME', 'EPP']},
            'theme': 'light',
            'language': 'pt-BR',
            'notifications_enabled': False,
            'insights_frequency': 'monthly'
        },
        {
            'user_id': '550e8400-e29b-41d4-a716-446655440004',  # free
            'dashboard_layout': {
                'widgets': [
                    {'id': 'insights', 'position': {'x': 0, 'y': 0, 'w': 12, 'h': 5}}
                ],
                'columns': 12,
                'row_height': 50
            },
            'favorite_sectors': [],
            'favorite_states': ['SP'],
            'favorite_cities': [],
            'default_filters': {},
            'theme': 'light',
            'language': 'pt-BR',
            'notifications_enabled': False,
            'insights_frequency': 'monthly'
        },
        {
            'user_id': '550e8400-e29b-41d4-a716-446655440005',  # analista
            'dashboard_layout': {
                'widgets': [
                    {'id': 'comparisons', 'position': {'x': 0, 'y': 0, 'w': 12, 'h': 4}},
                    {'id': 'insights', 'position': {'x': 0, 'y': 4, 'w': 6, 'h': 4}},
                    {'id': 'map', 'position': {'x': 6, 'y': 4, 'w': 6, 'h': 4}}
                ],
                'columns': 12,
                'row_height': 55
            },
            'favorite_sectors': ['64', '65', '66'],  # Financeiro, Seguros, Investimentos
            'favorite_states': ['SP', 'RJ', 'DF'],
            'favorite_cities': ['São Paulo', 'Rio de Janeiro', 'Brasília'],
            'default_filters': {'porte': ['DEMAIS'], 'natureza_juridica': ['2062']},
            'theme': 'dark',
            'language': 'pt-BR',
            'notifications_enabled': True,
            'insights_frequency': 'daily'
        }
    ]
    
    with engine.connect() as conn:
        # Clear existing preferences for demo users
        conn.execute(text("""
            DELETE FROM user_preferences 
            WHERE user_id IN (
                SELECT id FROM users WHERE metadata->>'demo' = 'true'
            )
        """))
        conn.commit()
        
        # Insert preferences
        for pref in preferences:
            conn.execute(text("""
                INSERT INTO user_preferences (
                    user_id, dashboard_layout, favorite_sectors, favorite_states,
                    favorite_cities, default_filters, theme, language,
                    notifications_enabled, insights_frequency, created_at, updated_at
                ) VALUES (
                    CAST(:user_id AS UUID),
                    CAST(:dashboard_layout AS jsonb),
                    :favorite_sectors,
                    :favorite_states,
                    :favorite_cities,
                    CAST(:default_filters AS jsonb),
                    :theme,
                    :language,
                    :notifications_enabled,
                    :insights_frequency,
                    :created_at,
                    :updated_at
                )
            """), {
                'user_id': pref['user_id'],
                'dashboard_layout': json.dumps(pref['dashboard_layout']),
                'favorite_sectors': pref['favorite_sectors'],
                'favorite_states': pref['favorite_states'],
                'favorite_cities': pref['favorite_cities'],
                'default_filters': json.dumps(pref['default_filters']),
                'theme': pref['theme'],
                'language': pref['language'],
                'notifications_enabled': pref['notifications_enabled'],
                'insights_frequency': pref['insights_frequency'],
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            })
        
        conn.commit()
        print(f"✅ {len(preferences)} preferências criadas com sucesso!")
        
        # Show created preferences
        result = conn.execute(text("""
            SELECT u.email, p.theme, array_length(p.favorite_sectors, 1) as sectors_count,
                   array_length(p.favorite_states, 1) as states_count, p.insights_frequency
            FROM user_preferences p
            JOIN users u ON p.user_id = u.id
            WHERE u.metadata->>'demo' = 'true'
            ORDER BY u.role DESC, u.plano DESC
        """))
        
        print("\nPreferências criadas:")
        for row in result:
            print(f"  • {row.email:30} | Theme: {row.theme:5} | Setores: {row.sectors_count or 0} | Estados: {row.states_count or 0} | Freq: {row.insights_frequency}")

if __name__ == "__main__":
    seed_preferences()
