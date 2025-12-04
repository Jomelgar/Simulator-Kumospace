import api from "./axiosClient"

export const addUser = async(user_name,first_name,last_name,email,password) =>{
try{
const response = await api.post(`/user/addUser`,{
        user_name:user_name,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password
    });
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
const response = await api.get(`/user/getUser/${id}`,{withCredentials:true});
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

export const updateUser = async(id, userData) =>{
try{
const response = await api.put(`/api/user/updateUser/${id}`, userData, {withCredentials:true});
return response;
}catch(error){
    console.error("Error al actualizar el usuario: ",error);
    return null;
}
}
