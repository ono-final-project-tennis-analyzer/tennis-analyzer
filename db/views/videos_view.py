
from flask import Blueprint, jsonify
from flask_login import current_user, login_required
from db.models import create_session
from db.stores.video_store import VideoStore

video_bp = Blueprint('videos', __name__)

@login_required
@video_bp.route('/', methods=['GET'])
def get_videos():
    try:
        account_id = current_user.id
        if not account_id:
            return jsonify({"error": " No user detected"}), 400
        with create_session() as session:
            store = VideoStore(session)
            [videos,count] = store.get_videos( account_id= account_id)
        return jsonify({"videos": videos, "count": count}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500