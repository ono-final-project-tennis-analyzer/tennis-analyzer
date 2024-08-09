import uuid

from celery_app.celery_config import app
from celery_app.task_queue import TaskQueue, TaskItem


@app.task
def add_task_test():
    task_queue = TaskQueue()
    task_queue.add_task(TaskItem(name=str(uuid.uuid4()), type="event", meta={"account_id": 12}))
    print("TASK_QUEUE: added task test")
