#!/bin/bash

# Activate the virtual environment
source ./venv/bin/activate

export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES

# Start the Celery beat
celery -A celery_config beat --loglevel=info  &
