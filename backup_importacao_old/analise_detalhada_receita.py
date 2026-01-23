#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Análise Detalhada dos Arquivos da Receita Federal
Mapeia problemas linha por linha e campo por campo
"""

import zipfile
import csv
import os
import re
from collections import defaultdict, Counter
from pathlib import Path

# Diretório dos arquivos
BASE_DIR = Path("/Volumes/ExtMB/BaseCNPJ/dez2025")

# Estrutura de campos por tipo de arquivo
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
                        'cnae_fiscal_secundario', 'tipo_logradouro', 'logradouro', 'numero', 'complemento',
                        'bairro', 'cep', 'uf', 'municipio', 'ddd1', 'telefone1', 'ddd2', 'telefone2',
                        'ddd_fax', 'fax', 'email', 'situacao_especial', 'data_situacao_especial'],
    'Simples': ['cnpj_basico', 'opcao_simples', 'data_opcao_simples', 'data_exclusao_simples',
                'opcao_mei', 'data_opcao_mei', 'data_exclusao_mei'],
    'Socios': ['cnpj_basico', 'identificador_socio', 'nome_socio', 'cpf_cnpj_socio', 'qualificacao_socio',
               'data_entrada_sociedade', 'pais', 'representante_legal', 'nome_representante',
               'qualificacao_representante', 'faixa_etaria']
}

def detectar_tipo_arquivo(filename):
    """Detecta o tipo de arquivo pelo nome"""
    nome = filename.upper()
    if 'CNAE' in nome:
        return 'Cnaes'
    elif 'MOTI' in nome:
        return 'Motivos'
    elif 'MUNIC' in nome:
        return 'Municipios'
    elif 'NATJU' in nome:
        return 'Naturezas'
    elif 'PAIS' in nome:
        return 'Paises'
    elif 'QUALS' in nome:
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

def tem_acentos(texto):
    """Verifica se tem acentos ou caracteres especiais"""
    if not texto:
        return False
    # Caracteres com acento latino
    pattern = r'[áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]'
    return bool(re.search(pattern, texto))

def analisar_arquivo_detalhado(zip_path):
    """Analisa um arquivo ZIP em detalhes"""
    
    print(f"\n{'='*80}")
    print(f"ANALISANDO: {zip_path.name}")
    print(f"{'='*80}")
    
    tipo = detectar_tipo_arquivo(zip_path.name)
    if not tipo:
        print(f"⚠️  Tipo desconhecido, pulando...")
        return None
    
    campos = ESTRUTURAS[tipo]
    num_campos = len(campos)
    
    # Estatísticas por campo
    stats = {
        'total_linhas': 0,
        'linhas_validas': 0,
        'linhas_com_erro': 0,
        'campos_vazios': defaultdict(int),
        'campos_com_acentos': defaultdict(int),
        'campos_nulos': defaultdict(int),
        'caracteres_especiais': Counter(),
        'exemplos_problemas': [],
        'linhas_problema': []
    }
    
    try:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            csv_filename = None
            # Pegar o primeiro arquivo (ignorando diretórios)
            for name in zf.namelist():
                if not name.endswith('/'):
                    csv_filename = name
                    break
            
            if not csv_filename:
                print("❌ Nenhum arquivo encontrado no ZIP")
                return None
            
            print(f"📄 Arquivo CSV: {csv_filename}")
            print(f"🔍 Tipo identificado: {tipo} ({num_campos} campos)")
            print(f"📋 Campos esperados: {', '.join(campos)}")
            print(f"\n🔄 Processando linhas...\n")
            
            with zf.open(csv_filename) as csv_file:
                # Tentar diferentes encodings
                for encoding in ['latin1', 'cp1252', 'iso-8859-1', 'utf-8']:
                    try:
                        csv_file.seek(0)
                        # Ler primeiras 100 linhas para teste
                        sample_lines = []
                        for i, raw_line in enumerate(csv_file):
                            if i >= 100:
                                break
                            try:
                                line = raw_line.decode(encoding, errors='replace')
                                sample_lines.append(line)
                            except:
                                continue
                        
                        if len(sample_lines) > 50:
                            print(f"✅ Encoding detectado: {encoding}")
                            used_encoding = encoding
                            break
                    except:
                        continue
                else:
                    used_encoding = 'latin1'
                    print(f"⚠️  Usando encoding padrão: {used_encoding}")
                
                # Processar arquivo completo
                csv_file.seek(0)
                
                linha_num = 0
                for raw_line in csv_file:
                    linha_num += 1
                    stats['total_linhas'] += 1
                    
                    try:
                        # Decodificar com tratamento de erros
                        line = raw_line.decode(used_encoding, errors='replace')
                        line = line.replace('\x00', '').strip()
                        
                        if not line:
                            continue
                        
                        # Parsear CSV
                        reader = csv.reader([line], delimiter=';')
                        row = next(reader)
                        
                        # Validar número de campos
                        if len(row) != num_campos:
                            stats['linhas_com_erro'] += 1
                            if len(stats['linhas_problema']) < 20:
                                stats['linhas_problema'].append({
                                    'linha': linha_num,
                                    'esperado': num_campos,
                                    'encontrado': len(row),
                                    'dados': row[:5]  # Primeiros 5 campos
                                })
                            continue
                        
                        stats['linhas_validas'] += 1
                        
                        # Analisar cada campo
                        for i, (campo_nome, valor) in enumerate(zip(campos, row)):
                            
                            # Campo vazio
                            if not valor or valor.strip() == '':
                                stats['campos_vazios'][campo_nome] += 1
                            
                            # Campo nulo explícito
                            if valor.upper() in ['NULL', 'NONE', 'N/A']:
                                stats['campos_nulos'][campo_nome] += 1
                            
                            # Acentos e caracteres especiais
                            if tem_acentos(valor):
                                stats['campos_com_acentos'][campo_nome] += 1
                                
                                # Coletar caracteres especiais
                                for char in valor:
                                    if re.match(r'[áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]', char):
                                        stats['caracteres_especiais'][char] += 1
                                
                                # Guardar exemplos
                                if len(stats['exemplos_problemas']) < 10:
                                    stats['exemplos_problemas'].append({
                                        'linha': linha_num,
                                        'campo': campo_nome,
                                        'valor': valor[:100],  # Primeiros 100 chars
                                        'tipo': 'acentos'
                                    })
                        
                        # Progress report
                        if linha_num % 1000000 == 0:
                            print(f"  ➜ Processadas {linha_num:,} linhas...")
                    
                    except Exception as e:
                        stats['linhas_com_erro'] += 1
                        if len(stats['linhas_problema']) < 20:
                            stats['linhas_problema'].append({
                                'linha': linha_num,
                                'erro': str(e)[:100]
                            })
    
    except Exception as e:
        print(f"❌ ERRO ao processar arquivo: {e}")
        return None
    
    # Imprimir relatório
    print(f"\n{'='*80}")
    print(f"RELATÓRIO DETALHADO - {zip_path.name}")
    print(f"{'='*80}\n")
    
    print(f"📊 ESTATÍSTICAS GERAIS:")
    print(f"   Total de linhas processadas: {stats['total_linhas']:,}")
    print(f"   ✅ Linhas válidas: {stats['linhas_validas']:,} ({stats['linhas_validas']/stats['total_linhas']*100:.2f}%)")
    print(f"   ❌ Linhas com erro: {stats['linhas_com_erro']:,} ({stats['linhas_com_erro']/stats['total_linhas']*100:.2f}%)")
    
    if stats['campos_vazios']:
        print(f"\n📝 CAMPOS VAZIOS (por campo):")
        for campo, count in sorted(stats['campos_vazios'].items(), key=lambda x: x[1], reverse=True):
            pct = (count / stats['linhas_validas'] * 100) if stats['linhas_validas'] > 0 else 0
            print(f"   • {campo}: {count:,} ({pct:.2f}%)")
    
    if stats['campos_nulos']:
        print(f"\n🚫 CAMPOS NULOS EXPLÍCITOS:")
        for campo, count in sorted(stats['campos_nulos'].items(), key=lambda x: x[1], reverse=True):
            pct = (count / stats['linhas_validas'] * 100) if stats['linhas_validas'] > 0 else 0
            print(f"   • {campo}: {count:,} ({pct:.2f}%)")
    
    if stats['campos_com_acentos']:
        print(f"\n🔤 CAMPOS COM ACENTOS/CARACTERES ESPECIAIS:")
        for campo, count in sorted(stats['campos_com_acentos'].items(), key=lambda x: x[1], reverse=True)[:10]:
            pct = (count / stats['linhas_validas'] * 100) if stats['linhas_validas'] > 0 else 0
            print(f"   • {campo}: {count:,} ({pct:.2f}%)")
    
    if stats['caracteres_especiais']:
        print(f"\n🔠 CARACTERES ESPECIAIS ENCONTRADOS (Top 20):")
        for char, count in stats['caracteres_especiais'].most_common(20):
            print(f"   • '{char}': {count:,} ocorrências")
    
    if stats['exemplos_problemas']:
        print(f"\n⚠️  EXEMPLOS DE REGISTROS COM ACENTOS:")
        for ex in stats['exemplos_problemas'][:5]:
            print(f"   Linha {ex['linha']}: Campo '{ex['campo']}' = '{ex['valor']}'")
    
    if stats['linhas_problema']:
        print(f"\n❌ EXEMPLOS DE LINHAS COM PROBLEMAS:")
        for prob in stats['linhas_problema'][:5]:
            if 'erro' in prob:
                print(f"   Linha {prob['linha']}: {prob['erro']}")
            else:
                print(f"   Linha {prob['linha']}: Esperado {prob['esperado']} campos, encontrado {prob['encontrado']}")
    
    print(f"\n{'='*80}\n")
    
    return stats

def main():
    """Executa análise de todos os arquivos"""
    
    print(f"""
