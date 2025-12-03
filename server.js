const WebSocket = require("ws");
const axios = require("axios");

let users = [
  {
    id_user: 1,
    user_name: 'Tú',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
    status: 'online',
    currentLocation: 1,
    locationType: 'private'
  }
];

let private_rooms = [];
let work_rooms = [];
let server;

async function getRooms(id_hive) {
  if(!id_hive){
    return;
  }

  try{
    const priv = await axios.get(`http://localhost:3001/api/hive/getPrivateRooms/${id_hive}`);
    private_rooms = priv.data;
    const work = await axios.get(`http://localhost:3001/api/work_room/getWorkRooms/${id_hive}`);
    work_rooms = work.data;
  }catch(err){
    console.log(err.message);
  }
}
(async () => {

  server=new WebSocket.Server({port: 3002});
  console.log("WebSocket server en port 3002");

  server.on('connection', (ws) => {

    ws.hiveID = null;

    ws.on('message', async(message) =>{
      const data = JSON.parse(message.toString());
      switch(data.type){
        case "setHive":
            ws.hiveID = parseInt(data.id_hive);
          break;
        case "enterWorkspace":
          handleEnterWorkspace(parseInt(data.userId), parseInt(data.workspaceId), data.room);
          break;
        case "lockWorkspace":
          await handleToggleLock(parseInt(data.workspaceId));
          break;
        case "createWorkSpace":
          await handleCreateSharedWorkspace(parseInt(ws.hiveID), data.workspaceMaxUsers);
          break;
        case "deleteWorkSpace":
          await handleDeleteSharedWorkspace(parseInt(data.userId), parseInt(data.workspaceId));
          break;
        default:
          console.log("Servidor fue a default");
          break;
        }
        broadcast(ws.hiveID);
    });

    ws.on('close', ()=>{
        console.log("Cliente desconectado");
    })
  });
})();

function handleEnterWorkspace(userId, workspaceId, type){
    const currentUser = users.find(u=>u.id_user === userId);
    let workspace;
    if(type === 'private'){
      workspace = private_rooms.find(w => w.id_private_room === workspaceId);
    }else{
      workspace = work_rooms.find(w => w.id_room === workspaceId);
    }
    if (!currentUser||!workspace) return;

    if (type === 'private' && workspace.is_locked && workspace.id_user !== currentUser.id) {
      return;
    }

    // Para oficinas privadas: verificar si el owner está presente y no ocupado
    if (type === 'private' && workspace.id_user !== userId) {
        const owner = users.find(u => u.id_user === workspace.id_user);
        if (!owner) return;
        
        // No permitir entrar si el owner no está en su oficina
        if (owner.currentLocation !== workspaceId) return; 
        
        // No permitir entrar si el owner está ocupado
        if (owner.status === 'busy') return; 
    }

    currentUser.currentLocation = workspaceId;
    currentUser.locationType = type;
};

async function handleToggleLock(workspaceId){
    let wsToToggleLock = work_rooms.find(w => w.id_room === workspaceId);
    if(!wsToToggleLock){
      wsToToggleLock = private_rooms.find(w => w.id_private_room === workspaceId);
      if(wsToToggleLock){
        await axios.put(`http://localhost:3001/api/hive/updatePrivateRoom/${workspaceId}`,
        { room_name: wsToToggleLock.room_name, is_locked: !wsToToggleLock.is_locked });
      }
      return;
    }
    await axios.put(`http://localhost:3001/api/work_room/updateWorkRoom/${workspaceId}`,
      { room_name: wsToToggleLock.room_name, max_users: wsToToggleLock.max_users, is_locked: !wsToToggleLock.is_locked });
};

async function handleCreateSharedWorkspace(hiveID, newWorkspaceMaxUsers){
    const maxUsers = parseInt(newWorkspaceMaxUsers);
    if (isNaN(maxUsers) || maxUsers < 1) return;
    
    await axios.post(`http://localhost:3001/api/work_room/addWorkRoom`,
      { id_hive: hiveID, room_name: 'New-Room', max_users: newWorkspaceMaxUsers});
};

async function handleDeleteSharedWorkspace(userId, workspaceId){
    const currentUser = users.find(u=>u.id_user === userId);
    if (currentUser.currentLocation === workspaceId) return;
    
    users = users.map(user => {
      if (user.currentLocation === workspaceId) {
        const userPrivateOffice = private_rooms.find(p => p.id_user === user.id_user);
        return {
          ...user,
          currentLocation: userPrivateOffice.id_private_room,
          locationType: 'private'
        };
      }
      return user;
    });
    
    await axios.delete(`http://localhost:3001/api/work_room/deleteWorkRoom/${workspaceId}`);
};

async function broadcast(id_hive){
  await getRooms(id_hive);

  const payload=JSON.stringify({type: "update", users, private_rooms, work_rooms});

  server.clients.forEach((client)=>{
      if(client.readyState===WebSocket.OPEN){
          client.send(payload); 
      }
  });
}