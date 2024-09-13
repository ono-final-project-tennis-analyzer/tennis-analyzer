import os
import subprocess

# Set environment variables
os.environ['PYTHONPATH'] = os.getcwd()
os.environ['OBJC_DISABLE_INITIALIZE_FORK_SAFETY'] = 'YES'

# Activate the virtual environment by adjusting the PATH
venv_path = os.path.join(os.getcwd(), 'venv', 'bin')
os.environ['PATH'] = f"{venv_path}:{os.environ.get('PATH', '')}"

try:
    # Navigate to the celery_app directory
    os.chdir('celery_app')

    # Start the Celery worker synchronously with logs attached
    subprocess.run(
        ['celery', '-A', 'celery_config', 'worker', '--loglevel=info'],
        check=True
    )
except subprocess.CalledProcessError as e:
    print(f"Error starting Celery worker: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
