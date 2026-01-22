#!/usr/bin/env python3
"""
Script específico para importação de Simples Nacional e Sócios
"""

import sys
import os
import logging
import logging.config
from pathlib import Path

# Adicionar diretório do app ao path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.scripts.import_config import LOGGING_CONFIG
from app.scripts.import_cnpj import (
    import_simples_nacional,
    import_socios,
    get_db_connection
)

# Configurar logging
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger('cnpj_import')


def main():
    """Importa apenas Simples Nacional e Sócios"""
    logger.info("="*80)
    logger.info("IMPORTAÇÃO ESPECÍFICA - SIMPLES NACIONAL E SÓCIOS")
    logger.info("="*80)
    
    conn = get_db_connection()
    
    try:
        # Fase 1: Simples Nacional
        logger.info("\n[1/2] Processando Simples Nacional...")
        import_simples_nacional(conn, test_mode=False)
        
        # Fase 2: Sócios
        logger.info("\n[2/2] Processando Sócios...")
        import_socios(conn, test_mode=False)
        
        logger.info("\n" + "="*80)
        logger.info("IMPORTAÇÃO CONCLUÍDA COM SUCESSO!")
        logger.info("="*80)
        
    except Exception as e:
        logger.error(f"Erro na importação: {e}", exc_info=True)
        raise
    finally:
        conn.close()


if __name__ == '__main__':
    main()
