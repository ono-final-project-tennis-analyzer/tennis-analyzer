from flask import Blueprint, request, jsonify
from flask_login import login_required

from db.models import create_session
from db.stores.events_store import EventStore
from db.stores.video_events_store import VideoEventsStore

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


@event_bp.route('/stroke-types', methods=['PATCH'])
@login_required
def update_stroke_types():
    """
    Route to update stroke types for multiple video events.
    Expects JSON payload with an array of objects containing event_id and stroke_type.
    Example:
    [
        {
            "event_id": 1,
            "stroke_type": 1
        }
    ]
    """
    data = request.json
    if not isinstance(data, list):
        return jsonify({"error": "Request body must be an array"}), 400

    for update in data:
        if not isinstance(update, dict) or 'event_id' not in update or 'stroke_type' not in update:
            return jsonify({"error": "Each update must contain event_id and stroke_type"}), 400

    with create_session() as session:
        store = VideoEventsStore(session)
        updated_events = store.update_stroke_types(data)

    return jsonify([event.to_dict() for event in updated_events]), 200
