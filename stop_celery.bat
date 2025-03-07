@echo off
REM Activate the virtual environment
call .\venv\Scripts\activate

REM Kill the Celery worker
wmic process where "CommandLine like '%celery%worker%'" call terminate

REM Kill the Celery beat
wmic process where "CommandLine like '%celery%beat%'" call terminate
