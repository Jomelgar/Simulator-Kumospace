FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install concurrently
COPY . .
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003
CMD [ "npm","start" ]
