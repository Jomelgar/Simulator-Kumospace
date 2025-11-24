# Imagen base ligera
FROM node:20-alpine

# Crear carpeta dentro del contenedor
WORKDIR /app

# Copiar el resto del código
COPY . .

# Instalar dependencias
RUN npm install


# Exponer el puerto del WebSocket (cambia si tu server usa otro)
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "run","dev"]
