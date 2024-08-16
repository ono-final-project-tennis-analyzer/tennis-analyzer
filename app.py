from flask import Flask
from web.health import health_bp
from web.task import task_bp
from web.file import file_bp
from db.views import account_bp, video_bp

app = Flask(__name__)
app.secret_key = config.APP_SECRET_KEY
CORS(app, supports_credentials=True)
login_manager.init_app(app)
login_manager.login_view = 'accounts.login'

@login_manager.user_loader
def load_user(user_id):
    return Account.get_by_id(user_id)

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"message": "Unauthorized access"}), 401



# Register blueprints
app.register_blueprint(health_bp, url_prefix='/health')
app.register_blueprint(task_bp, url_prefix='/task')
app.register_blueprint(file_bp, url_prefix='/file')
app.register_blueprint(account_bp, url_prefix='/accounts')
app.register_blueprint(video_bp, url_prefix='/videos')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8081)
