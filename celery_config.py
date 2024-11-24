# celery/celery_config.py
from celery import Celery
from config import REDIS_BROKER_URL

# Initialize Celery
app = Celery('tasks', broker=REDIS_BROKER_URL)

# Celery configuration
app.conf.beat_schedule = {}

app.conf.timezone = 'UTC'

# Import tasks to register them
import celery_app.tasks
