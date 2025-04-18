import io

from flask import Blueprint, jsonify, abort, send_file
from flask_login import current_user, login_required
from db.models import create_session
from db.stores.video_store import VideoStore
from storage_client import StorageClient

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
            videos = store.get_all_videos(account_id=account_id)
        return jsonify({"videos": videos}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@login_required
@video_bp.route('/<int:video_id>', methods=['GET'])
def get_video(video_id):
    try:
        account_id = current_user.id
        if not account_id:
            return jsonify({"error": "No user detected"}), 400

        with create_session() as session:
            video_store = VideoStore(session)
            video = video_store.get_video(video_id)
            if not video or video.account_id != account_id:
                return jsonify({"error": "Video not found or unauthorized"}), 404

            # Fetch related video events
            video_events = [
                {
                    'id': event.id,
                    'video_id': event.video_id,
                    'event_type': event.event_type,
                    'video_id': video.id,
                    'frame_number': event.frame_number,
                    'time_seconds': event.time_seconds,
                    'time_string': event.time_string,
                    'metadata': event.event_metadata,
                    'created_at': str(event.created_at) if event.created_at else None,
                    'updated_at': str(event.updated_at) if event.updated_at else None,
                    'stroke_type': event.stroke_type if event.stroke_type else None
                }
                for event in video.video_events
            ]

            video_data = {
                'id': video.id,
                'title': video.event.meta['file_name'],
                # Add other video fields you need
                'created_at': str(video.created_at) if video.created_at else None,
                'updated_at': str(video.updated_at) if video.updated_at else None,
                'video_events': video_events
            }
            return jsonify({"data": video_data}), 200

    except Exception as e:
        print(f"Error fetching video: {e}")
        return jsonify({"error": "Failed to fetch video"}), 500

@login_required
@video_bp.route('/<int:video_id>', methods=['DELETE'])
def delete_video(video_id):
    try:
        account_id = current_user.id
        if not account_id:
            return jsonify({"error": "No user detected"}), 400

        with create_session() as session:
            video_store = VideoStore(session)
            storage_client = StorageClient()

            # Fetch the video details
            video = video_store.get_video(video_id)
            if not video or video.account_id != account_id:
                return jsonify({"error": "Video not found or unauthorized"}), 404

            # Delete the video file from storage
            if video.video_path:
                storage_client.delete_file(account_id=account_id, file_name=video.video_path)

            # Delete the video record
            video_store.delete_video(video_id)

        return jsonify({"message": f"Video with ID {video_id} deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting video: {e}")
        return jsonify({"error": "Failed to delete video"}), 500

@login_required
@video_bp.route("/download/<string:type>/<int:video_id>", methods=["GET"])
def stream_video(type: str, video_id: int):
    try:
        req_account_id = current_user.id
        if not req_account_id:
            return jsonify({"error": "No user detected"}), 400

        with create_session() as session:
            video_store = VideoStore(session)
            storage_client = StorageClient()

            # Fetch video details
            video = video_store.get_video(video_id)
            if not video:
                abort(404, description="Video not found")

            # Stream the file
            account_id = video.account_id
            if not account_id:
                abort(404, description="Account ID not found for the video")

            if req_account_id != account_id:
                return jsonify({"error": "Video not found or unauthorized"}), 404


            # Validate file name existence
            file_name = video.event.meta['file_name']
            if not file_name:
                abort(404, description=f"{type.capitalize()} video not available")

            # Determine the file path based on type
            if type == "original":
                file_path = file_name
            elif type == "processed":
                file_path = f"output-{file_name}"
            else:
                abort(400, description="Invalid video type. Must be 'original' or 'processed'.")

            video_stream = storage_client.stream_file(account_id, file_path)

            file_bytes = video_stream.read()
            video_stream.close()
            return send_file(
                io.BytesIO(file_bytes),
                download_name=file_path,
                as_attachment=True,
                mimetype="video/mp4"
            )

    except Exception as e:
        print(f"Error streaming video: {e}")
        abort(500, description="Internal Server Error")

@login_required
@video_bp.route("/stream/<int:video_id>", methods=["GET"])
def stream_video_content(video_id: int):
    try:
        req_account_id = current_user.id
        if not req_account_id:
            return jsonify({"error": "No user detected"}), 400

        with create_session() as session:
            video_store = VideoStore(session)
            storage_client = StorageClient()

            # Fetch video details
            video = video_store.get_video(video_id)
            if not video:
                abort(404, description="Video not found")

            # Check authorization
            if req_account_id != video.account_id:
                return jsonify({"error": "Video not found or unauthorized"}), 404

            # Get file name from video metadata
            file_name = video.event.meta.get('file_name')
            if not file_name:
                abort(404, description="Video file not found")

            # Stream the video
            video_stream = storage_client.stream_file(video.account_id, f"processed_{file_name}")
            file_bytes = video_stream.read()
            video_stream.close()

            return send_file(
                io.BytesIO(file_bytes),
                mimetype="video/mp4",
            )

    except Exception as e:
        print(f"Error streaming video: {e}")
        abort(500, description="Internal Server Error")
