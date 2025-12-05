const WebSocket = require("ws");
const express = require('express');
const morgan = require("morgan");
const { sendDMWebhook } = require("./externals/chatservice");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const server = app.listen(3003, '0.0.0.0', () => console.log("Servidor listo"));
const wss = new WebSocket.Server({ server });
console.log("WebSocket server en port 3003");

const users = new Map();

wss.on('connection', (ws, req) => {
  const params = new URLSearchParams(req.url.replace('/?', ''));
  const rocketUserId = params.get('userId'); 
  const rocketAuthToken = params.get('authToken');

  if (rocketUserId) {
    users.set(rocketUserId, {ws, userId: rocketUserId, authToken: rocketAuthToken,});

    // 🔹 Enviar mensaje de conexión exitosa
    ws.send(JSON.stringify({
      type: "connection",
      message: "Conexión establecida con chat correctamente",
      userId: rocketUserId
    }));
  }
  console.log(users);
  ws.on('close', () => {
    users.delete(rocketUserId);
    console.log(`Usuario desconectado: ${rocketUserId}`);
  });
});

app.post('/rocketchat-webhook', async (req, res) => {
  try {
    const token = users.get(req.body?.user_id)?.authToken;
    const dmData = await sendDMWebhook(
      {
        channel_id: req.body?.channel_id,
        message_id: req.body?.message_id,
        user_id: req.body?.user_id,
        auth_token: token 
      }
    );

    if (!dmData || !dmData.sentTo) {
      return res.status(500).json({ error: "No se pudo procesar el DM" });
    }

    const client = users.get(dmData.sentTo);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        type: "message",
        message: req.body?.text,
        userId: dmData?.sentTo,
        username: req.body?.user_name
      }));
      console.log(`Mensaje enviado por WS a ${dmData.sentTo}`);
    } else {
      console.log(`Usuario ${dmData.sentTo} no conectado`);
    }


    res.sendStatus(200);

  } catch (err) {
    console.error("Error procesando webhook:", err.message);
    res.status(500).json({ error: err.message });
  }
});
