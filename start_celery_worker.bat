@echo off
call .\venv\Scripts\activate
set OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES
celery -A celery_config worker --loglevel=info -P solo
