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
    rocket_user = RocketChat(username,password,server_url=os.getenv('ROCKET_URL'))
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
    
@logs_bp.route('/change-email', methods=['POST'])
def change_email():
    try:
        data = request.get_json()
        user_id = data["userId"]
        new_email = data["newEmail"]

        if not user_id or not new_email:
            return jsonify({"error": "userId y newEmail son requeridos"}), 400
        
        resp = rocket.users_update(
            user_id=user_id,
            email = new_email
        ).json()

        if resp.get("success"):
            return jsonify({"message": "Email actualizado correctamente", "data": resp}), 200
        else:
            return jsonify({"error": "Rocket.Chat no pudo actualizar el email", "details": resp}), 500

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Error interno", "details": str(e)}), 500

@logs_bp.route('/change-password', methods=['POST'])
def change_password():
    try:
        data = request.get_json()
        user_id = data["userId"]
        username = data["username"]
        new_password = data["newPassword"]

        if not user_id or not new_password or not username:
            return jsonify({"error": "userId, username y newPassword son requeridos"}), 400

        resp = rocket.users_update(
            user_id=user_id,
            password= new_password
        ).json()

        if not resp.get("success"):
            return jsonify({
                "error": "Rocket.Chat no pudo cambiar la contraseña",
                "details": resp
            }), 500

        rocket_user = RocketChat(username,password=new_password,server_url=os.getenv('ROCKET_URL'))
        login_resp = rocket_user.me().json()
        if not login_resp.get("success", True):
            return jsonify({
                "error": "La contraseña se actualizó, pero no fue posible generar un nuevo token",
                "details": login_resp
            }), 500

        new_token = rocket_user.headers["X-Auth-Token"]
        new_user_id = login_resp["_id"]

        # 3. Respuesta final
        return jsonify({
            "message": "Contraseña actualizada correctamente",
            "authToken": new_token,
            "userId": new_user_id
        }), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Error interno", "details": str(e)}), 500
