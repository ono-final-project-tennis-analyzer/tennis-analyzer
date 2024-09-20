#!/bin/bash

# Activate the virtual environment
source ./venv/bin/activate

pkill -f 'celery -A celery_config worker'

# Kill the Celery beat
pkill -f 'celery -A celery_config beat'
