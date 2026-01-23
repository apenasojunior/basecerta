#!/usr/bin/env python3
"""
Script para contar linhas nos arquivos .zip CNPJ de forma eficiente
"""
import zipfile
import os
from pathlib import Path

def contar_linhas_zip(arquivo_zip):
    """Conta linhas em um arquivo ZIP"""
    total = 0
    try:
        with zipfile.ZipFile(arquivo_zip, 'r') as zf:
            for nome_arquivo in zf.namelist():
                with zf.open(nome_arquivo) as f:
                    total += sum(1 for _ in f)
        return total
    except Exception as e:
        print(f"Erro ao ler {arquivo_zip}: {e}")
        return 0

def main():
    base_dir = Path("/Volumes/ExtMB/BaseCNPJ/dez2025")
    
    print("═" * 70)
    print("  CONTAGEM DE LINHAS NOS ARQUIVOS .ZIP")
    print("═" * 70)
    print()
    
    # Empresas
    print("📊 EMPRESAS:")
    empresas_total = 0
    for arq in sorted(base_dir.glob("Empresas*.zip")):
        count = contar_linhas_zip(arq)
        print(f"  {arq.name:30s}: {count:>12,} linhas")
        empresas_total += count
    print(f"  {'─' * 30}  {'─' * 12}")
    print(f"  {'TOTAL':30s}: {empresas_total:>12,} linhas")
    print()
    
    # Estabelecimentos
    print("📊 ESTABELECIMENTOS:")
    estab_total = 0
    for arq in sorted(base_dir.glob("Estabelecimentos*.zip")):
        count = contar_linhas_zip(arq)
        print(f"  {arq.name:30s}: {count:>12,} linhas")
        estab_total += count
    print(f"  {'─' * 30}  {'─' * 12}")
    print(f"  {'TOTAL':30s}: {estab_total:>12,} linhas")
    print()
    
    # Simples
    print("📊 SIMPLES NACIONAL:")
    simples_arq = base_dir / "Simples.zip"
    if simples_arq.exists():
        simples_total = contar_linhas_zip(simples_arq)
        print(f"  {simples_arq.name:30s}: {simples_total:>12,} linhas")
    else:
        simples_total = 0
        print("  Arquivo não encontrado")
    print()
    
    # Sócios
    print("📊 SÓCIOS:")
    socios_total = 0
    for arq in sorted(base_dir.glob("Socios*.zip")):
        count = contar_linhas_zip(arq)
        print(f"  {arq.name:30s}: {count:>12,} linhas")
        socios_total += count
    print(f"  {'─' * 30}  {'─' * 12}")
    print(f"  {'TOTAL':30s}: {socios_total:>12,} linhas")
    print()
    
    # Salvar resultados
    with open("backend/logs/contagem_arquivos.txt", "w") as f:
        f.write(f"empresas|{empresas_total}\n")
        f.write(f"estabelecimentos|{estab_total}\n")
        f.write(f"simples|{simples_total}\n")
        f.write(f"socios|{socios_total}\n")
    
    print("✅ Resultados salvos em: backend/logs/contagem_arquivos.txt")
    
    return empresas_total, estab_total, simples_total, socios_total

if __name__ == "__main__":
    main()
