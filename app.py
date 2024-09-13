from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from flask import jsonify

from db.models import with_session
from db.views.events_view import event_bp
from db.views import account_bp
import config
from db.stores.account_store import AccountStore
from db.views.file_view import file_bp

login_manager = LoginManager()

with with_session() as session:
    account_store = AccountStore(session)
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024 * 1024
app.secret_key = config.APP_SECRET_KEY
CORS(app, supports_credentials=True)
login_manager.init_app(app)
login_manager.login_view = 'accounts.login'


@login_manager.user_loader
def load_user(user_id):
    return account_store.get_account(user_id)


@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"message": "Unauthorized access"}), 401


# Register blueprints
app.register_blueprint(account_bp, url_prefix='/accounts')
app.register_blueprint(event_bp)
app.register_blueprint(file_bp, url_prefix='/file')
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8081)
