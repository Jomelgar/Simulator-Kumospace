import api from "./axiosClient"

export const loginRequest = async (user_name,password) => {
  try {
    const response = await api.post("auth/login",{user_name,password},{withCredentials: true});
    return response;
  } catch (error) {
    throw error;
  }
};