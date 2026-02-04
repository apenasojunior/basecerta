#!/usr/bin/env python3
"""
Script para análise completa da estrutura do banco CNPJ
Gera documentação detalhada comparando banco real vs models
"""
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import json

# Configuração
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'basecerta',
    'user': 'aian_db',
    'password': 'P@lm315@s'
}

def get_connection():
    """Cria conexão com o banco"""
    return psycopg2.connect(**DB_CONFIG)

def get_tables(conn):
    """Lista todas as tabelas do schema cnpj"""
    query = """
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'cnpj' 
        ORDER BY table_name;
    """
    with conn.cursor() as cur:
        cur.execute(query)
        return [row[0] for row in cur.fetchall()]

def get_table_structure(conn, table_name):
    """Obtém estrutura completa de uma tabela"""
    query = """
        SELECT 
            c.column_name,
            c.data_type,
            c.character_maximum_length,
            c.numeric_precision,
            c.numeric_scale,
            c.is_nullable,
            c.column_default,
            pgd.description as column_comment
        FROM information_schema.columns c
        LEFT JOIN pg_catalog.pg_description pgd 
            ON pgd.objoid = (
                SELECT oid FROM pg_class 
                WHERE relname = c.table_name 
                AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = c.table_schema)
            )
            AND pgd.objsubid = c.ordinal_position
        WHERE c.table_schema = 'cnpj' 
        AND c.table_name = %s
        ORDER BY c.ordinal_position;
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(query, (table_name,))
        return cur.fetchall()

def get_primary_keys(conn, table_name):
    """Obtém chaves primárias"""
    query = """
        SELECT a.attname
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = ('cnpj.' || %s)::regclass
        AND i.indisprimary
        ORDER BY a.attnum;
    """
    with conn.cursor() as cur:
        cur.execute(query, (table_name,))
        return [row[0] for row in cur.fetchall()]

def get_foreign_keys(conn, table_name):
    """Obtém foreign keys"""
    query = """
        SELECT
            kcu.column_name,
            ccu.table_schema AS foreign_table_schema,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name,
            tc.constraint_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'cnpj'
        AND tc.table_name = %s;
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(query, (table_name,))
        return cur.fetchall()

def get_indexes(conn, table_name):
    """Obtém índices da tabela"""
    query = """
        SELECT
            i.relname as index_name,
            array_agg(a.attname ORDER BY a.attnum) as column_names,
            ix.indisunique as is_unique,
            ix.indisprimary as is_primary
        FROM pg_class t
        JOIN pg_index ix ON t.oid = ix.indrelid
        JOIN pg_class i ON i.oid = ix.indexrelid
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
        WHERE t.relname = %s
        AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'cnpj')
        GROUP BY i.relname, ix.indisunique, ix.indisprimary
        ORDER BY i.relname;
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(query, (table_name,))
        return cur.fetchall()

def get_table_stats(conn, table_name):
    """Obtém estatísticas da tabela"""
    query = f"""
        SELECT 
            COUNT(*) as row_count,
            pg_size_pretty(pg_total_relation_size('cnpj.{table_name}')) as total_size
        FROM cnpj.{table_name};
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(query)
        return cur.fetchone()

def analyze_database():
    """Análise completa do banco de dados"""
    print("🔍 Conectando ao banco de dados...")
    
    try:
        conn = get_connection()
        print("✅ Conectado com sucesso!")
        
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'database': 'basecerta',
            'schema': 'cnpj',
            'tables': {}
        }
        
        tables = get_tables(conn)
        print(f"\n📊 Encontradas {len(tables)} tabelas no schema cnpj\n")
        
        for table in tables:
            print(f"📋 Analisando tabela: {table}")
            
            analysis['tables'][table] = {
                'columns': get_table_structure(conn, table),
                'primary_keys': get_primary_keys(conn, table),
                'foreign_keys': get_foreign_keys(conn, table),
                'indexes': get_indexes(conn, table),
                'stats': get_table_stats(conn, table)
            }
        
        conn.close()
        return analysis
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None

def generate_markdown_report(analysis):
    """Gera relatório em markdown"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    md = f"""# 🔍 Deep Dive - Análise do Banco CNPJ
    
**Data da Análise:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}  
**Database:** {analysis['database']}  
**Schema:** {analysis['schema']}  
**Total de Tabelas:** {len(analysis['tables'])}

---

## 📊 Resumo Executivo

