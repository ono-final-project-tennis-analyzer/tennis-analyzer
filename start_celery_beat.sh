#!/bin/bash

# Activate the virtual environment
source ./venv/bin/activate

# Set PYTHONPATH to the parent directory to ensure the celery module is found
export PYTHONPATH=$(pwd)
export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES


cd celery_app

# Start the Celery beat
celery -A celery_config beat --loglevel=info  &