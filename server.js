const WebSocket = require("ws");
const Redis = require("ioredis");
const {getPrivateRoomsService, getPrivateRoomOfUser, updatePrivateRoomService} = require("./services/hiveService");
const {getWorkRoomsService,addWorkRoomService,deleteWorkRoomService,updateWorkRoomService} = require("./services/work_roomService");
const Private_Room = require("./models/private_room");
const User = require("./models/user");

let hive = {};
let server;
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});

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

async function loadHiveUsers(id_hive) {
  try {
    const privateRooms = await Private_Room.findAll({
      where: { id_hive }
    });
    
    const userIds = privateRooms.map(pr => pr.id_user);
    const users = await User.findAll({
      where: { id_user: userIds },
      attributes: ['id_user', 'user_name', 'email', 'first_name', 'last_name', 'imageURL', 'status']
    });
    
    const thisHive = hive[id_hive];
    const existingUserIds = new Set(thisHive.users.map(u => u.id_user));
    const connectedUserIds = new Set();
    
    server.clients.forEach(client => {
      if (client.readyState === 1 && client.hiveID === id_hive && client.currentUserID) {
        connectedUserIds.add(client.currentUserID);
      }
    });
    
    for (const user of users) {
      const existingUser = thisHive.users.find(u => u.id_user === user.id_user);
      const isConnected = connectedUserIds.has(user.id_user);
      
      if (!existingUser && !existingUserIds.has(user.id_user)) {
        const privateRoom = privateRooms.find(pr => pr.id_user === user.id_user);
        if (privateRoom) {
          thisHive.users.push({
            ...user.dataValues,
            currentLocation: privateRoom.id_private_room,
            locationType: "private",
            status: isConnected ? "online" : "inactive"
          });
          existingUserIds.add(user.id_user);
        }
      } else if (existingUser) {
        Object.assign(existingUser, {
          user_name: user.user_name,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          imageURL: user.imageURL,
          status: isConnected ? "online" : "inactive"
        });
      }
    }
    
    for (const user of thisHive.users) {
      const isConnected = connectedUserIds.has(user.id_user);
      if (!isConnected && user.status !== "inactive") {
        user.status = "inactive";
      }
    }
    
    const uniqueUsers = [];
    const seenIds = new Set();
    for (const user of thisHive.users) {
      if (!seenIds.has(user.id_user)) {
        seenIds.add(user.id_user);
        uniqueUsers.push(user);
      }
    }
    thisHive.users = uniqueUsers;
  } catch (err) {
    console.log("Error loading hive users:", err.message);
  }
}

(async () => {
  server = new WebSocket.Server({ port: 3002 });
  console.log("WebSocket server en port 3002");
  
  redis.on("connect", () => {
    console.log("Connected to Redis");
  });
  redis.on("error", (err) => {
    console.error("Redis error:", err);
  });

  server.on("connection", (ws) => {
    ws.hiveID = null;
    ws.currentUserID = null;

    ws.on("message", async (message) => {
      const data = JSON.parse(message.toString());
      switch (data.type) {
        case "ping":
          if(ws.readyState === WebSocket.OPEN){
            ws.send(JSON.stringify({type: "pong"}));
          }
          return;
        case "setHive":
        ws.hiveID = parseInt(data.id_hive);
        ws.currentUserID = data.user.id_user;
              
        if (!hive[data.id_hive]) {
          const usersRedis = await redis.get(data.id_hive);
          let usersList = usersRedis ? JSON.parse(usersRedis) : [];
          const uniqueUsers = [];
          const seenIds = new Set();
          const connectedUserIds = new Set();
        
          server.clients.forEach(client => {
            if (client.readyState === 1 && client.hiveID === parseInt(data.id_hive) && client.currentUserID) {
              connectedUserIds.add(client.currentUserID);
            }
          });
        
          for (const user of usersList) {
            if (!seenIds.has(user.id_user)) {
              seenIds.add(user.id_user);
              const isConnected = connectedUserIds.has(user.id_user);
              uniqueUsers.push({
                ...user,
                status: isConnected ? "online" : "inactive"
              });
            }
          }
        
          hive[data.id_hive] = {
            users: uniqueUsers,
            private_rooms: [],
            work_rooms: []
          };
          await redis.set(data.id_hive, JSON.stringify(hive[data.id_hive].users));
        }
      
        const newUser = data.user;
        const thisHive = hive[data.id_hive];
        const found = thisHive.users.find(u => u.id_user === newUser.id_user);
      
        if (!found) {
          const privateRoom = await getPrivateRoomOfUser(ws.hiveID, ws.currentUserID);
          const privateRoomID = privateRoom.id_private_room;
          thisHive.users.push({
            ...newUser,
            currentLocation: privateRoomID,
            locationType: "private",
            status: "online"
          });
        } else {
          found.status = "online";
        }
        await redis.set(data.id_hive, JSON.stringify(thisHive.users));
        break;
        case "enterWorkspace":
          await handleEnterWorkspace(
            ws.hiveID,
            parseInt(data.userId),
            parseInt(data.workspaceId),
            data.room
          );
          break;
        case "lockWorkspace":
          await handleToggleLock(
            ws.hiveID, 
            parseInt(data.workspaceId),
            data.roomType);
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
        case "leaveToDashboard":
          await handleLeaveToDashboard(
            ws.hiveID,
            parseInt(data.userId)
          );
          break;
        default:
          console.log("Servidor fue a default");
          break;
      }
      broadcast(ws.hiveID);
    });

    ws.on("close", async() => {
      console.log("Cliente desconectado");
    });
  });
})();

