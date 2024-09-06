from flask import Blueprint, request, jsonify
from flask_login import login_required

from db.models import create_session
from db.stores.events_store import EventStore

event_bp = Blueprint('event', __name__)


@event_bp.route('/events', methods=['POST'])
@login_required
def create_event():
    """
    Route to create a new event.
    Expects JSON payload with 'name', 'account_id', and 'meta' fields.
    """
    data = request.json
    name = data.get('name')
    account_id = data.get('account_id')
    meta = data.get('meta', {})

    if not name or not account_id:
        return jsonify({"error": "Missing required fields"}), 400

    with create_session() as session:
        store = EventStore(session)
        event = store.create_event(name=name, account_id=account_id, meta=meta)

    return jsonify(event), 201


@event_bp.route('/<int:event_id>', methods=['GET'])
@login_required
def get_event(event_id: int):
    """
    Route to get an event by its ID.
    """
    with create_session() as session:
        store = EventStore(session)
        event = store.get_event(event_id)

    if not event:
        return jsonify({"error": "Event not found"}), 404

    return jsonify(event), 200


@event_bp.route('/account/<string:account_id>', methods=['GET'])
@login_required
def get_all_events(account_id: str):
    """
    Route to get all events for a specific account.
    """
    with create_session() as session:
        store = EventStore(session)
        events = store.get_all_events(account_id)

    return jsonify(events), 200


@event_bp.route('/<int:event_id>', methods=['PATCH'])
@login_required
def update_event(event_id: int):
    """
    Route to update an event's stage or progress.
    Expects JSON payload with 'stage' and/or 'progress'.
    """
    data = request.json
    stage = data.get('stage')
    progress = data.get('progress')

    with create_session() as session:
        store = EventStore(session)
        event = store.update_event(event_id, stage=stage, progress=progress)

    if not event:
        return jsonify({"error": "Event not found"}), 404

    return jsonify(event), 200
