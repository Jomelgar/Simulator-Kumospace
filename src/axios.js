import axios from "axios";

// Crear instancia de Axios
const api = axios.create({
  baseURL: "http://localhost:5000", //Con un .env lo cambian
  timeout: 10000,                    // tiempo máximo de espera
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;