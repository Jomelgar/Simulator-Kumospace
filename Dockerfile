# Imagen base ligera
FROM node:20-alpine

# Crear carpeta dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json primero (para cache)
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer el puerto del WebSocket (cambia si tu server usa otro)
EXPOSE 3001

# Comando para iniciar la app
CMD ["node", "server.js"]
