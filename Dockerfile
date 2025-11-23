# Dockerfile
# Usar la imagen oficial de Python
FROM python:3.12-slim

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos necesarios al contenedor
COPY requirements.txt .
COPY app.py .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Exponer el puerto que usará tu app
EXPOSE 8000

# Comando para ejecutar la app
CMD ["python", "app.py"]