async function handleEnterWorkspace(hiveId, userId, workspaceId, type) {
  if(!hive[hiveId]) return;

  const currentUser = hive[hiveId].users.find((u) => u.id_user === userId);
  let workspace;
  if (type === "private") {
    workspace = hive[hiveId].private_rooms.find((w) => w.id_private_room === workspaceId);
  } else {
    workspace = hive[hiveId].work_rooms.find((w) => w.id_room === workspaceId);
  }
  if (!currentUser || !workspace) return;

  if (type === "private") {
    if (workspace.id_user === userId) {
      const previousLocation = currentUser.currentLocation;
      const previousLocationType = currentUser.locationType;
      
      currentUser.currentLocation = workspaceId;
      currentUser.locationType = type;
      
      if (previousLocationType === "private" && previousLocation !== workspaceId) {
        const previousPrivateRoom = hive[hiveId].private_rooms.find(
          (pr) => pr.id_private_room === previousLocation
        );
        if (previousPrivateRoom && previousPrivateRoom.id_user === userId) {
          const guestsInRoom = hive[hiveId].users.filter(
            (u) => u.currentLocation === previousLocation && 
                   u.locationType === "private" && 
                   u.id_user !== userId
          );
          
          for (const guest of guestsInRoom) {
            const guestPrivateRoom = await getPrivateRoomOfUser(hiveId, guest.id_user);
            if (guestPrivateRoom) {
              guest.currentLocation = guestPrivateRoom.id_private_room;
              guest.locationType = "private";
            }
          }
        }
      }
      return;
    }

    if (workspace.is_locked) {
      return;
    }

    const usersInRoom = hive[hiveId].users.filter(
      (u) => u.currentLocation === workspaceId && u.locationType === "private"
    );
    
    if (usersInRoom.length >= 2) {
      return;
    }

    const owner = hive[hiveId].users.find((u) => u.id_user === workspace.id_user);
    if (!owner) return;

    if (owner.status === "inactive") return;

    if (owner.currentLocation !== workspaceId || owner.locationType !== "private") return;

    if (owner.status === "busy") return;
  } else if (type === "shared") {
    if (currentUser.locationType === "private") {
      const previousPrivateRoom = hive[hiveId].private_rooms.find(
        (pr) => pr.id_private_room === currentUser.currentLocation
      );
      if (previousPrivateRoom && previousPrivateRoom.id_user === userId) {
        const guestsInRoom = hive[hiveId].users.filter(
          (u) => u.currentLocation === previousPrivateRoom.id_private_room && 
                 u.locationType === "private" && 
                 u.id_user !== userId
        );
        
        for (const guest of guestsInRoom) {
          const guestPrivateRoom = await getPrivateRoomOfUser(hiveId, guest.id_user);
          if (guestPrivateRoom) {
            guest.currentLocation = guestPrivateRoom.id_private_room;
            guest.locationType = "private";
          }
        }
      }
    }
    
    if (workspace.is_locked) {
      return;
    }
    const guestsInRoom = hive[hiveId].users.filter(
      (u) => u.currentLocation === workspaceId && 
              u.locationType === "shared" && 
              u.id_user !== userId
    );
    if(workspace.max_users && guestsInRoom.length >= workspace.max_users){
      return;
    }
  }

  currentUser.currentLocation = workspaceId;
  currentUser.locationType = type;
}

