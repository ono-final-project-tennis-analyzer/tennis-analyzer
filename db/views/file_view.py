import os
import uuid

from flask import Blueprint, jsonify, request

from celery_app.task_queue import TaskQueue, TaskItem
from celery_app.tasks.read_task_test import read_task_test
from db.models import create_session
from db.stores.events_store import EventStore
from storage_client import StorageClient
from flask_login import current_user, login_required

file_bp = Blueprint('file', __name__)

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, 'uploads')

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@login_required
@file_bp.route('/', methods=['POST'])
def create_file():
    try:
        if 'video' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['video']
        file_type = file.filename.split('.')[-1]

        if file_type not in ['mp4', 'avi', 'flv']:
            return jsonify({"error": "Invalid file type"}), 400

        storage = StorageClient()
        task_queue = TaskQueue()

        file_buffer = file.read()
        file_name = f"{uuid.uuid4()}.{file_type}"
        account_id = current_user.id

        temp_file_path = os.path.join(UPLOAD_FOLDER, file_name)

        with open(temp_file_path, "wb") as temp:
            temp.write(file_buffer)

        storage.upload_file(account_id=str(account_id), file_name=file_name, file_path=temp_file_path)

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
            read_task_test.apply_async(event.id)
            return jsonify({"status": "True", "event_id": event.id}), 200
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500
