source ./venv/bin/activate

alembic upgrade head

python app.py
