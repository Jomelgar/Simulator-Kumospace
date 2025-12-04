import api from "./axiosClient"

export const getHive = async(id) =>{
try{
const response = await api.get(`/getHives/${id}`);
return response;
}catch(error){
    console.error("Error al obtener hive: ",error);
    return null;
}
}

export const createHive = async(id) =>{
try{
const response = await api.post(`/createHive/${id}`);
return response;
}catch(error){
    console.error("Error al obtener hive: ",error);
    return null;
}
}

export const inviteToHive = async(id,values) =>{
try{
const response = await api.post(`/invitedToHive/${id}`,values);
return response;
}catch(error){
    console.error("Error al obtener hive: ",error);
    return null;
}
}

export const getPrivateRooms = async(id_hive) =>{
try{
const response = await api.get(`/getPrivateRooms/${id_hive}`);
return response;
}catch(error){
    console.error("Error al obtener hive: ",error);
    return null;
}
}

export const updatePrivateRoom = async(id,values) =>{
try{
const response = await api.put(`/updatePrivateRoom/${id}`,values);
return response;
}catch(error){
    console.error("Error al obtener hive: ",error);
    return null;
}
}