"""
    
    # Estatísticas gerais
    total_rows = 0
    for table_name, data in analysis['tables'].items():
        stats = data['stats']
        if stats and 'row_count' in stats:
            total_rows += stats['row_count']
    
    md += f"**Total de Registros:** {total_rows:,}\n\n"
    md += "### Volumetria por Tabela\n\n"
    md += "| Tabela | Registros | Tamanho | PKs | FKs | Índices |\n"
    md += "|--------|-----------|---------|-----|-----|----------|\n"
    
    for table_name, data in sorted(analysis['tables'].items()):
        stats = data['stats']
        row_count = stats['row_count'] if stats else 0
        total_size = stats['total_size'] if stats else 'N/A'
        pk_count = len(data['primary_keys'])
        fk_count = len(data['foreign_keys'])
        idx_count = len(data['indexes'])
        
        md += f"| {table_name} | {row_count:,} | {total_size} | {pk_count} | {fk_count} | {idx_count} |\n"
    
    md += "\n---\n\n"
    
    # Detalhamento por tabela
    md += "## 📋 Detalhamento das Tabelas\n\n"
    
    for table_name, data in sorted(analysis['tables'].items()):
        md += f"### 🗂️ Tabela: `{table_name}`\n\n"
        
        # Stats
        stats = data['stats']
        if stats:
            md += f"**Registros:** {stats['row_count']:,}  \n"
            md += f"**Tamanho:** {stats['total_size']}\n\n"
        
        # Primary Keys
        if data['primary_keys']:
            md += f"**Primary Key:** `{', '.join(data['primary_keys'])}`\n\n"
        
        # Columns
        md += "#### Colunas\n\n"
        md += "| Coluna | Tipo | Nullable | Default | Comentário |\n"
        md += "|--------|------|----------|---------|------------|\n"
        
        for col in data['columns']:
            col_type = col['data_type']
            if col['character_maximum_length']:
                col_type += f"({col['character_maximum_length']})"
            elif col['numeric_precision']:
                col_type += f"({col['numeric_precision']}"
                if col['numeric_scale']:
                    col_type += f",{col['numeric_scale']}"
                col_type += ")"
            
            nullable = "✓" if col['is_nullable'] == 'YES' else "✗"
            default = col['column_default'] or '-'
            comment = col['column_comment'] or '-'
            
            md += f"| {col['column_name']} | {col_type} | {nullable} | {default} | {comment} |\n"
        
        md += "\n"
        
        # Foreign Keys
        if data['foreign_keys']:
            md += "#### Foreign Keys\n\n"
            for fk in data['foreign_keys']:
                md += f"- `{fk['column_name']}` → `{fk['foreign_table_schema']}.{fk['foreign_table_name']}.{fk['foreign_column_name']}`\n"
            md += "\n"
        
        # Indexes
        if data['indexes']:
            md += "#### Índices\n\n"
            md += "| Nome | Colunas | Único | Primária |\n"
            md += "|------|---------|-------|----------|\n"
            for idx in data['indexes']:
                is_unique = "✓" if idx['is_unique'] else "✗"
                is_primary = "✓" if idx['is_primary'] else "✗"
                columns = ', '.join(idx['column_names'])
                md += f"| {idx['index_name']} | {columns} | {is_unique} | {is_primary} |\n"
            md += "\n"
        
        md += "---\n\n"
    
    # Comparação com Models
    md += "## 🔄 Comparação: Banco vs Models Python\n\n"
    md += "### ⚠️ Divergências Encontradas\n\n"
    md += "**A ser preenchido manualmente após comparação**\n\n"
    
    md += "### ✅ Recomendações\n\n"
    md += "1. Ajustar models para refletir estrutura exata do banco\n"
    md += "2. Adicionar índices compostos onde necessário\n"
    md += "3. Validar tipos de dados (varchar lengths)\n"
    md += "4. Confirmar FKs e relationships\n\n"
    
    return md

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Iniciando Análise Profunda do Banco CNPJ")
    print("=" * 60)
    
    analysis = analyze_database()
    
    if analysis:
        print("\n📝 Gerando relatório markdown...")
        report = generate_markdown_report(analysis)
        
        # Salvar relatório
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"docs/estrutura/db/deepdive_cnpj_{timestamp}.md"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"\n✅ Relatório salvo em: {filename}")
        
        # Salvar JSON para análise programática
        json_filename = f"docs/estrutura/db/deepdive_cnpj_{timestamp}.json"
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, default=str)
        
        print(f"✅ Dados JSON salvos em: {json_filename}")
        print("\n" + "=" * 60)
        print("🎉 Análise concluída com sucesso!")
        print("=" * 60)
    else:
        print("\n❌ Análise falhou. Verifique as credenciais do banco.")
