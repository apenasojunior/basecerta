#!/usr/bin/env python3
"""
PostgreSQL Auto-Tuning para Importação de Dados
Aplica configurações otimizadas antes da importação
e restaura configurações originais após
"""

import subprocess
import sys
import psutil
import os
from pathlib import Path

class PostgresTuner:
    def __init__(self, db_name='basecerta', db_user='aian_db'):
        self.db_name = db_name
        self.db_user = db_user
        self.backup_file = Path('config/postgres_config_backup.conf')
        
    def get_system_resources(self):
        """Detecta recursos do sistema"""
        total_ram_gb = psutil.virtual_memory().total / (1024**3)
        cpu_count = psutil.cpu_count()
        
        # Detectar tipo de disco (SSD vs HDD)
        try:
            # macOS
            result = subprocess.run(
                ['diskutil', 'info', '/'],
                capture_output=True,
                text=True
            )
            is_ssd = 'Solid State: Yes' in result.stdout
        except:
            # Assumir SSD se não conseguir detectar
            is_ssd = True
        
        return {
            'ram_gb': total_ram_gb,
            'cpu_count': cpu_count,
            'is_ssd': is_ssd
        }
    
    def calculate_optimal_settings(self):
        """Calcula configurações otimizadas baseado no hardware"""
        resources = self.get_system_resources()
        
        ram_gb = resources['ram_gb']
        cpu_count = resources['cpu_count']
        
        # Regras baseadas em best practices PostgreSQL
        settings = {
            # Memória
            'shared_buffers': f"{int(ram_gb * 0.25)}GB",  # 25% da RAM
            'effective_cache_size': f"{int(ram_gb * 0.5)}GB",  # 50% da RAM
            'maintenance_work_mem': f"{min(int(ram_gb * 0.2), 2)}GB",  # Max 2GB
            'work_mem': f"{int((ram_gb * 0.05) * 1024)}MB",  # 5% RAM
            
            # Paralelismo
            'max_parallel_workers_per_gather': min(cpu_count // 2, 4),
            'max_parallel_workers': min(cpu_count, 8),
            'max_worker_processes': min(cpu_count, 8),
            
            # WAL e Checkpoints
            'wal_buffers': '16MB',
            'max_wal_size': '10GB',
            'min_wal_size': '2GB',
            'checkpoint_timeout': '30min',
            'checkpoint_completion_target': '0.9',
            
            # I/O
            'effective_io_concurrency': 200 if resources['is_ssd'] else 2,
            'random_page_cost': 1.1 if resources['is_ssd'] else 4.0,
            
            # Performance (TEMPORÁRIO - apenas durante import!)
            'synchronous_commit': 'off',
            'full_page_writes': 'off',
            'fsync': 'off',  # PERIGOSO - apenas para import inicial
            
            # Autovacuum (desabilitar durante import)
            'autovacuum': 'off',
        }
        
        return settings
    
    def get_current_settings(self):
        """Busca configurações atuais do PostgreSQL"""
        settings = {}
        
        query = """
        SELECT name, setting, unit 
        FROM pg_settings 
        WHERE name IN (
            'shared_buffers', 'effective_cache_size', 'maintenance_work_mem',
            'work_mem', 'max_parallel_workers_per_gather', 'max_parallel_workers',
            'max_worker_processes', 'wal_buffers', 'max_wal_size', 'min_wal_size',
            'checkpoint_timeout', 'checkpoint_completion_target',
            'effective_io_concurrency', 'random_page_cost', 'synchronous_commit',
            'full_page_writes', 'fsync', 'autovacuum'
        );
        """
        
        result = self._run_psql(query)
        
        for line in result.stdout.strip().split('\n')[2:-1]:  # Pular header e footer
            if '|' in line:
                parts = [p.strip() for p in line.split('|')]
                if len(parts) >= 3:
                    name, value, unit = parts[0], parts[1], parts[2]
                    settings[name] = f"{value}{unit}" if unit else value
        
        return settings
    
    def backup_current_settings(self):
        """Faz backup das configurações atuais"""
        print("📋 Fazendo backup das configurações atuais...")
        
        current = self.get_current_settings()
        
        self.backup_file.parent.mkdir(exist_ok=True)
        
        with open(self.backup_file, 'w') as f:
            f.write("# PostgreSQL Config Backup - Before Import Tuning\n")
            f.write(f"# Generated: {subprocess.run(['date'], capture_output=True, text=True).stdout.strip()}\n\n")
            
            for key, value in current.items():
                f.write(f"{key} = {value}\n")
        
        print(f"   ✅ Backup salvo em: {self.backup_file}")
    
    def apply_tuning(self):
        """Aplica configurações otimizadas"""
        print("\n🔧 Aplicando tuning otimizado para importação...")
        
        resources = self.get_system_resources()
        print(f"\n📊 Recursos Detectados:")
        print(f"   RAM: {resources['ram_gb']:.1f} GB")
        print(f"   CPUs: {resources['cpu_count']}")
        print(f"   Disco: {'SSD ✅' if resources['is_ssd'] else 'HDD ⚠️'}")
        
        settings = self.calculate_optimal_settings()
        
        print("\n⚙️  Aplicando configurações:")
        
        for key, value in settings.items():
            try:
                self._run_psql(f"ALTER SYSTEM SET {key} = '{value}';")
                print(f"   ✅ {key} = {value}")
            except Exception as e:
                print(f"   ⚠️  {key}: {e}")
        
        # Recarregar configuração
        self._run_psql("SELECT pg_reload_conf();")
        
        print("\n✅ Tuning aplicado com sucesso!")
        print("\n⚠️  AVISO: Configurações de segurança foram desabilitadas!")
        print("   - synchronous_commit = off")
        print("   - full_page_writes = off")
        print("   - fsync = off")
        print("   Não use o banco para produção neste estado!")
    
    def restore_settings(self):
        """Restaura configurações originais"""
        print("\n🔄 Restaurando configurações originais...")
        
        if not self.backup_file.exists():
            print("❌ Arquivo de backup não encontrado!")
            return False
        
        with open(self.backup_file, 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                
                if '=' in line:
                    key, value = [p.strip() for p in line.split('=', 1)]
                    try:
                        self._run_psql(f"ALTER SYSTEM SET {key} = '{value}';")
                        print(f"   ✅ {key} = {value}")
                    except Exception as e:
                        print(f"   ⚠️  {key}: {e}")
        
        # Recarregar configuração
        self._run_psql("SELECT pg_reload_conf();")
        
        print("\n✅ Configurações restauradas!")
        print("   Banco de dados está seguro para uso em produção.")
        
        return True
    
    def _run_psql(self, query):
        """Executa comando SQL via psql"""
        cmd = [
            'psql',
            '-U', self.db_user,
            '-d', self.db_name,
            '-c', query
        ]
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True
        )
        
        return result
    
    def show_status(self):
        """Mostra status das configurações atuais"""
        print("\n📊 Configurações Atuais do PostgreSQL:\n")
        
        query = """
        SELECT 
            name, 
            setting, 
            unit,
            CASE 
                WHEN source = 'configuration file' THEN '📝 Config File'
                WHEN source = 'override' THEN '🔧 Altered'
                WHEN source = 'default' THEN '🔹 Default'
                ELSE source
            END as source
        FROM pg_settings 
        WHERE name IN (
            'shared_buffers', 'effective_cache_size', 'maintenance_work_mem',
            'work_mem', 'max_parallel_workers_per_gather', 
            'synchronous_commit', 'full_page_writes', 'fsync', 'autovacuum'
        )
        ORDER BY name;
        """
        
        result = self._run_psql(query)
        print(result.stdout)


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='PostgreSQL Tuning para Importação')
    parser.add_argument('--apply', action='store_true', help='Aplicar tuning otimizado')
    parser.add_argument('--restore', action='store_true', help='Restaurar configurações originais')
    parser.add_argument('--status', action='store_true', help='Mostrar configurações atuais')
    parser.add_argument('--db', default='basecerta', help='Nome do banco de dados')
    parser.add_argument('--user', default='aian_db', help='Usuário do banco')
    
    args = parser.parse_args()
    
    tuner = PostgresTuner(db_name=args.db, db_user=args.user)
    
    if args.apply:
        tuner.backup_current_settings()
        tuner.apply_tuning()
        tuner.show_status()
        
    elif args.restore:
        tuner.restore_settings()
        tuner.show_status()
        
    elif args.status:
        tuner.show_status()
        
    else:
        parser.print_help()
        print("\n💡 Exemplos de uso:")
        print("   python scripts/postgres_tuning.py --apply     # Aplicar tuning para importação")
        print("   python scripts/postgres_tuning.py --restore   # Restaurar configurações")
        print("   python scripts/postgres_tuning.py --status    # Ver status atual")


if __name__ == '__main__':
    main()
