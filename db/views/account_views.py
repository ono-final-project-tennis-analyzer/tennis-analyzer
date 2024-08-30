from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, current_user, login_required

from db.stores.account_store import AccountStore
from db.models import with_session

account_bp = Blueprint('accounts', __name__)
with with_session() as session:
    account_store = AccountStore(session)


@account_bp.route('/', methods=['GET', 'POST'])
def manage_accounts():
    if request.method == 'POST':
        data = request.get_json()
        if account_store.get_account_by_email(data['email']):
            return jsonify({"message": "Account already exists"}), 400
        account = account_store.create_account(data['username'], data['email'], data['password'])
        return jsonify({"message": "Account created successfully", "account_id": str(account)}), 201
    else:
        accounts = account_store.list_accounts()
        return jsonify(accounts), 200


@account_bp.route('/<account_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def handle_account(account_id):
    if request.method == 'GET':
        account = account_store.get_account(account_id)
        return jsonify(account), 200
    elif request.method == 'PUT':
        data = request.get_json()
        account_store.update_account(account_id, data)
        return jsonify({"message": "Account updated successfully"}), 200
    elif request.method == 'DELETE':
        account_store.delete_account(account_id)
        return jsonify({"message": "Account deleted successfully"}), 200


@account_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = account_store.login(data['username'], data['password'])
    if user:
        login_user(user)
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 400


@account_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200


@account_bp.route('/@me', methods=['GET'])
def get_current_user():
    if current_user.is_authenticated:
        user_data = {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email
        }
        return jsonify({"message": "Authorized", "user": user_data}), 200
    else:
        return jsonify({"message": "Not Authorized"}), 401
