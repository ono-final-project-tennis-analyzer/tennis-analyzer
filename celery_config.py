# celery/celery_config.py
from celery import Celery

# Initialize Celery
app = Celery('tasks', broker='redis://localhost:6379/0')

# Celery configuration
app.conf.beat_schedule = {
    'read_task-every-1-minute': {
        'task': 'celery_app.tasks.read_task',
        'schedule': 60,
    },
}

app.conf.timezone = 'UTC'

# Import tasks to register them
import celery_app.tasks
