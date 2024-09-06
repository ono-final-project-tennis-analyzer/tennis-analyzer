import os
import uuid

from flask import Blueprint, jsonify, request

from celery_app.task_queue import TaskQueue, TaskItem
from db.models import create_session
from db.stores.events_store import EventStore
from storage_client import StorageClient

file_bp = Blueprint('file', __name__)

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, 'uploads')

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@file_bp.route('/', methods=['POST'])
def create_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']

        storage = StorageClient()
        task_queue = TaskQueue()

        file_buffer = file.read()
        file_name = f"{uuid.uuid4()}.mp4"
        account_id = 12

        temp_file_path = os.path.join(UPLOAD_FOLDER, file_name)

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
            os.remove(temp_file_path)
            return jsonify({"status": "True", "event_id": event.id}), 200
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500
