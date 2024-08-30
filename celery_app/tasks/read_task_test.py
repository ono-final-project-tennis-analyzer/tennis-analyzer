from celery_app.celery_config import app
from celery_app.task_queue import TaskQueue, TaskItem, _REDIS_CONFIG
from db.models import with_session
from db.stores import EventStore
from tennis_video_analyzer.tennis_video_analyzer import process_video
from contextlib import contextmanager
from redis import StrictRedis
import uuid

redis_connection = StrictRedis(host=_REDIS_CONFIG.host, port=_REDIS_CONFIG.port)

REMOVE_ONLY_IF_OWNER_SCRIPT = \
    """if redis.call("get",KEYS[1]) == ARGV[1] then
        return redis.call("del",KEYS[1])
    else
        return 0
    end
    """


@contextmanager
def redis_lock(lock_name, expires=60):
    random_value = str(uuid.uuid4())
    lock_acquired = bool(
        redis_connection.set(lock_name, random_value, ex=expires, nx=True)
    )
    yield lock_acquired
    if lock_acquired:
        redis_connection.eval(REMOVE_ONLY_IF_OWNER_SCRIPT, 1, lock_name, random_value)


@app.task()
def read_task_test():
    print("Read Task Test: started")

    with redis_lock('read_task_test_lock', 180) as acquired:
        if not acquired:
            print("Read Task Test: lock not acquired")
            return

        with with_session() as session:
            print(f"Read Task Test: session: {session}")

            # task_queue = TaskQueue()
            # task = task_queue.get_next_task()

            task = TaskItem(
                name="read_task_test",
                type="event",
                meta={
                    "account_id": "1",
                    "fileName": "test_short.mp4",
                }
            )

            print(f"Read task from redis: {task=}")

            if task:
                print(f"TASK_QUEUE: read task {task.__dict__}")

                store = EventStore(session)
                event = store.create_event(task.name, task.meta['account_id'], task.meta)

                print(f"Create event: {event.id}")

                process_video(event_id=event.id)
            else:
                print("No task found")
