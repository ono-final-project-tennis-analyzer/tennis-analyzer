﻿@echo off
call .\venv\Scripts\activate
alembic upgrade head
python app.py