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
