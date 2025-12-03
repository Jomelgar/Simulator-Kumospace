const axios = require("axios");

// Crear instancia de Axios
const api = axios.create({
  baseURL: process.env.CHAT_API_URL || "http://localhost:8000",
  timeout: 10000,                    
  headers: {
    "Content-Type": "application/json",
  },
});

async function login(username, password) {
  const response = await api.post("/login", { username, password });
  if (response.status === 200) {
    const data = { token: response.data.auth_token, userId: response.data.user_id };
    return data;
  }
  else {
    return null;
  }
}

async function register(username, email, password, name) {
  const response = await api.post("/register", { username, email, password, name });

  if (response.status === 200 || response.status === 201) {
    return true;
  }
  else {
    return false;
  }
}

async function createChannel(name, creatorId, creatorToken) {
  const response = await api.post("/channels", { name, creatorId, creatorToken });
  if (response.status === 200) {
    const data = { channelId: response.data.channelId };
    return data;
  }
  return null;
}

module.exports = {
  login,
  register,
  createChannel,
  api
};