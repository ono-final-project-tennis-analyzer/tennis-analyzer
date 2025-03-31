#!/bin/bash

# Exit on any error
set -e

# Graceful shutdown on Ctrl+C
trap "echo '⛔️ Caught SIGINT, stopping...'; kill 0; exit 0" SIGINT

# Step 1: Try to activate venv if it exists
if [ -f "./venv/bin/activate" ]; then
  echo "🔧 Activating virtual environment..."
  source ./venv/bin/activate
else
  echo "⚠️  No virtualenv found at ./venv/bin/activate — skipping activation."
fi

# Step 2: Set environment variables
export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES

# Step 3: Run Alembic migrations
echo "📦 Running Alembic migrations..."
alembic upgrade head

# Step 4: Start Celery worker and beat in background
echo "🚀 Starting Celery worker..."
celery -A celery_config worker --loglevel=info &
worker_pid=$!

echo "📅 Starting Celery beat..."
celery -A celery_config beat --loglevel=info &
beat_pid=$!

# Step 5: Start Flask app (in foreground)
echo "🌐 Starting Flask app..."
python app.py &
app_pid=$!

wait $worker_pid $beat_pid $app_pid