import uuid
from contextlib import contextmanager
from redis import StrictRedis
from db.redis_queue.redis_queue import RedisConfig

_REDIS_CONFIG = RedisConfig(
    host='localhost',
    port=6379,
    db=0,
)


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
