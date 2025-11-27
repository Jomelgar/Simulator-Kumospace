import axios from "axios";

// Crear instancia de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_URL || "http://localhost:8000",
  timeout: 10000,                    // tiempo máximo de espera
  headers: {
    "Content-Type": "application/json",
  },
});

export async function login(username, password) {
  const response = await api.post("/login", { username, password });
  if (response.status === 200) {
    const data = { token: response.data.auth_token, userId: response.data.user_id };
    return data;
  }
  else {
    return null;
  }
}

export async function register(username, email, password, name) {
  const response = await api.post("/register", { username, email, password, name });

  if (response.status === 200) {
    return true;
  }
  else {
    return false;
  }
}

export async function createChannel(name, creatorId, creatorToken) {
  const response = await api.post("/channels", { name, creatorId, creatorToken });
  if (response.status === 200) {
    const data = { channelId: response.data.channelId };
    return data;
  }
  return null;
}

export default api;