"""
Celery task para atualização automática de insights.
Executa semanalmente para recalcular insights e histórico.

FASE 4 - Task 3 (3 pts)

Agendamento: Todos os domingos às 03:00
"""

import sys
import os
from datetime import datetime

# Add project root to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from celery import shared_task
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)


@shared_task(name="update_insights_weekly", bind=True)
def update_insights_weekly(self):
    """
    Task Celery Beat para atualização semanal de insights.
    
    Executa:
    1. calculate_insights.py - Recalcula os 19 insights com dados atualizados
    2. calculate_history.py - Adiciona novo mês ao histórico
    
    Agendamento: Configurado em celery.py ou celerybeat-schedule
    """
    logger.info("=" * 80)
    logger.info("🚀 Iniciando atualização semanal de insights")
    logger.info(f"⏰ Timestamp: {datetime.now().isoformat()}")
    logger.info("=" * 80)
    
    try:
        # Executar calculate_insights.py
        logger.info("\n📊 ETAPA 1/2: Recalculando insights...")
        
        from app.scripts.calculate_insights import main as calculate_insights_main
        result_insights = calculate_insights_main()
        
        if result_insights != 0:
            logger.error("❌ Erro ao calcular insights")
            return {
                'status': 'error',
                'message': 'Falha ao calcular insights',
                'step': 1
            }
        
        logger.info("✅ Insights recalculados com sucesso")
        
        # Executar calculate_history.py
        logger.info("\n📅 ETAPA 2/2: Atualizando histórico...")
        
        from app.scripts.calculate_history import main as calculate_history_main
        result_history = calculate_history_main()
        
        if result_history != 0:
            logger.error("❌ Erro ao atualizar histórico")
            return {
                'status': 'error',
                'message': 'Falha ao atualizar histórico',
                'step': 2
            }
        
        logger.info("✅ Histórico atualizado com sucesso")
        
        logger.info("\n" + "=" * 80)
        logger.info("✅ SUCESSO! Atualização semanal concluída")
        logger.info("=" * 80)
        
        return {
            'status': 'success',
            'message': 'Insights e histórico atualizados',
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"\n❌ ERRO FATAL: {str(e)}")
        logger.exception(e)
        
        return {
            'status': 'error',
            'message': f'Erro fatal: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }


@shared_task(name="update_insights_manual", bind=True)
def update_insights_manual(self):
    """
    Task manual para forçar atualização de insights.
    
    Pode ser chamada via API ou admin panel quando necessário.
    """
    logger.info("🔧 Executando atualização MANUAL de insights")
    return update_insights_weekly()


# Configuração do agendamento Celery Beat
# Adicionar no backend/app/core/celery.py:
#
# from celery.schedules import crontab
#
# app.conf.beat_schedule = {
#     'update-insights-weekly': {
#         'task': 'update_insights_weekly',
#         'schedule': crontab(hour=3, minute=0, day_of_week='sunday'),  # Domingos às 03:00
#         'options': {'expires': 3600}  # Tarefa expira em 1 hora
#     },
# }
