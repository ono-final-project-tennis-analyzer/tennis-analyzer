from flask import Blueprint, request, jsonify

from db.models import create_session
from db.stores.events_store import EventStore

task_bp = Blueprint('task', __name__)


@task_bp.route('/', methods=['POST'])
def create_task():
    # Extracting data from the request
    data = request.get_json()

    # Expected fields
    account_id = data.get('account_id')
    task_type = data.get('type')
    name = data.get('name')
    meta = data.get('meta')

    # Here you can add logic to process or store the task data
    # For now, let's just return the data back as a response
    response = {
        'account_id': account_id,
        'type': task_type,
        'name': name,
        'meta': meta
    }

    return jsonify(response), 201  # Returning a 201 status code for created resources


@task_bp.route('/<id>', methods=['GET'])
def get_task(id: int):
    # For now, just pass as requested
    with create_session() as session:
        store = EventStore(session=session)

        try:
            event = store.get_event(int(id))

            return jsonify(event), 200
        except EventStore as e:
            print(e)
            return 400

