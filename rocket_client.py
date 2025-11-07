
from rocketchat_API.rocketchat import RocketChat
from dotenv import load_dotenv
import os


load_dotenv()

rocket = RocketChat(
    user_id=os.getenv('rocket_id'),
    auth_token=os.getenv('rocket_token'),
    server_url=os.getenv('rocket_url')
)


check = rocket.me().json()
if not check.get("_id"):
    print("❌ Error: No se pudo autenticar el usuario administrador de Rocket.Chat.")
else:
    print(f"✅ Admin conectado correctamente como: {check.get('username')}")

def getRocketUser(user_id, token):
    rocketUser = RocketChat(user_id=user_id,auth_token=token,server_url=os.getenv('rocket_url'))
    res = rocketUser.me().json()
    if not res.get("success", True):
        return None
    else:
        return rocketUser
