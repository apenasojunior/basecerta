#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Análise de Qualidade de Dados - Campo por Campo
Baseado nos dados já processados em analise_completa.txt
"""

import zipfile
import csv
import re
from collections import defaultdict, Counter
from pathlib import Path

BASE_DIR = Path("/Volumes/ExtMB/BaseCNPJ/dez2025")

# Estrutura de campos por tipo
ESTRUTURAS = {
    'Cnaes': ['codigo', 'descricao'],
    'Municipios': ['codigo', 'descricao'],
    'Naturezas': ['codigo', 'descricao'],
    'Paises': ['codigo', 'descricao'],
    'Qualificacoes': ['codigo', 'descricao'],
    'Motivos': ['codigo', 'descricao'],
    'Empresas': ['cnpj_basico', 'razao_social', 'natureza_juridica', 'qualificacao_responsavel', 
                 'capital_social', 'porte', 'ente_federativo'],
    'Estabelecimentos': ['cnpj_basico', 'cnpj_ordem', 'cnpj_dv', 'identificador_matriz_filial',
                        'nome_fantasia', 'situacao_cadastral', 'data_situacao_cadastral', 'motivo_situacao_cadastral',
                        'nome_cidade_exterior', 'pais', 'data_inicio_atividade', 'cnae_fiscal_principal',
                        'cnae_fiscal_secundaria', 'tipo_logradouro', 'logradouro', 'numero', 'complemento',
                        'bairro', 'cep', 'uf', 'municipio', 'ddd1', 'telefone1', 'ddd2', 'telefone2',
                        'ddd_fax', 'fax', 'email', 'situacao_especial', 'data_situacao_especial'],
    'Simples': ['cnpj_basico', 'opcao_simples', 'data_opcao_simples', 'data_exclusao_simples',
                'opcao_mei', 'data_opcao_mei', 'data_exclusao_mei'],
    'Socios': ['cnpj_basico', 'identificador_socio', 'nome_socio', 'cpf_cnpj_socio', 'qualificacao_socio',
               'data_entrada_sociedade', 'pais', 'representante_legal', 'nome_representante',
               'qualificacao_representante', 'faixa_etaria']
}

def detectar_tipo(filename):
    """Detecta tipo de arquivo pelo nome"""
    nome = filename.upper()
    if 'CNAE' in nome:
        return 'Cnaes'
    elif 'MOTI' in nome:
        return 'Motivos'
    elif 'MUNIC' in nome:
        return 'Municipios'
    elif 'NATJU' in nome or 'NATUREZAS' in nome:
        return 'Naturezas'
    elif 'PAIS' in nome:
        return 'Paises'
    elif 'QUALS' in nome or 'QUALIFICACOES' in nome:
        return 'Qualificacoes'
    elif 'EMPRE' in nome:
        return 'Empresas'
    elif 'SIMPLES' in nome:
        return 'Simples'
    elif 'ESTABELE' in nome:
        return 'Estabelecimentos'
    elif 'SOCIO' in nome:
        return 'Socios'
    return None

def tem_caracteres_especiais(texto):
    """Verifica se há caracteres especiais/acentuados"""
    if not texto:
        return False
    return bool(re.search(r'[àáâãäèéêëìíîïòóôõöùúûüçñÀÁÂÃÄÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÇÑ]', texto))

def analisar_arquivo_sample(zip_path, max_sample=100000):
    """Analisa uma amostra do arquivo para qualidade de dados"""
    
    tipo = detectar_tipo(zip_path.name)
    if not tipo:
        return None
    
    if tipo not in ESTRUTURAS:
        print(f"⚠️  {zip_path.name}: Tipo {tipo} sem estrutura definida")
        return None
    
    campos = ESTRUTURAS[tipo]
    num_campos = len(campos)
    
    print(f"\n{'='*80}")
    print(f"📊 ANALISANDO: {zip_path.name}")
    print(f"   Tipo: {tipo} | Campos: {num_campos}")
    print(f"{'='*80}")
    
    stats = {
        'tipo': tipo,
        'total_linhas': 0,
        'linhas_validas': 0,
        'linhas_invalidas': 0,
        'campos_vazios': defaultdict(int),
        'campos_com_acento': defaultdict(int),
        'caracteres_especiais': Counter(),
        'exemplos_acentos': [],
        'linhas_problema': []
    }
    
    try:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            csv_filename = zf.namelist()[0]
            
            with zf.open(csv_filename) as file:
                linha_num = 0
                
                for raw_line in file:
                    linha_num += 1
                    stats['total_linhas'] += 1
                    
                    # Limite de amostra
                    if linha_num > max_sample:
                        print(f"   ⚠️  Limitado a {max_sample:,} linhas (amostra)")
                        break
                    
                    try:
                        # Decodificar
                        line = raw_line.decode('latin1', errors='replace').strip()
                        
                        if not line:
                            continue
                        
                        # Remover aspas do CSV se existir
                        line = line.replace('"', '')
                        
                        # Parsear
                        row = line.split(';')
                        
                        # Validar número de campos
                        if len(row) != num_campos:
                            stats['linhas_invalidas'] += 1
                            if len(stats['linhas_problema']) < 5:
                                stats['linhas_problema'].append({
                                    'linha': linha_num,
                                    'esperado': num_campos,
                                    'encontrado': len(row),
                                    'amostra': ';'.join(row[:3])
                                })
                            continue
                        
                        stats['linhas_validas'] += 1
                        
                        # Analisar cada campo
                        for i, (campo_nome, valor) in enumerate(zip(campos, row)):
                            
                            # Vazio
                            if not valor or valor.strip() == '':
                                stats['campos_vazios'][campo_nome] += 1
                            
                            # Acentos
                            if tem_caracteres_especiais(valor):
                                stats['campos_com_acento'][campo_nome] += 1
                                
                                # Coletar caracteres
                                for char in valor:
                                    if re.match(r'[àáâãäèéêëìíîïòóôõöùúûüçñÀÁÂÃÄÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÇÑ]', char):
                                        stats['caracteres_especiais'][char] += 1
                                
                                # Guardar exemplo
                                if len(stats['exemplos_acentos']) < 5:
                                    stats['exemplos_acentos'].append({
                                        'linha': linha_num,
                                        'campo': campo_nome,
                                        'valor': valor[:80]
                                    })
                        
                        # Progress
                        if linha_num % 500000 == 0:
                            print(f"   ➜ {linha_num:,} linhas processadas...")
                    
                    except Exception as e:
                        stats['linhas_invalidas'] += 1
                        if len(stats['linhas_problema']) < 5:
                            stats['linhas_problema'].append({
                                'linha': linha_num,
                                'erro': str(e)[:80]
                            })
    
    except Exception as e:
        print(f"   ❌ ERRO: {e}")
        return None
    
    # Imprimir relatório
    print(f"\n📈 ESTATÍSTICAS:")
    print(f"   Total processado: {stats['total_linhas']:,}")
    print(f"   ✅ Válidas: {stats['linhas_validas']:,} ({stats['linhas_validas']/stats['total_linhas']*100:.2f}%)")
    print(f"   ❌ Inválidas: {stats['linhas_invalidas']:,}")
    
    if stats['campos_vazios']:
        print(f"\n📝 TOP 10 CAMPOS VAZIOS:")
        for campo, count in sorted(stats['campos_vazios'].items(), key=lambda x: x[1], reverse=True)[:10]:
            pct = (count / stats['linhas_validas'] * 100) if stats['linhas_validas'] > 0 else 0
            print(f"   • {campo:30s}: {count:>10,} ({pct:>5.1f}%)")
    
    if stats['campos_com_acento']:
        print(f"\n🔤 TOP 10 CAMPOS COM ACENTOS:")
        for campo, count in sorted(stats['campos_com_acento'].items(), key=lambda x: x[1], reverse=True)[:10]:
            pct = (count / stats['linhas_validas'] * 100) if stats['linhas_validas'] > 0 else 0
            print(f"   • {campo:30s}: {count:>10,} ({pct:>5.1f}%)")
    
    if stats['caracteres_especiais']:
        print(f"\n🔠 TOP 15 CARACTERES ESPECIAIS:")
        for char, count in stats['caracteres_especiais'].most_common(15):
            print(f"   • '{char}': {count:,}")
    
    if stats['exemplos_acentos']:
        print(f"\n💡 EXEMPLOS DE REGISTROS COM ACENTOS:")
        for ex in stats['exemplos_acentos']:
            print(f"   Linha {ex['linha']:>7,}: [{ex['campo']}] = '{ex['valor']}'")
    
    if stats['linhas_problema']:
        print(f"\n⚠️  EXEMPLOS DE LINHAS COM PROBLEMAS:")
        for prob in stats['linhas_problema']:
            if 'erro' in prob:
                print(f"   Linha {prob['linha']:>7,}: {prob['erro']}")
            else:
                print(f"   Linha {prob['linha']:>7,}: Esperado {prob['esperado']} campos, encontrado {prob['encontrado']}")
    
    print(f"\n{'='*80}\n")
    
    return stats

def main():
    """Executa análise de qualidade em todos os arquivos"""
    
    print("""