╔════════════════════════════════════════════════════════════════════════════╗
║          ANÁLISE DETALHADA - RECEITA FEDERAL CNPJ                         ║
║                   Mapeamento de Problemas por Campo                       ║
╚════════════════════════════════════════════════════════════════════════════╝
    """)
    
    # Buscar todos os ZIPs
    zip_files = sorted(BASE_DIR.glob("*.zip"))
    
    if not zip_files:
        print("❌ Nenhum arquivo ZIP encontrado!")
        return
    
    print(f"📦 Total de arquivos encontrados: {len(zip_files)}\n")
    
    # Processar cada arquivo
    resultados = {}
    
    for zip_file in zip_files:
        resultado = analisar_arquivo_detalhado(zip_file)
        if resultado:
            resultados[zip_file.name] = resultado
    
    # Relatório consolidado final
    print(f"\n{'='*80}")
    print(f"RESUMO CONSOLIDADO - TODOS OS ARQUIVOS")
    print(f"{'='*80}\n")
    
    for nome, stats in sorted(resultados.items()):
        tipo = detectar_tipo_arquivo(nome)
        pct_validas = (stats['linhas_validas'] / stats['total_linhas'] * 100) if stats['total_linhas'] > 0 else 0
        print(f"📁 {nome}")
        print(f"   Tipo: {tipo}")
        print(f"   Total: {stats['total_linhas']:,} | Válidas: {stats['linhas_validas']:,} ({pct_validas:.2f}%)")
        
        # Campos mais problemáticos
        if stats['campos_vazios']:
            top_vazio = max(stats['campos_vazios'].items(), key=lambda x: x[1])
            pct = (top_vazio[1] / stats['linhas_validas'] * 100) if stats['linhas_validas'] > 0 else 0
            print(f"   Campo mais vazio: {top_vazio[0]} ({top_vazio[1]:,} = {pct:.2f}%)")
        
        if stats['campos_com_acentos']:
            top_acento = max(stats['campos_com_acentos'].items(), key=lambda x: x[1])
            pct = (top_acento[1] / stats['linhas_validas'] * 100) if stats['linhas_validas'] > 0 else 0
            print(f"   Campo com mais acentos: {top_acento[0]} ({top_acento[1]:,} = {pct:.2f}%)")
        
        print()

if __name__ == "__main__":
    main()
