from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__)


@health_bp.route('/health_check', methods=['GET', 'POST'])
def health_check():
    return jsonify({'status': 'OK'}), 200
