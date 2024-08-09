from celery_app.celery_config import app
from celery_app.task_queue import TaskQueue
from db.models import with_session
from db.stores import EventStore


@app.task()
def read_task_test():
    print("Read Task Test: started")

    with with_session() as session:
        print(f"Read Task Test: session: {session}")

        task_queue = TaskQueue()
        task = task_queue.get_next_task()

        print(f"Read task from redis: {task=}")

        if task:
            print(f"TASK_QUEUE: read task {task.__dict__}")

            store = EventStore(session)
            event = store.create_event(task.name, task.meta['account_id'], task.meta)

            print(f"Create event: {event.id}")
        else:
            print("No task found")
