import api from "./axiosClient"

export const getHive = async() =>{
try{
const response = await api.get(`hive/getHives/`,{withCredentials:true});
return response;
}catch(error){
    console.error("Error al obtener hive: ",error);
    return null;
}
}

export const createHive = async(hive_name,size) =>{
try{
const response = await api.post(`hive/createHive/`,{hive_name,size},{withCredentials:true});
return response;
}catch(error){
    console.error("Error al obtener hive: ",error);
    return null;
}
}

export const inviteToHive = async(id,values) =>{
try{
const response = await api.post(`/invitedToHive/${id}`,values,{withCredentials:true});
return response;
}catch(error){
    console.error("Error al obtener hive: ",error);
    return null;
}
}

export const getPrivateRooms = async(id_hive) =>{
try{
const response = await api.get(`/getPrivateRooms/${id_hive}`,{withCredentials:true});
return response;
}catch(error){
    console.error("Error al obtener hive: ",error);
    return null;
}
}

export const updatePrivateRoom = async(id,values) =>{
try{
const response = await api.put(`/updatePrivateRoom/${id}`,values,{withCredentials:true});
return response;
}catch(error){
    console.error("Error al obtener hive: ",error);
    return null;
}
}

export const updateHive = async(id_hive,image,description) => {
    try{
        const formData = new FormData();
        formData.append("image", image);
        formData.append("description", description);
        const response = await api.post(`hive/updateHive/${id_hive}`,formData,
            {withCredentials:true,
                headers: { "Content-Type": "multipart/form-data" },
        });
    }catch(error)
    {
        console.error("Error al obtener hive: ",error);
        return null;
    }
}

export const generateInviteCode = async(id_hive) => {
    try{
        const response = await api.post(`hive/generateInviteCode/${id_hive}`, {}, {withCredentials:true});
        return response;
    }catch(error){
        console.error("Error al generar codigo de invitacion: ",error);
        return null;
    }
}

export const joinByCode = async(invite_code, room_name) => {
    try{
        const response = await api.post(`hive/joinByCode`, {invite_code, room_name}, {withCredentials:true});
        return response;
    }catch(error){
        console.error("Error al unirse por codigo de invitacion: ",error);
        return null;
    }
}

export const verifyHiveForUser = async(id_hive) => {
    try{
        const response = await api.get(`hive/verifyHiveForUser/${id_hive}`,  {withCredentials:true});
        return response.data;
    }catch(error){
        console.error("Error al encontrar el hive del user: ",error);
        return {exit: true};
    }
}