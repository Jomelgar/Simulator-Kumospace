import api from "./axiosClient"

export const loginRequest = async (values) => {
  try {
    const response = await api.post("/login",values,{withCredentials: true});
    return response;
  } catch (error) {
    throw error;
  }
};