async function handleToggleLock(hiveId, workspaceId, roomType) {
  if (!hive[hiveId]) return;
  
  if (roomType === "shared") {
    const workRoom = hive[hiveId].work_rooms.find((w) => w.id_room === workspaceId);
    
    if (!workRoom) return;
    
    const usersInWorkspace = hive[hiveId].users.filter(
      (u) => u.currentLocation === workspaceId && u.locationType === "shared"
    );
    
    if (usersInWorkspace.length === 0 && !workRoom.is_locked) {
      return;
    }
    
    const newLockState = !workRoom.is_locked;
    
    if (usersInWorkspace.length === 0 && newLockState) {
      return;
    }
    
    await updateWorkRoomService(workspaceId,{
        room_name: workRoom.room_name,
        max_users: workRoom.max_users,
        is_locked: newLockState
    });
    workRoom.is_locked = newLockState;
    return;
  }
  
  if (roomType === "private") {
    const privateRoom = hive[hiveId].private_rooms.find(
      (w) => w.id_private_room === workspaceId
    );
    
    if (!privateRoom) return;
    
    const newLockState = !privateRoom.is_locked;
    await updatePrivateRoomService(workspaceId, newLockState);
    privateRoom.is_locked = newLockState;
    return;
  }
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

async function handleLeaveToDashboard(hiveId, userId) {
  if (!hive[hiveId]) return;
  
  const currentUser = hive[hiveId].users.find((u) => u.id_user === userId);
  if (!currentUser) return;

  if (currentUser.locationType === "shared") {
    const privateRoom = await getPrivateRoomOfUser(hiveId, userId);
    if (privateRoom) {
      currentUser.currentLocation = privateRoom.id_private_room;
      currentUser.locationType = "private";
      if (!privateRoom.is_locked) {
        await updatePrivateRoomService(privateRoom.id_private_room, true);
        const roomInHive = hive[hiveId].private_rooms.find(
          (pr) => pr.id_private_room === privateRoom.id_private_room
        );
        if (roomInHive) {
          roomInHive.is_locked = true;
        }
      }
      await redis.set(hiveId, JSON.stringify(hive[hiveId].users));
    }
  } else if (currentUser.locationType === "private") {
    const privateRoom = hive[hiveId].private_rooms.find(
      (pr) => pr.id_private_room === currentUser.currentLocation
    );
    
    if (privateRoom && privateRoom.id_user === userId) {
      const guestsInRoom = hive[hiveId].users.filter(
        (u) => u.currentLocation === currentUser.currentLocation && 
               u.locationType === "private" && 
               u.id_user !== userId
      );
      
      for (const guest of guestsInRoom) {
        const guestPrivateRoom = await getPrivateRoomOfUser(hiveId, guest.id_user);
        if (guestPrivateRoom) {
          guest.currentLocation = guestPrivateRoom.id_private_room;
          guest.locationType = "private";
        }
      }
      
      if (!privateRoom.is_locked) {
        await updatePrivateRoomService(privateRoom.id_private_room, true);
        privateRoom.is_locked = true;
      }
      
      await redis.set(hiveId, JSON.stringify(hive[hiveId].users));
    }
  }
}

async function broadcast(id_hive) {
  if (!id_hive) return;
  if(!hive[id_hive]) return;

  const connectedUserIds = new Set();
  server.clients.forEach(client => {
    if (client.readyState === 1 && client.hiveID === id_hive && client.currentUserID) {
      connectedUserIds.add(client.currentUserID);
    }
  });

  await getRooms(id_hive);
  await loadHiveUsers(id_hive);

  const thisHive = hive[id_hive];
  
  for (const user of thisHive.users) {
    const isConnected = connectedUserIds.has(user.id_user);
    user.status = isConnected ? "online" : "inactive";
  }

  for (const workRoom of thisHive.work_rooms) {
    const usersInWorkspace = thisHive.users.filter(
      (u) => u.currentLocation === workRoom.id_room && u.locationType === "shared"
    );
    
    if (usersInWorkspace.length === 0 && workRoom.is_locked) {
      await updateWorkRoomService(workRoom.id_room, {
        room_name: workRoom.room_name,
        max_users: workRoom.max_users,
        is_locked: false
      });
      workRoom.is_locked = false;
    }
  }

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