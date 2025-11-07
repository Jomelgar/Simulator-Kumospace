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
rocket_url=http://localhost:3000
rocket_id=<ADMIN_USER_ID>
rocket_token=<ADMIN_AUTH_TOKEN>
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

