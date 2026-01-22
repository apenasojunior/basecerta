#!/usr/bin/env python3
"""
Sistema de Checkpoints para Importação CNPJ
Salva progresso a cada arquivo processado
"""

import psycopg2
from pathlib import Path
from datetime import datetime
import json

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'basecerta',
    'user': 'code4us',
}

def criar_tabela_checkpoint():
    """Cria tabela de controle de checkpoints se não existir"""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cnpj_brasil.import_checkpoints (
            id SERIAL PRIMARY KEY,
            versao VARCHAR(10) NOT NULL,
            tabela VARCHAR(50) NOT NULL,
            arquivo VARCHAR(100) NOT NULL,
            status VARCHAR(20) NOT NULL, -- 'processing', 'completed', 'failed'
            registros_processados INTEGER,
            data_inicio TIMESTAMP,
            data_fim TIMESTAMP,
            erro TEXT,
            UNIQUE(versao, tabela, arquivo)
        );
    """)
    
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_checkpoints_versao 
        ON cnpj_brasil.import_checkpoints(versao, tabela, status);
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
    print("✅ Tabela de checkpoints criada/verificada")

def iniciar_checkpoint(versao: str, tabela: str, arquivo: str):
    """Marca início do processamento de um arquivo"""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO cnpj_brasil.import_checkpoints 
        (versao, tabela, arquivo, status, data_inicio)
        VALUES (%s, %s, %s, 'processing', NOW())
        ON CONFLICT (versao, tabela, arquivo) 
        DO UPDATE SET 
            status = 'processing',
            data_inicio = NOW(),
            data_fim = NULL,
            erro = NULL
    """, (versao, tabela, arquivo))
    
    conn.commit()
    cursor.close()
    conn.close()

def finalizar_checkpoint(versao: str, tabela: str, arquivo: str, registros: int):
    """Marca conclusão do processamento de um arquivo"""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE cnpj_brasil.import_checkpoints 
        SET status = 'completed',
            registros_processados = %s,
            data_fim = NOW()
        WHERE versao = %s AND tabela = %s AND arquivo = %s
    """, (registros, versao, tabela, arquivo))
    
    conn.commit()
    cursor.close()
    conn.close()

def erro_checkpoint(versao: str, tabela: str, arquivo: str, erro: str):
    """Marca erro no processamento de um arquivo"""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE cnpj_brasil.import_checkpoints 
        SET status = 'failed',
            erro = %s,
            data_fim = NOW()
        WHERE versao = %s AND tabela = %s AND arquivo = %s
    """, (erro, versao, tabela, arquivo))
    
    conn.commit()
    cursor.close()
    conn.close()

def listar_arquivos_pendentes(versao: str, tabela: str, todos_arquivos: list):
    """Retorna lista de arquivos que ainda precisam ser processados"""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT arquivo 
        FROM cnpj_brasil.import_checkpoints 
        WHERE versao = %s AND tabela = %s AND status = 'completed'
    """, (versao, tabela))
    
    completados = {row[0] for row in cursor.fetchall()}
    cursor.close()
    conn.close()
    
    # Retornar apenas os que NÃO estão completados
    pendentes = [arq for arq in todos_arquivos if Path(arq).name not in completados]
    
    return pendentes

def mostrar_progresso(versao: str):
    """Mostra progresso da importação"""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            tabela,
            COUNT(*) FILTER (WHERE status = 'completed') as completados,
            COUNT(*) FILTER (WHERE status = 'processing') as processando,
            COUNT(*) FILTER (WHERE status = 'failed') as falhados,
            COUNT(*) as total,
            SUM(registros_processados) as total_registros
        FROM cnpj_brasil.import_checkpoints 
        WHERE versao = %s
        GROUP BY tabela
        ORDER BY tabela
    """, (versao,))
    
    print(f"\n📊 Progresso da Importação {versao}:")
    print("─" * 80)
    print(f"{'Tabela':<20} {'Completados':<12} {'Processando':<12} {'Falhas':<8} {'Total':<8} {'Registros':<15}")
    print("─" * 80)
    
    for row in cursor.fetchall():
        tabela, completados, processando, falhados, total, registros = row
        registros_str = f"{registros:,}" if registros else "0"
        print(f"{tabela:<20} {completados:<12} {processando:<12} {falhados:<8} {total:<8} {registros_str:<15}")
    
    print("─" * 80)
    
    cursor.close()
    conn.close()

def limpar_checkpoints(versao: str):
    """Remove checkpoints de uma versão específica"""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    cursor.execute("""
        DELETE FROM cnpj_brasil.import_checkpoints 
        WHERE versao = %s
    """, (versao,))
    
    deleted = cursor.rowcount
    conn.commit()
    cursor.close()
    conn.close()
    
    print(f"✅ {deleted} checkpoints removidos da versão {versao}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Uso:")
        print("  python3 manage_checkpoints.py create        # Criar tabela")
        print("  python3 manage_checkpoints.py status 2025-12 # Ver progresso")
        print("  python3 manage_checkpoints.py clear 2025-12  # Limpar checkpoints")
        sys.exit(1)
    
    comando = sys.argv[1]
    
    if comando == "create":
        criar_tabela_checkpoint()
    elif comando == "status":
        versao = sys.argv[2] if len(sys.argv) > 2 else "2025-12"
        mostrar_progresso(versao)
    elif comando == "clear":
        versao = sys.argv[2] if len(sys.argv) > 2 else "2025-12"
        resposta = input(f"Tem certeza que deseja limpar checkpoints de {versao}? (s/N): ")
        if resposta.lower() == 's':
            limpar_checkpoints(versao)
    else:
        print(f"Comando desconhecido: {comando}")
        sys.exit(1)
