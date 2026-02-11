"""
Seed de usuários demo para F04
Cria 5 usuários com diferentes perfis e permissões
"""
import sys
from pathlib import Path
from datetime import datetime
import json

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy import create_engine, text
from app.core.config import settings

def seed_users():
    """Create 5 demo users with different roles and plans"""
    
    engine = create_engine(settings.database_url)
    
    # Demo users data
    users = [
        {
            'id': '550e8400-e29b-41d4-a716-446655440001',
            'email': 'admin@basecerta.com.br',
            'password_hash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzWXhCkCLu',  # senha: admin123
            'nome': 'Administrador Sistema',
            'empresa': 'BaseCerta',
            'cargo': 'Administrador',
            'role': 'admin',
            'plano': 'premium',
            'is_active': True,
            'is_verified': True,
            'onboarding_completed': True,
            'metadata': {'department': 'TI', 'access_level': 'full', 'demo': True}
        },
        {
            'id': '550e8400-e29b-41d4-a716-446655440002',
            'email': 'premium@basecerta.com.br',
            'password_hash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzWXhCkCLu',  # senha: premium123
            'nome': 'Usuário Premium',
            'empresa': 'Consultoria XYZ',
            'cargo': 'Analista de Negócios',
            'role': 'premium',
            'plano': 'premium',
            'is_active': True,
            'is_verified': True,
            'onboarding_completed': True,
            'metadata': {'company': 'Consultoria XYZ', 'sector': 'Tecnologia', 'demo': True}
        },
        {
            'id': '550e8400-e29b-41d4-a716-446655440003',
            'email': 'basico@basecerta.com.br',
            'password_hash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzWXhCkCLu',  # senha: basico123
            'nome': 'Usuário Básico',
            'empresa': 'Empresa ABC',
            'cargo': 'Gerente',
            'role': 'user',
            'plano': 'basic',
            'is_active': True,
            'is_verified': True,
            'onboarding_completed': True,
            'metadata': {'company': 'Empresa ABC', 'sector': 'Varejo', 'demo': True}
        },
        {
            'id': '550e8400-e29b-41d4-a716-446655440004',
            'email': 'free@basecerta.com.br',
            'password_hash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzWXhCkCLu',  # senha: free123
            'nome': 'Usuário Free',
            'empresa': None,
            'cargo': None,
            'role': 'user',
            'plano': 'free',
            'is_active': True,
            'is_verified': False,
            'onboarding_completed': False,
            'metadata': {'demo': True, 'trial': False}
        },
        {
            'id': '550e8400-e29b-41d4-a716-446655440005',
            'email': 'analista@basecerta.com.br',
            'password_hash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzWXhCkCLu',  # senha: analista123
            'nome': 'Analista de Dados',
            'empresa': 'Financeira DEF',
            'cargo': 'Analista de Dados',
            'role': 'user',
            'plano': 'basic',
            'is_active': True,
            'is_verified': True,
            'onboarding_completed': True,
            'metadata': {'company': 'Financeira DEF', 'sector': 'Financeiro', 'demo': True}
        }
    ]
    
    with engine.connect() as conn:
        # Clear existing demo users
        conn.execute(text("""
            DELETE FROM users 
            WHERE metadata->>'demo' = 'true'
        """))
        conn.commit()
        
        # Insert users
        for user in users:
            conn.execute(text("""
                INSERT INTO users (
                    id, email, password_hash, nome, empresa, cargo, role, plano, 
                    is_active, is_verified, onboarding_completed, metadata, created_at, updated_at
                ) VALUES (
                    CAST(:id AS UUID), :email, :password_hash, :nome, :empresa, :cargo, :role, :plano,
                    :is_active, :is_verified, :onboarding_completed, CAST(:metadata AS jsonb), :created_at, :updated_at
                )
            """), {
                'id': user['id'],
                'email': user['email'],
                'password_hash': user['password_hash'],
                'nome': user['nome'],
                'empresa': user['empresa'],
                'cargo': user['cargo'],
                'role': user['role'],
                'plano': user['plano'],
                'is_active': user['is_active'],
                'is_verified': user['is_verified'],
                'onboarding_completed': user['onboarding_completed'],
                'metadata': json.dumps(user['metadata']),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            })
        
        conn.commit()
        print(f"✅ {len(users)} usuários demo criados com sucesso!")
        
        # Show created users
        result = conn.execute(text("""
            SELECT email, nome, role, plano 
            FROM users 
            WHERE metadata->>'demo' = 'true'
            ORDER BY role DESC, plano DESC
        """))
        
        print("\nUsuários criados:")
        for row in result:
            print(f"  • {row.email:30} | {row.nome:25} | {row.role:10} | {row.plano}")

if __name__ == "__main__":
    seed_users()
