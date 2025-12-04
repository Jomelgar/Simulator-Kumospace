import api from "./axiosClient"

export const loginRequest = async (user_name, password) => {
  try {
    const response = await api.post("auth/login", { user_name, password }, { withCredentials: true });
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkRequest = async () => {
  try {
    const response = await api.get("auth/check", { withCredentials: true });
    return response;
  } catch (error) {
    throw error;
  }
}

export const logoutRequest = async () => 
{
  try{
    const response = await api.post("auth/logout",{},{withCredentials: true});
    return true;
  }catch(error)
  {
    throw error;
  }
}