from flask import Blueprint, jsonify, request
from flask_restx import Namespace, Resource
from dotenv import load_dotenv
from rocket_client import rocket, getRocketUser

load_dotenv()
channels_bp = Blueprint('channels_bp', __name__)
api_ns = Namespace('channels', description='Canales e IMs')        

@channels_bp.route('/',methods=['POST'])
def createChannel():
    data = request.get_json()
    name= data["name"]

    if not name:
        return jsonify({"error": "Channel name is required"}), 400

    res = rocket.call_api_post(
        "channels.create",
        name=name,
        type='p'  
    ).json()

    rocket.call_api_post("channels.setType", roomId=res.get("channel")["_id"], type="p")
    return jsonify({
        "message": f"Channel created: {name}",
        "channel": res.get("channel")
    })

@channels_bp.route('/', methods=['GET'])
def getChannels():
    res = rocket.channels_list().json()
    if not res.get("success"):
        return jsonify({"error": res}), 400
    channels = res.get("channels", [])
    return jsonify({"channels": channels})

    
