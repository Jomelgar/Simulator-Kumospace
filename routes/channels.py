from flask import Blueprint, jsonify, request
from flask_restx import Namespace
from dotenv import load_dotenv
from rocket_client import rocket, getRocketUser

load_dotenv()
channels_bp = Blueprint('channels_bp', __name__)
api_ns = Namespace('channels', description='Canales e IMs')


# ---------------------------
# Crear canal público o privado
# ---------------------------
@channels_bp.route('/', methods=['POST'])
def createChannel():
    data = request.get_json()
    name = data.get("name")
    creatorId = data.get("creatorId")
    creatorToken = data.get("creatorToken")
    private = data.get("private", True)  # Por defecto privado

    if not name or not creatorId or not creatorToken:
        return jsonify({"error": "Fields are missing."}), 400

    rocket_session = getRocketUser(creatorId, creatorToken)

    # Crear canal tipo 'c' inicialmente
    res = rocket_session.call_api_post(
        "channels.create",
        name=name,
        type='c'
    ).json()

    if not res.get("success"):
        return jsonify({"error": res}), 400

    channel_id = res["channel"]["_id"]

    # Si el canal debe ser privado, cambiar tipo
    if private:
        type_res = rocket_session.call_api_post(
            "channels.setType",
            roomId=channel_id,
            type="p"
        ).json()
        if not type_res.get("success"):
            return jsonify({"error": type_res}), 400

    return jsonify({
        "message": f"Channel created: {name}",
        "channelId": channel_id,
        "private": private
    })


# ---------------------------
# Listar canales del usuario (incluye privados a los que pertenece)
# ---------------------------
@channels_bp.route('/list', methods=['POST'])
def getChannels():
    data = request.get_json()
    userId = data.get("userId")
    token = data.get("token")

    if not userId or not token:
        return jsonify({"error": "Fields are missing."}), 400

    user_session = getRocketUser(userId, token)
    res = user_session.channels_list().json()

    if not res.get("success"):
        return jsonify({"error": res}), 400

    channels = res.get("channels", [])
    return jsonify({"channels": channels})


# ---------------------------
# TODO: Invitar usuarios a un canal
# ---------------------------
@channels_bp.route('/add', methods=['POST'])
def addUserToChannel():
    data = request.get_json()
    channelId = data.get("channelId")
    userId = data.get("userId")
    ownerId = data.get("ownerId")
    ownerToken = data.get("ownerToken")

    if not channelId or not userId or not ownerToken or not ownerId:
        return jsonify({"error": "Fields are missing."}), 400

    # Sesión del owner
    owner_session = getRocketUser(ownerId, ownerToken)
    res = owner_session.call_api_post(
        "channels.invite",
        roomId=channelId,
        userId=userId
    ).json()

    if not res.get("success"):
        return jsonify({"error": res}), 400

    return jsonify({
        "message": "User added successfully",
        "roomId": channelId,
        "addedUser": userId
    })
