#!/usr/bin/env python3
"""
Gerenciamento de Foreign Keys - CNPJ Brasil
Remove FKs antes da importação e recria depois
"""

import psycopg2
import sys

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'basecerta',
    'user': 'code4us',
    'password': ''
}

FOREIGN_KEYS = [
    # Empresas
    ("cnpj_brasil.empresas", "fk_natureza_juridica", 
     "FOREIGN KEY (natureza_juridica) REFERENCES naturezas_juridicas(codigo)"),
    ("cnpj_brasil.empresas", "fk_qualificacao_resp", 
     "FOREIGN KEY (qualificacao_responsavel) REFERENCES qualificacoes_socios(codigo)"),
    
    # Estabelecimentos
    ("cnpj_brasil.estabelecimentos", "fk_estabelec_cnae", 
     "FOREIGN KEY (cnae_fiscal_principal) REFERENCES cnaes(codigo)"),
    ("cnpj_brasil.estabelecimentos", "fk_estabelec_empresa", 
     "FOREIGN KEY (cnpj_basico) REFERENCES cnpj_brasil.empresas(cnpj_basico)"),
    ("cnpj_brasil.estabelecimentos", "fk_estabelec_motivo", 
     "FOREIGN KEY (motivo_situacao_cadastral) REFERENCES motivos_situacao_cadastral(codigo)"),
    ("cnpj_brasil.estabelecimentos", "fk_estabelec_municipio", 
     "FOREIGN KEY (municipio) REFERENCES municipios(codigo)"),
    ("cnpj_brasil.estabelecimentos", "fk_estabelec_pais", 
     "FOREIGN KEY (pais) REFERENCES paises(codigo)"),
    
    # Simples Nacional
    ("cnpj_brasil.simples_nacional", "fk_simples_empresa", 
     "FOREIGN KEY (cnpj_basico) REFERENCES cnpj_brasil.empresas(cnpj_basico)"),
    
    # Sócios
    ("cnpj_brasil.socios", "fk_socio_empresa", 
     "FOREIGN KEY (cnpj_basico) REFERENCES cnpj_brasil.empresas(cnpj_basico)"),
    ("cnpj_brasil.socios", "fk_socio_pais", 
     "FOREIGN KEY (pais) REFERENCES paises(codigo)"),
    ("cnpj_brasil.socios", "fk_socio_qualif_repr", 
     "FOREIGN KEY (qualificacao_representante) REFERENCES qualificacoes_socios(codigo)"),
    ("cnpj_brasil.socios", "fk_socio_qualificacao", 
     "FOREIGN KEY (qualificacao_socio) REFERENCES qualificacoes_socios(codigo)"),
]

def drop_foreign_keys():
    """Remove todas as foreign keys"""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    print("🗑️  Removendo Foreign Keys...")
    for table, constraint_name, _ in FOREIGN_KEYS:
        try:
            cursor.execute(f"ALTER TABLE {table} DROP CONSTRAINT IF EXISTS {constraint_name}")
            print(f"  ✅ {table}.{constraint_name}")
        except Exception as e:
            print(f"  ⚠️  Erro ao remover {constraint_name}: {e}")
    
    conn.commit()
    cursor.close()
    conn.close()
    print("\n✅ Foreign Keys removidas com sucesso!")

def recreate_foreign_keys():
    """Recria todas as foreign keys"""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    print("🔧 Recriando Foreign Keys...")
    errors = []
    
    for table, constraint_name, definition in FOREIGN_KEYS:
        try:
            cursor.execute(f"ALTER TABLE {table} ADD CONSTRAINT {constraint_name} {definition}")
            conn.commit()
            print(f"  ✅ {table}.{constraint_name}")
        except Exception as e:
            errors.append((table, constraint_name, str(e)))
            print(f"  ❌ {table}.{constraint_name}: {e}")
            conn.rollback()
    
    cursor.close()
    conn.close()
    
    if errors:
        print(f"\n⚠️  {len(errors)} foreign key(s) com erro:")
        for table, constraint, error in errors:
            print(f"   • {table}.{constraint}: {error}")
        print("\nPossíveis causas:")
        print("   - Códigos inválidos nos dados (ex: qualificacao_responsavel=36)")
        print("   - CNPJs órfãos sem registro em empresas")
        print("\nSoluções:")
        print("   1. Verificar códigos inválidos e corrigir")
        print("   2. Manter sem FKs (índices continuam funcionando)")
    else:
        print("\n✅ Todas as Foreign Keys recriadas com sucesso!")

def check_invalid_references():
    """Verifica referências inválidas que impediriam criação de FKs"""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    print("🔍 Verificando referências inválidas...\n")
    
    # Verificar qualificacao_responsavel
    cursor.execute("""
        SELECT DISTINCT e.qualificacao_responsavel, COUNT(*) as total
        FROM cnpj_brasil.empresas e
        LEFT JOIN qualificacoes_socios q ON e.qualificacao_responsavel = q.codigo
        WHERE q.codigo IS NULL AND e.qualificacao_responsavel IS NOT NULL
        GROUP BY e.qualificacao_responsavel
        ORDER BY total DESC
        LIMIT 10
    """)
    
    invalid_qual = cursor.fetchall()
    if invalid_qual:
        print("❌ Qualificações de responsável inválidas:")
        for codigo, total in invalid_qual:
            print(f"   Código {codigo}: {total:,} empresas")
    
    # Verificar natureza_juridica
    cursor.execute("""
        SELECT DISTINCT e.natureza_juridica, COUNT(*) as total
        FROM cnpj_brasil.empresas e
        LEFT JOIN naturezas_juridicas n ON e.natureza_juridica = n.codigo
        WHERE n.codigo IS NULL AND e.natureza_juridica IS NOT NULL
        GROUP BY e.natureza_juridica
        ORDER BY total DESC
        LIMIT 10
    """)
    
    invalid_nat = cursor.fetchall()
    if invalid_nat:
        print("\n❌ Naturezas jurídicas inválidas:")
        for codigo, total in invalid_nat:
            print(f"   Código {codigo}: {total:,} empresas")
    
    cursor.close()
    conn.close()

def main():
    if len(sys.argv) < 2:
        print("Uso:")
        print("  python3 manage_foreign_keys.py drop     # Remove FKs antes da importação")
        print("  python3 manage_foreign_keys.py create   # Recria FKs após importação")
        print("  python3 manage_foreign_keys.py check    # Verifica referências inválidas")
        sys.exit(1)
    
    action = sys.argv[1].lower()
    
    if action == 'drop':
        drop_foreign_keys()
    elif action == 'create':
        recreate_foreign_keys()
    elif action == 'check':
        check_invalid_references()
    else:
        print(f"Ação inválida: {action}")
        print("Use: drop, create ou check")
        sys.exit(1)

if __name__ == '__main__':
    main()
