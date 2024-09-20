from celery_app.task_queue.redis_lock import redis_lock
from celery_config import app
from celery_app.task_queue import TaskQueue
from db.models import with_session
from db.stores.events_store import EventStore
from tennis_video_analyzer.tennis_video_analyzer import process_video


@app.task()
def read_task():
    print("Read Task Test: started")

    with redis_lock('read_task_test_lock', 180) as acquired:
        if not acquired:
            print("Read Task Test: lock not acquired")
            return

        with with_session() as session:
            print(f"Read Task Test: session: {session}")

            task_queue = TaskQueue()
            task = task_queue.get_next_task()

            print(f"Read task from redis: {task=}")

            if task:
                print(f"TASK_QUEUE: read task {task.__dict__}")

                store = EventStore(session)
                event = store.get_event(task.event_id)

                print(f"Create event: {event.id}")

                process_video(event_id=event.id)
            else:
                print("No task found")
