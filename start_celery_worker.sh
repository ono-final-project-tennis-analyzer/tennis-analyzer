#!/bin/bash

# Activate the virtual environment
source ./venv/bin/activate

export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES

# Start the Celery worker
celery -A celery_config worker --loglevel=info &
