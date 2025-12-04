import api from "./axiosClient"

export const getWorkRooms = async(id) =>{
try{
const response = await api.get(`/getWorkRooms/${id}`,{withCredentials:true});
return response;
}catch(error){
    console.error("No se pudo obtener el Work Room: ",error);
    return null;
}
}
export const addWorkRoom = async(values) =>{
try{
const response = await api.post(`/addWorkRoom`,values,{withCredentials:true});
return response;
}catch(error){
    console.error("No se pudo obtener el Work Room: ",error);
    return null;
}
}

export const deleteWorkRoom = async(id) =>{
try{
const response = await api.post(`/deleteWorkRoom/${id}`,{withCredentials:true});
return response;
}catch(error){
    console.error("No se pudo obtener el Work Room: ",error);
    return null;
}
}

export const updateWorkRoom = async(id,values) =>{
try{
const response = await api.put(`/updateWorkRoom/${id}`,values,{withCredentials:true});
return response;
}catch(error){
    console.error("No se pudo obtener el Work Room: ",error);
    return null;
}
}

