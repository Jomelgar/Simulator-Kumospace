from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
from flask_restx import Namespace, Resource
from rocket_client import rocket, getRocketUser

load_dotenv()
messages_bp = Blueprint('messages_bp',__name__)
api_ns = Namespace('messages', description='Envio de mensajes')

@messages_bp.route('/im/send/',methods=['POST'])
def sendDirectMessage():
    data = request.get_json()
    auth_token = data['auth_token']
    user_id = data['user_id']
    text = data["text"]
    to_user = data["to_user"]

    if not user_id or not auth_token or not to_user or not text:
        return jsonify({"error": "Some variables that are required wasn't sended. "}),400
    
    rocket_user = getRocketUser(user_id,auth_token)

    if not rocket_user:
        return jsonify({"error": "Invalid user_id or auth_token"}), 401

    me = rocket_user.me().json()
    my_username = me.get("username")    
    if my_username.lower() == to_user.lower():
        return jsonify({"error": "You cannot send a message to yourself"}), 400 
    
    im_res = rocket_user.im_create(to_user).json()
    if not im_res.get("success"):
        return jsonify({"error": im_res}), 400

    room_id = im_res["room"]["_id"]
    res = rocket_user.chat_post_message(text=text, channel=room_id).json()

    if not res.get("success"):
        return jsonify({"error": res}), 400

    return jsonify({"message": f"Message sent to {to_user}", "res": res})

#  TODO: Toca probar este de aquí
@messages_bp.route('/channel/send',methods=['POST'])
def sendChannels():
    data = request.get_json()
    auth_token = data['auth_token']
    user_id = data['user_id']
    text = data["text"]
    channel = data["channel"]

    if not user_id or not auth_token or not channel or not text:
        return jsonify({"error": "Some variables that are required wasn't sended. "}),400
    
    rocket_user = getRocketUser(user_id,auth_token)
    if not rocket_user:
        return jsonify({"error": "Invalid user_id or auth_token"}), 401

    res = rocket.chat_post_message(text="Hola", channel=channel).json()
    if not res.get("success"):
        return jsonify({"error": res}), 400

    return jsonify({"message": f"Message sent to {channel}", "res": res})

@messages_bp.route('/dm-webhook', methods=['POST'])
def rocket_dm_webhook():
    data = request.get_json()

    print("Webhook recibido:", data)

    room_id = data["channel_id"]
    message_id = data["message_id"]
    sender_id = data["user_id"]
    auth_token = data["auth_token"]

    if not room_id or not message_id or not sender_id:
        return jsonify({"error": "Missing required fields"}), 400

    rocket_client = getRocketUser(sender_id,auth_token)

    members_res = rocket_client.call_api_get(
        "im.members",
        roomId=room_id
    ).json()

    if not members_res.get("success"):
        return jsonify({"error": "Failed members", "detail": members_res}), 401

    members = members_res.get("members", [])

    if len(members) != 2:
        return jsonify({"error": "This is not a DM"}), 402

    receiver = next((u for u in members if u["_id"] != sender_id), None)

    if not receiver:
        return jsonify({"error": "Receiver not found"}), 403

    receiver_id = receiver["_id"]

    msg_res = rocket_client.call_api_get(
        "chat.getMessage",
        msgId=message_id
    ).json()

    if not msg_res.get("success"):
        return jsonify({"error": "Failed to get message", "detail": msg_res}), 404

    return jsonify({"success": True, "sentTo": receiver_id})

@messages_bp.route('/getUserRID', methods=['POST'])
def get_user_rid():
    data = request.get_json()

    user_id = data['user_id']
    auth_token = data['auth_token']
    for_user = data['for_user']

    if not user_id or not auth_token or not for_user:
        return jsonify({"error": "Missing required fields"}), 400
    
    rocket_user = getRocketUser(user_id, auth_token)
    if not rocket_user:
        return jsonify({"error": "Invalid user_id or auth_token"}), 401
    
    im_res = rocket_user.im_create(for_user).json()

    if not im_res.get("success"):
        return jsonify({"error": "Failed to create/get DM", "detail": im_res}), 400

    rid = im_res["room"]["_id"]

    return jsonify({
        "success": True,
        "rid": rid,
        "username": for_user
    })
