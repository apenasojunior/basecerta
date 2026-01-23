#!/usr/bin/env python3
"""
Script para analisar arquivos da Receita Federal
Extrai informações de PDFs e analisa CSVs compactados
"""

import os
import zipfile
import csv
from pathlib import Path

# Caminhos
BASE_DIR = Path("/Users/code4us/Documents/ADACODE/basecerta")
DOCS_CNPJ_DIR = Path("/Volumes/ExtMB/BaseCNPJ/dez2025")
METADATA_DIR = BASE_DIR / "docs" / "estrutura" / "receitafederal"

print("="*80)
print("ANÁLISE DE ARQUIVOS DA RECEITA FEDERAL")
print("="*80)

# Etapa 2A: Listar arquivos ZIP
print("\n📁 LISTANDO ARQUIVOS ZIP EM docs/baseCNPJ/\n")

zip_files = sorted(DOCS_CNPJ_DIR.glob("*.zip"))
total_size_compressed = 0

print(f"{'Arquivo':<35} {'Tamanho Compactado':>20}")
print("-"*80)

for zip_file in zip_files:
    size_mb = zip_file.stat().st_size / (1024 * 1024)
    total_size_compressed += size_mb
    print(f"{zip_file.name:<35} {size_mb:>18.2f} MB")

print("-"*80)
print(f"{'TOTAL':<35} {total_size_compressed:>18.2f} MB")
print(f"\nTotal de arquivos ZIP encontrados: {len(zip_files)}")

# Etapa 2B e 2C: Analisar cada arquivo ZIP
print("\n" + "="*80)
print("ANÁLISE DETALHADA DE CADA ARQUIVO")
print("="*80)

for zip_file in zip_files:
    print(f"\n\n{'▼'*40}")
    print(f"ARQUIVO: {zip_file.name}")
    print(f"{'▼'*40}\n")
    
    try:
        with zipfile.ZipFile(zip_file, 'r') as zf:
            # Listar conteúdo do ZIP
            csv_files = [name for name in zf.namelist() if name.endswith('.csv') or not name.endswith('/')]
            
            if not csv_files:
                print("⚠️  Nenhum arquivo CSV encontrado no ZIP")
                continue
            
            for csv_filename in csv_files[:1]:  # Processar apenas o primeiro CSV de cada ZIP
                print(f"📄 CSV interno: {csv_filename}")
                
                # Tamanho descompactado
                file_info = zf.getinfo(csv_filename)
                size_uncompressed_mb = file_info.file_size / (1024 * 1024)
                print(f"   Tamanho descompactado: {size_uncompressed_mb:.2f} MB")
                
                # Ler CSV
                with zf.open(csv_filename) as csv_file:
                    # Detectar encoding
                    sample = csv_file.read(10000)
                    csv_file.seek(0)
                    
                    # Encoding da Receita Federal é latin1 (ISO-8859-1)
                    used_encoding = 'latin1'
                    try:
                        content = sample.decode(used_encoding)
                    except Exception as e:
                        print(f"   ⚠️  Erro ao decodificar: {e}")
                        continue
                    
                    print(f"   Encoding: {used_encoding}")
                    
                    # Detectar delimitador
                    first_line = content.split('\n')[0]
                    delimiter = ';' if ';' in first_line else ','
                    print(f"   Delimitador: '{delimiter}'")
                    
                    # Resetar e ler com encoding correto, removendo NUL bytes
                    csv_file.seek(0)
                    text_file = (line.decode(used_encoding, errors='replace').replace('\x00', '') for line in csv_file)
                    reader = csv.reader(text_file, delimiter=delimiter)
                    
                    # Contar linhas e pegar amostras
                    rows = []
                    total_lines = 0
                    
                    for i, row in enumerate(reader):
                        if i < 3:  # Pegar as 3 primeiras linhas (header + 2 registros)
                            rows.append(row)
                        total_lines += 1
                        
                        # Progress a cada 1 milhão de linhas
                        if total_lines % 1000000 == 0:
                            print(f"   Contando... {total_lines:,} linhas processadas")
                    
                    print(f"\n   ✅ TOTAL DE REGISTROS: {total_lines:,}")
                    
                    # Mostrar estrutura
                    if rows:
                        print(f"\n   📊 ESTRUTURA DE COLUNAS:")
                        print(f"   Total de colunas: {len(rows[0])}")
                        
                        print(f"\n   🔍 PRIMEIRAS LINHAS:")
                        for idx, row in enumerate(rows[:3]):
                            print(f"\n   Linha {idx}:")
                            for col_idx, value in enumerate(row):
                                # Mostrar apenas primeiros 50 caracteres
                                display_value = value[:50] + "..." if len(value) > 50 else value
                                print(f"      [{col_idx}] = '{display_value}'")
                    
                    print("\n" + "-"*80)
    
    except Exception as e:
        print(f"❌ Erro ao processar {zip_file.name}: {e}")
        import traceback
        traceback.print_exc()

print("\n" + "="*80)
print("ANÁLISE CONCLUÍDA")
print("="*80)
