const WebSocket = require("ws");

const server=new WebSocket.Server({port: 3001});
console.log("Servidor WebSocket en puerto 3001");

let users = [
  {
    id: "1",
    name: "María González",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    status: "online",
    currentLocation: "shared-1",
    locationType: "shared"
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    status: "busy",
    currentLocation: "shared-1",
    locationType: "shared"
  },
  {
    id: "3",
    name: "Ana Martínez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    status: "online",
    currentLocation: "shared-2",
    locationType: "shared"
  },
  {
    id: "4",
    name: "Luis Pérez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis",
    status: "away",
    currentLocation: "private-4",
    locationType: "private"
  },
  {
    id: 'current-user',
    name: 'Tú',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
    status: 'online',
    currentLocation: 'private-current',
    locationType: 'private'
  }
];

let workspaces = [
  { id: "shared-1", name: "Sala de Desarrollo", type: "shared", isLocked: false, maxUsers: 8 },
  { id: "shared-2", name: "Sala de Diseño", type: "shared", isLocked: false, maxUsers: 6 },
  { id: "shared-3", name: "Sala de Reuniones", type: "shared", isLocked: true, maxUsers: 4 },
  { id: "private-current", name: "Mi Oficina", type: "private", ownerId: "current-user", isLocked: false },
  { id: "private-1", name: "Oficina de María", type: "private", ownerId: "1", isLocked: false },
  { id: "private-2", name: "Oficina de Carlos", type: "private", ownerId: "2", isLocked: true },
  { id: "private-3", name: "Oficina de Ana", type: "private", ownerId: "3", isLocked: false },
  { id: "private-4", name: "Oficina de Luis", type: "private", ownerId: "4", isLocked: true }
];

server.on('connection', (ws) =>{

    ws.send(JSON.stringify({type: "init", users, workspaces}));

    ws.on('message', (message) =>{
        const data = JSON.parse(message.toString());

        switch(data.type){
            case "enterWorkspace":
                handleEnterWorkspace(data.userId, data.workspaceId);
                break;
            case "lockWorkspace":
                handleToggleLock(data.workspaceId);
                break;
            case "createWorkSpace":
                handleCreateSharedWorkspace(data.workspaceMaxUsers);
                break;
            case "deleteWorkSpace":
                handleDeleteSharedWorkspace(data.userId, data.workspaceId);
                break;
            default:
                console.log("Servidor fue a default");
                break;
        }
        broadcast();
    });

    ws.on('close', ()=>{
        console.log("Cliente desconectado");
    })
});

function handleEnterWorkspace(userId, workspaceId){
    const currentUser = users.find(u=>u.id === userId);
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (!currentUser||!workspace) return;

    // No permitir entrar a oficinas privadas bloqueadas de otros usuarios
    if (workspace.type === 'private' && workspace.isLocked && workspace.ownerId !== currentUser.id) {
        return;
    }

    // Para oficinas privadas: verificar si el owner está presente y no ocupado
    if (workspace.type === 'private' && workspace.ownerId !== userId) {
        const owner = users.find(u => u.id === workspace.ownerId);
        if (!owner) return;
        
        // No permitir entrar si el owner no está en su oficina
        if (owner.currentLocation !== workspaceId) return; 
        
        // No permitir entrar si el owner está ocupado
        if (owner.status === 'busy') return; 
    }

    currentUser.currentLocation = workspaceId;
    currentUser.locationType = workspace.type;
};

const handleToggleLock = (workspaceId) => {
    const wsToToggleLock = workspaces.find(w => w.id === workspaceId);
    if(!wsToToggleLock) return;
    wsToToggleLock.isLocked=!wsToToggleLock.isLocked;
};

const handleCreateSharedWorkspace = (newWorkspaceMaxUsers) => {
    const maxUsers = parseInt(newWorkspaceMaxUsers);
    if (isNaN(maxUsers) || maxUsers < 1) return;
    
    // Generar nombre automático
    const sharedWorkspaces = workspaces.filter(w => w.type === 'shared');
    const sharedCount = sharedWorkspaces.length + 1;
    
    const newWorkspace = {
      id: `shared-${Date.now()}`,
      name: `Sala Compartida ${sharedCount}`,
      type: 'shared',
      isLocked: false,
      maxUsers: maxUsers
    };
    
    workspaces.push(newWorkspace);
};

const handleDeleteSharedWorkspace = (userId, workspaceId) => {
    const currentUser = users.find(u=>u.id === userId);
    if (currentUser.currentLocation === workspaceId) return;
    
    // Mover usuarios que estén en ese espacio a su oficina privada
    users = users.map(user => {
      if (user.currentLocation === workspaceId) {
        const userPrivateOffice = workspaces.find(w => w.ownerId === user.id && w.type === 'private');
        return {
          ...user,
          currentLocation: userPrivateOffice.id,
          locationType: 'private'
        };
      }
      return user;
    });
    
    workspaces = workspaces.filter(w => w.id !== workspaceId)
};

function broadcast(){
    const payload=JSON.stringify({type: "update", users, workspaces});

    server.clients.forEach((client)=>{
        if(client.readyState===WebSocket.OPEN){
            client.send(payload); 
        }
    });
}