import json
import uuid
from dataclasses import dataclass, asdict
from typing import Optional

from db.redis_queue.redis_queue import RedisQueue, RedisConfig

_REDIS_CONFIG = RedisConfig(
    host='localhost',
    port=6379,
    db=0,

)


@dataclass
class TaskItem:
    name: str
    type: str
    meta: dict
    id: Optional[str] = None


class TaskQueue:
    def __init__(self):
        self._redis = RedisQueue(_REDIS_CONFIG, key="task_queue")

    def add_task(self, task: TaskItem):
        if not task.id:
            task.id = str(uuid.uuid4())

        self._redis.queue(json.dumps(asdict(task)))

    def get_next_task(self):
        task = self._redis.dequeue()
        if task:
            data = json.loads(task)
            return TaskItem(**data)

        return None