#!/bin/bash

# Activate the virtual environment
source ./venv/bin/activate

# Set PYTHONPATH to the parent directory to ensure the celery module is found
export PYTHONPATH=$(pwd)

cd celery_app
# Kill the Celery worker
pkill -f 'celery -A celery_config worker'

# Kill the Celery beat
pkill -f 'celery -A celery_config beat'