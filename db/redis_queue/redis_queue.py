from dataclasses import dataclass
from typing import Optional

import redis


@dataclass
class RedisConfig:
    host: str
    port: int
    db: int
    password: Optional[str] = None


class RedisQueue:
    def __init__(self, config: RedisConfig, key: str):
        self._db = redis.Redis(host=config.host, port=config.port, db=config.db, password=config.password)
        self._key = key

    def queue(self, item):
        self._db.rpush(self._key, item)

    def dequeue(self, block=True, timeout=10):
        if block:
            item = self._db.blpop(self._key, timeout=timeout)
        else:
            item = self._db.lpop(self._key)
        if item:
            return item[1] if block else item
        return None

    def delete(self):
        self._db.delete(self._key)
