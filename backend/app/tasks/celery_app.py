"""
Celery Application Configuration
Async task queue for background jobs
"""
from celery import Celery
from celery.schedules import crontab

from app.core.config import settings
from app.utils.logger import logger


# Create Celery application
celery_app = Celery(
    "basecerta",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks.research_tasks"]  # Import task modules
)


# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="America/Sao_Paulo",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=4,
    worker_max_tasks_per_child=1000,
)


# Celery Beat Schedule (periodic tasks)
celery_app.conf.beat_schedule = {
    # Example: Clean old data every day at 3 AM
    "cleanup-old-data": {
        "task": "app.tasks.research_tasks.cleanup_old_data",
        "schedule": crontab(hour=3, minute=0),
    },
    # Example: Update credit stats every hour
    "update-credit-stats": {
        "task": "app.tasks.research_tasks.update_credit_stats",
        "schedule": crontab(minute=0),  # Every hour
    },
}


@celery_app.task(bind=True)
def debug_task(self):
    """Debug task for testing Celery"""
    logger.info(f"Request: {self.request!r}")
    return {"status": "success", "message": "Celery is working!"}


# Task events
@celery_app.task(bind=True, name="app.tasks.health_check")
def health_check_task(self):
    """Health check task for Celery monitoring"""
    return {
        "status": "healthy",
        "worker_id": self.request.id,
        "message": "Celery worker is running"
    }


if __name__ == "__main__":
    celery_app.start()
