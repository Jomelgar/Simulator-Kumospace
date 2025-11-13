from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
from flask_restx import Namespace, Resource
import os
from rocketchat_API.rocketchat import RocketChat
from rocket_client import rocket

load_dotenv()

logs_bp = Blueprint('logs_bp', __name__)
api_ns = Namespace('logs', description='Registro y sesiones')

@logs_bp.route('/login',methods=['POST'])
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    rocket_user = RocketChat(username,password,server_url=os.getenv('rocket_url'))
    res = rocket_user.me().json()
    
    if not res.get("success", True):
        return jsonify({"Error": "Check your username or password"}), 400
    print(res)
    return jsonify({
        "user_id": res["_id"],
        "auth_token": rocket_user.headers["X-Auth-Token"],
    }), 200

@logs_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data["username"]
    email = data["email"]
    password = data["password"]
    name= data["name"]

    if not name or not username or not email or not password:
        return jsonify({"error": "Channel name is required"}), 400

    res = rocket.users_create(name=name,username=username, email=email, password=password).json()

    if not res.get("success"):
        return jsonify({"error": res}), 400

    user_id = res["user"]["_id"]
    try:
        rocket.channels_leave(channel="general", user_id=user_id).json()
    except Exception as e:
        pass

    return jsonify({"message": f"Usuario '{username}' creado correctamente."}), 201
    
