import api from "./axiosClient"

export const getNews = async() =>{
    try{
        const response = await api.get(`notification/newCount`,{withCredentials:true});
        return response.data;
    }catch(error){
        console.error("Error al obtener notification: ",error);
        return null;
    }
}

export const getNotificationUser = async() =>{
    try{
        const response = await api.get(`notification/user`,{withCredentials:true});
        return response.data;
    }catch(error){
        console.error("Error al obtener notification: ",error);
        return null;
    }
}

export const readNotification = async(id_notification) =>{
    try{
        const response = await api.put(`notification/read/${id_notification}`,{},{withCredentials:true});
        return response.data;
    }catch(error){
        console.error("Error al obtener notification: ",error);
        return null;
    }
}