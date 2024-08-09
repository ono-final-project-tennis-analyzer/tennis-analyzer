from celery_config import app

@app.task
def print_hello_world():
    print("Hello, World!")
