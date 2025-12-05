# 🚀 Rocket.Chat API con Flask

Este proyecto implementa un **servidor API REST** en Flask para gestionar usuarios, canales y mensajes directos (IMs) en **Rocket.Chat**, utilizando la librería [`rocketchat_API`](https://pypi.org/project/rocketchat-API/). Incluye **Swagger UI** para documentación y pruebas de endpoints.

---

## 🔹 Tecnologías utilizadas

- **Python 3.x**  
- **Flask** (framework web)  
- **Flask-RESTX** (Swagger/OpenAPI)  
- **rocketchat_API** (cliente Python para Rocket.Chat)  
- **dotenv** (gestión de variables de entorno)  
- **Rocket.Chat** (servidor de chat open-source)  

---

## 🔹 Instalación

1. Clonar el repositorio:
```bash
git clone <tu-repo-url>
cd rocket-chat-api
```
2. Crear y activar entorno virtual (opcional pero recomendado):

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```
3. Instalar dependencias:
```bash
pip install -r requirements.txt
```
4. Crear archivo .env con las credenciales del admin de Rocket.Chat:
```env
ROCKET_URL=http://rocketchat:3000
ROCKET_USERNAME=user
ROCKET_PASSWORD=pass123
PORT=8000
```

---
## 🔹 Estructura general
```bash
.
├── app.py               # Archivo principal para iniciar Flask
├── rocket_client.py     # Conexión reusable al admin de Rocket.Chat
├── routes/
│   ├── logs.py          # Endpoints de register/login de usuarios
│   └── channels.py      # Endpoints de canales e IMs
├── .env                 # Variables de entorno (Rocket.Chat admin)
└── requirements.txt
```

### Comando para que funcione mongodb con replicaset:
```bash
docker exec -it <contenedor_de mongo> mongosh
rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "localhost:27017" }]
})
rs.status()
cfg = rs.conf()
cfg.members[0].host = "mongodb:27017"
rs.reconfig(cfg, {force: true})

```
Ya con eso funciona gente

### Config dentro de RocketChat:
- Como admin vas a espacio de trabajo -> configuracion -> general en Restringir acceso dentro de cualquier iframe lo para el iframe del core
-  Como admin vas a espacio de trabajo -> configuracion -> cuenta -> Autenticación de dos factores en Habilitar la autenticación de dos factores lo deshabilitas
- Como admin vas a espacio de trabajo -> configuracion -> diseño -> css personalizado y pones el .css de aca
- Como admin vas a espacio de trabajo -> integraciones -> creas un webhook saliente
  nombre: cualquiera
  channel: all_direct_messages
  url: url_websocket_de_notificaciones/rocketchat-webhook
  publicar como: el admin
  script habilitado: si
  puse dentro de script: 
  {
    text: message.msg,
    fromUserName: user.username,
    fromUserId: user._id,
    targetUserId: message.u._id 
  } 
  pero creo que no es necesario