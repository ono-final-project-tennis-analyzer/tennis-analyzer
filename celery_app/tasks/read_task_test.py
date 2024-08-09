from celery_app.celery_config import app
from celery_app.task_queue import TaskQueue
from db.models import with_session
from db.stores import EventStore


@app.task()
def read_task_test():
    with with_session() as session:
        task_queue = TaskQueue()
        task = task_queue.get_next_task()

        if task:
            print(f"TASK_QUEUE: read task {task.__dict__}")

            store = EventStore(session)
            event = store.create_event(task.name, task.meta['account_id'])

            print(f"Create event: {event.id}")
