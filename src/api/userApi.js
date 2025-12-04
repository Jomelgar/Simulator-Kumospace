import api from "./axiosClient"

export const addUser = async(values) =>{
try{
const response = await api.post(`/addUser`,values);
return response;
}catch(error){
    console.error("Error al crear el usuario: ",error);
    return null;
}

}

export const getAllUsers = async() =>{
try{
const response = await api.get(`/getUsers`,{withCredentials:true});
return response;
}catch(error){
    console.error("Error al obtener los usuarios: ",error);
    return null;
}
}

export const getUser = async(id) =>{
try{
const response = await api.get(`/getUser/${id}`,{withCredentials:true});
return response;
}catch(error){
    console.error("Error al obtener los usuarios: ",error);
    return null;
}
}

export const inviteUser = async(values) =>{
try{
const response = await api.post(`/inviteUser/${values.email}`,values,{withCredentials:true});
return response;
}catch(error){
    console.error("Error al obtener los usuarios: ",error);
    return null;
}
}