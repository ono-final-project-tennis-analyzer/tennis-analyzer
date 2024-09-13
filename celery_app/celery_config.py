# celery/celery_config.py
from celery import Celery

# Initialize Celery
app = Celery('tasks', broker='redis://localhost:6379/0')

# Celery configuration
app.conf.beat_schedule = {
    'read_task_test-every-1-minute': {
        'task': 'tasks.read_task.read_task',
        'schedule': 60,
    },
}

app.conf.timezone = 'UTC'

# Import tasks to register them
import tasks
