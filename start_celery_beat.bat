@echo off
REM Activate the virtual environment
call .\venv\Scripts\activate

REM Set environment variable
set OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES

REM Start Celery beat in a new window
start cmd /k "celery -A celery_config beat --loglevel=info"
