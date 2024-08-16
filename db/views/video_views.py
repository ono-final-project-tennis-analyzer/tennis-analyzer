import os

from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

from services import VideoService

video_bp = Blueprint('videos', __name__)
video_service = VideoService()


@video_bp.route('/<account_id>/videos', methods=['GET'])
def list_videos(account_id):
    videos = video_service.get_videos(ObjectId(account_id))
    return jsonify(videos), 200


@video_bp.route('/<account_id>/videos/<video_id>', methods=['GET'])
def get_video(account_id, video_id):
    video = video_service.get_video(ObjectId(account_id), video_id)
    return jsonify(video), 200


@video_bp.route('/<account_id>/videos', methods=['POST'])
def upload_video(account_id):
    account_id = ObjectId(account_id)
    file = request.files['file']
    if file:
        file_path = os.path.join('/tmp', file.filename)
        file.save(file_path)
        video = video_service.save_video(account_id, file_path, file.filename)
        os.remove(file_path)
        return jsonify({"message": "Video uploaded successfully", "video": video}), 201
    return jsonify({"message": "No file provided"}), 400


@video_bp.route('/<account_id>/videos/<video_id>', methods=['DELETE'])
def delete_video(account_id, video_id):
    video_service.delete_video(ObjectId(account_id), video_id)
    return jsonify({"message": "Video deleted successfully"}), 200
