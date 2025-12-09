const WebSocket = require("ws");
const axios = require("axios");
const {getPrivateRoomsService, getPrivateRoomOfUser, updatePrivateRoomService} = require("./services/hiveService");
const {getWorkRoomsService,addWorkRoomService,deleteWorkRoomService,updateWorkRoomService} = require("./services/work_roomService");

let hive = {};
let server;

async function getRooms(id_hive) {
  try {
    const priv = await getPrivateRoomsService(id_hive);
    hive[id_hive].private_rooms = priv;
    const work = await getWorkRoomsService(id_hive);
    hive[id_hive].work_rooms = work;
  } catch (err) {
    console.log(err.message);
  }
}

(async () => {
  server = new WebSocket.Server({ port: 3002 });
  console.log("WebSocket server en port 3002");

  server.on("connection", (ws) => {
    ws.hiveID = null;
    ws.currentUserID = null;

    ws.on("message", async (message) => {
      const data = JSON.parse(message.toString());
      switch (data.type) {
        case "setHive":
          ws.hiveID = parseInt(data.id_hive);
          ws.currentUserID = data.user.id_user;
          if(!hive[data.id_hive]){
            hive[data.id_hive] = {
              users: [],
              private_rooms: [],
              work_rooms: []
            }
          }
          const newUser = data.user;
          const thisHive = hive[data.id_hive]
          const found = thisHive.users.find(u => u.id_user === newUser.id_user);
          if(!found){
            const privateRoom = await getPrivateRoomOfUser(ws.hiveID,ws.currentUserID);
            const privateRoomID = privateRoom.id_private_room;
            thisHive.users.push({...newUser, 
              currentLocation: privateRoomID, 
              locationType: "private", 
              status: "online"});
          }
          break;
        case "enterWorkspace":
          handleEnterWorkspace(
            ws.hiveID,
            parseInt(data.userId),
            parseInt(data.workspaceId),
            data.room
          );
          break;
        case "lockWorkspace":
          await handleToggleLock(
            ws.hiveID, 
            parseInt(data.workspaceId));
          break;
        case "createWorkSpace":
          await handleCreateSharedWorkspace(
            parseInt(ws.hiveID),
            data.workspaceMaxUsers);
          break;
        case "deleteWorkSpace":
          await handleDeleteSharedWorkspace(
            ws.hiveID,
            parseInt(data.userId),
            parseInt(data.workspaceId));
          break;
        default:
          console.log("Servidor fue a default");
          break;
      }
      broadcast(ws.hiveID);
    });

    ws.on("close", () => {
      console.log("Cliente desconectado");
      if(ws.currentUserID){
        hive[ws.hiveID].users = hive[ws.hiveID].users.filter(u => u.id_user !== ws.currentUserID);
        broadcast(ws.hiveID);
      }
    });
  });
})();

function handleEnterWorkspace(hiveId, userId, workspaceId, type) {
  if(!hive[hiveId]) return;

  const currentUser = hive[hiveId].users.find((u) => u.id_user === userId);
  let workspace;
  if (type === "private") {
    workspace = hive[hiveId].private_rooms.find((w) => w.id_private_room === workspaceId);
  } else {
    workspace = hive[hiveId].work_rooms.find((w) => w.id_room === workspaceId);
  }
  if (!currentUser || !workspace) return;

  if (
    type === "private" &&
    workspace.is_locked &&
    workspace.id_user !== currentUser.id_user
  ) {
    return;
  }

  // Para oficinas privadas: verificar si el owner está presente y no ocupado
  if (type === "private" && workspace.id_user !== userId) {
    const owner = hive[hiveId].users.find((u) => u.id_user === workspace.id_user);
    if (!owner) return;

    // No permitir entrar si el owner no está en su oficina
    if (owner.currentLocation !== workspaceId) return;

    // No permitir entrar si el owner está ocupado
    if (owner.status === "busy") return;
  }

  currentUser.currentLocation = workspaceId;
  currentUser.locationType = type;
}

async function handleToggleLock(hiveId, workspaceId) {
  let wsToToggleLock = hive[hiveId].work_rooms.find((w) => w.id_room === workspaceId);
  if (!wsToToggleLock) {
    wsToToggleLock = hive[hiveId].private_rooms.find(
      (w) => w.id_private_room === workspaceId
    );
    if (wsToToggleLock) {
      await updatePrivateRoomService(workspaceId,!wsToToggleLock.is_locked);
    }
    return;
  }
  await updateWorkRoomService(workspaceId,{
      room_name: wsToToggleLock.room_name,
      max_users: wsToToggleLock.max_users,
      is_locked: !wsToToggleLock.is_locked
  });
}

async function handleCreateSharedWorkspace(hiveID, newWorkspaceMaxUsers) {
  const maxUsers = parseInt(newWorkspaceMaxUsers);
  if (isNaN(maxUsers) || maxUsers < 1) return;
  await addWorkRoomService({
      id_hive: hiveID,
      room_name: "New-Room",
      max_users: newWorkspaceMaxUsers
  });
}

async function handleDeleteSharedWorkspace(hiveId, userId, workspaceId) {
  const currentUser = hive[hiveId].users.find((u) => u.id_user === userId);
  if (currentUser.currentLocation === workspaceId) return;

  hive[hiveId].users = hive[hiveId].users.map((user) => {
    if (user.currentLocation === workspaceId) {
      const userPrivateOffice = hive[hiveId].private_rooms.find(
        (p) => p.id_user === user.id_user
      );
      if(!userPrivateOffice) return;
      return {
        ...user,
        currentLocation: userPrivateOffice.id_private_room,
        locationType: "private",
      };
    }
    return user;
  });

  await deleteWorkRoomService(workspaceId);
}

async function broadcast(id_hive) {
  if (!id_hive) return;
  if(!hive[id_hive]) return;

  await getRooms(id_hive);

  const thisHive = hive[id_hive];

  const payload = JSON.stringify({
    type: "update",
    users: thisHive.users,
    private_rooms: thisHive.private_rooms,
    work_rooms: thisHive.work_rooms
  });

  server.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.hiveID === id_hive) {
      client.send(payload);
    }
  });
}