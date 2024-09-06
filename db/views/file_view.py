import uuid

from flask import Blueprint, jsonify

from celery_app.task_queue import TaskQueue, TaskItem
from db.models import create_session
from db.stores.events_store import EventStore
from storage_client import StorageClient

file_bp = Blueprint('file', __name__)


@file_bp.route('/', methods=['POST'])
def create_file():
    storage = StorageClient()
    task_queue = TaskQueue()

    file_buffer = "..."
    file_name = f"{uuid.uuid4()}.mp4"
    account_id = 12

    with open(file_name, "w") as temp:
        temp.write(file_buffer)

    storage.upload_file(account_id=str(account_id), file_name=file_name, file_path=file_buffer)

    meta = {
        "file_name": file_name,
        "account_id": str(account_id),
    }

    with create_session() as session:
        store = EventStore(session)
        event = store.create_event(name="video_upload", account_id=str(account_id), meta=meta)

        task_queue.add_task(TaskItem(
            event_id=event.id,
            name="video_task",
            type="Analyze",
            meta=meta
        ))

        return jsonify({"status": "True", "event_id": event.id}), 200
