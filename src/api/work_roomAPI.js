import api from "./axiosClient"

export const getWorkRooms = async(id) =>{
try{
const response = await api.get(`/getWorkRooms/${id}`);
return response;
}catch(error){
    console.error("No se pudo obtener el Work Room: ",error);
    return null;
}
}
export const addWorkRoom = async(values) =>{
try{
const response = await api.post(`/addWorkRoom`,values);
return response;
}catch(error){
    console.error("No se pudo obtener el Work Room: ",error);
    return null;
}
}

export const deleteWorkRoom = async(id) =>{
try{
const response = await api.post(`/deleteWorkRoom/${id}`);
return response;
}catch(error){
    console.error("No se pudo obtener el Work Room: ",error);
    return null;
}
}

export const updateWorkRoom = async(id,values) =>{
try{
const response = await api.put(`/updateWorkRoom/${id}`,values);
return response;
}catch(error){
    console.error("No se pudo obtener el Work Room: ",error);
    return null;
}
}

