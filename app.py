from flask import Flask
from flask_restx import Api
from routes.logs import logs_bp
from routes.channels import channels_bp
from flask_cors import CORS
from routes.messages import messages_bp
from routes.channels import api_ns as channels_ns
from routes.logs import api_ns as logs_ns
from routes.messages import api_ns as messages_ns

app = Flask(__name__)
CORS(app)
api = Api(app, version="1.0", title="RocketChat API",
          description="API para manejar canales e IMs con Rocket.Chat",
          doc="/docs")

# Registrar namespaces
api.add_namespace(logs_ns, path='/')
api.add_namespace(channels_ns, path='/channels')
api.add_namespace(messages_ns, path='/messages')

app.register_blueprint(logs_bp, url_prefix='/')
app.register_blueprint(channels_bp, url_prefix='/channels')
app.register_blueprint(messages_bp, url_prefix='/messages')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