╔════════════════════════════════════════════════════════════════════════════╗
║       ANÁLISE DE QUALIDADE DE DADOS - RECEITA FEDERAL                     ║
║              Campo por Campo - Amostra de 100k linhas                     ║
╚════════════════════════════════════════════════════════════════════════════╝
""")
    
    zip_files = sorted(BASE_DIR.glob("*.zip"))
    
    if not zip_files:
        print("❌ Nenhum arquivo encontrado!")
        return
    
    print(f"📦 Total de arquivos: {len(zip_files)}\n")
    
    resultados = {}
    
    for zip_file in zip_files:
        resultado = analisar_arquivo_sample(zip_file)
        if resultado:
            resultados[zip_file.name] = resultado
    
    # Resumo consolidado
    print(f"\n{'='*80}")
    print(f"RESUMO CONSOLIDADO")
    print(f"{'='*80}\n")
    
    for nome, stats in sorted(resultados.items()):
        pct_vazios = 0
        pct_acentos = 0
        
        if stats['campos_vazios']:
            top_vazio = max(stats['campos_vazios'].items(), key=lambda x: x[1])
            pct_vazios = (top_vazio[1] / stats['linhas_validas'] * 100) if stats['linhas_validas'] > 0 else 0
        
        if stats['campos_com_acento']:
            top_acento = max(stats['campos_com_acento'].items(), key=lambda x: x[1])
            pct_acentos = (top_acento[1] / stats['linhas_validas'] * 100) if stats['linhas_validas'] > 0 else 0
        
        print(f"📁 {nome:35s} | Tipo: {stats['tipo']:18s} | "
              f"Válidas: {stats['linhas_validas']:>8,} | "
              f"Vazio: {pct_vazios:>4.1f}% | Acento: {pct_acentos:>4.1f}%")
    
    print(f"\n{'='*80}\n")

if __name__ == "__main__":
    main()
