import api from "./axiosClient"

export const loginRequest = async (values) => {
  try {
    const response = await api.post("/login",values);
    return response;
  } catch (error) {
    throw error;
  }
};