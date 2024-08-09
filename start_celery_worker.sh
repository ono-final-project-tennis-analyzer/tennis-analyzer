#!/bin/bash

# Activate the virtual environment
source ./venv/bin/activate

# Set PYTHONPATH to the parent directory to ensure the celery module is found
export PYTHONPATH=$(pwd)

cd celery_app

# Start the Celery worker
celery -A celery_config worker --loglevel=info &
