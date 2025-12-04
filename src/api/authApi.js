import api from "./axiosClient"

export const loginRequest = async (user_name, password) => {
  try {
    const response = await api.post("api/auth/login", { user_name, password }, { withCredentials: true });
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkRequest = async () => {
  try {
    const response = await api.get("api/auth/check", { withCredentials: true });
    return response;
  } catch (error) {
    throw error;
  }
}
