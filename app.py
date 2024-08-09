from flask import Flask
from web.health import health_bp
from web.task import task_bp

app = Flask(__name__)

# Register blueprints
app.register_blueprint(health_bp, url_prefix='/health')
app.register_blueprint(task_bp, url_prefix='/task')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8081)
