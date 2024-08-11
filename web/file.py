from flask import Blueprint, jsonify
import os
from storage_client import StorageClient

file_bp = Blueprint('file', __name__)


@file_bp.route('/', methods=['GET'])
def create_file():
   storage = StorageClient()

   file_path = os.path.join("/Users/danikhodos/src/tennis-analyzer/tennis_video_analyzer/video/test_short.mp4")

   storage.upload_file(account_id="12", file_name="test_short.mp4", file_path=file_path)

   return jsonify({"status": "True"}), 200
