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