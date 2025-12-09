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

export const decodeToken = async () => {
  try {
    const response = await api.post("auth/decode-token",{},{withCredentials: true});
    if(response?.status === 200) return response.data
    return null;
  } catch (error) {
    throw error;
  }
}



export const requestResetCode = async (email) => {
  try {
    const response = await api.post("auth/request-reset", { email }, { withCredentials: true });
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyResetCode = async (email, code) => {
  try {
    const response = await api.post("auth/verify-reset", { email, code }, { withCredentials: true });
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await api.post(
      "auth/reset-password",
      { email, code, newPassword },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
