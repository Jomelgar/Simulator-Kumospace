import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle, Building2, Briefcase, Users, Lock, LockOpen, X, Send, Trash2, Video, VideoOff, Mic, MicOff, MonitorUp, MonitorX, Hexagon, Crown } from 'lucide-react';
import { MessageNotifications } from '../components/chat/notification';
import axios from "axios";
import Chat from "../components/chat/Chat";
import JitsiMeeting from "../components/jitsi/JitsiMeeting";
import {decodeToken} from "../api/authApi";
import { useParams } from "react-router-dom";
import { relative } from 'path';
import { useNavigate } from 'react-router-dom';

export type UserStatus = 'online' | 'busy' | 'away';
export type WorkspaceType = 'general' | 'shared' | 'private';

export interface User {
  id_user: number;
  user_name: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  currentLocation: number | null;
  imageURL: string | undefined;
  locationType: string | null;
  status: string;
}

export interface Private_Room {
  id_private_room: number;
  id_user: number;
  room_name: string;
  is_locked: boolean;
}

export interface Work_Room {
  id_room: number;
  room_name: string;
  max_users: number;
  is_locked: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'general' | 'private';
  recipientId?: string;
}

let baseUrl = import.meta.env.VITE_API_BASE_URL;

if (baseUrl.endsWith("/api")) {
  baseUrl = baseUrl.slice(0, -4);
}
export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User>({
    id_user: 1,
    user_name: 'Tú',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    currentLocation: 1,
    locationType: 'private',
    status: 'online',
    imageURL: undefined
  });

  const [users, setUsers] = useState<User[]>([]);
  const [private_rooms, setPrivateRooms] = useState<Private_Room[]>([]);
  const [work_rooms, setWorkRooms] = useState<Work_Room[]>([]);
  const [socket, setSocket] = useState<WebSocket|null>(null);
  const [token, setToken] = useState(null);
  const { hiveId } = useParams();

  useEffect(() => {
    const init = async () => {
      try {
        const response = await decodeToken();
        if(response === null) return;
        
        const authToken = response.token;
        setToken(authToken);

        const user = response.payload.user;
        setCurrentUser(user);

        const ws = new WebSocket("ws://localhost:3002");
        setSocket(ws);

        ws.onopen = () => {
          ws.send(
            JSON.stringify({
              type: "setHive",
              id_hive: hiveId,
              user: user,
              token: token,
            })
          );
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === "init" || data.type === "update") {
            setUsers(data.users);
            setPrivateRooms(data.private_rooms);
            setWorkRooms(data.work_rooms);

            const updatedCurrentUser = data.users.find(
              (u: User) => u.id_user === user.id_user
            );
            if (updatedCurrentUser) setCurrentUser(updatedCurrentUser);
          }
        };

        ws.onclose = () => console.log("WebSocket disconnected");
      } catch (error) {
        console.error(error);
      }
    };

  init();
}, []);

  const enterWorkSpace = (workspaceID: number, roomType: WorkspaceType) =>{
    if(socket){
      socket.send(JSON.stringify({
        type: "enterWorkspace",
        userId: currentUser.id_user,
        workspaceId: workspaceID,
        room: roomType
      }));
    }
  }

  const lockWorkSpace = (workspaceID: number, roomType?: WorkspaceType) =>{
    if(socket){
      socket.send(JSON.stringify({
        type: "lockWorkspace",
        workspaceId: workspaceID,
        roomType: roomType
      }));
    }
  }

  const createWorkSpace = (workspaceMaxUSERS: string) =>{
    if(socket){
      socket.send(JSON.stringify({
        type: "createWorkSpace",
        workspaceMaxUsers: workspaceMaxUSERS
      }));
    }
  }

  const deleteWorkSpace = (workspaceID: number) =>{
    if(socket){
      socket.send(JSON.stringify({
        type: "deleteWorkSpace",
        userId: currentUser.id_user,
        workspaceId: workspaceID
      }));
    }
  }

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatTarget, setChatTarget] = useState<string>('general');
  const [newWorkspaceMaxUsers, setNewWorkspaceMaxUsers] = useState('8');
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);

  //Inccrementador de div de chat
  const [chatWidth, setChatWidth] = useState(window.innerWidth * 0.3);
  const panelRef = useRef(null);
  const isChatResizing = useRef(false);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isChatResizing.current) return;

      const newWidth = window.innerWidth - e.clientX;
      if (newWidth < window.innerWidth * 0.2 || newWidth > window.innerWidth * 0.5) return;
      setChatWidth(newWidth);
    }

    function handleMouseUp() {
      isChatResizing.current = false;
      document.body.style.userSelect = "auto";
      document.body.style.pointerEvents = 'auto';
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function startResize() {
    isChatResizing.current = true;
    document.body.style.pointerEvents = 'none';
    document.body.style.userSelect = "none";
  }
  // Estados para controles de medios (alineados con config de Jitsi: video ON, audio OFF)
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  // Estado para videoconferencia con Jitsi
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [isJitsiActive, setIsJitsiActive] = useState(false);
  const jitsiApiRef = useRef<any | null>(null);

  const getUsersInLocation = (locationId: number, type: WorkspaceType) => {
    return users.filter((u: User) => u.currentLocation === locationId && u.locationType === type);
  };

  // Funciones para videoconferencia
  const shouldEnableVideoConference = (): boolean => {
    if(currentUser.currentLocation===null) return false;
    const locationType = currentUser.locationType;
    if(locationType === 'shared' || locationType === 'private') {
      const usersInCurrentWorkspace = getUsersInLocation(currentUser.currentLocation, locationType)
        .filter((user, index, self) => 
          index === self.findIndex((u) => u.id_user === user.id_user)
        );
      return usersInCurrentWorkspace.length >= 2;
    }
    return false;
  };

  const getMeetingRoomName = (): string => {
    if(currentUser.currentLocation===null) return "Not found";
    const locationType = currentUser.locationType;
    if(locationType === 'shared') {
      return `workspace-${currentUser.currentLocation}`;
    } else if(locationType === 'private') {
      return `private-room-${currentUser.currentLocation}`;
    }
    return "Not found";
  };

  const handleMeetingEnd = useCallback(() => {
    setIsInMeeting(false);
    setIsJitsiActive(false);
    jitsiApiRef.current = null;
  }, []);

  const handleAudioMuteChange = useCallback((muted: boolean) => {
    console.log('Audio mute cambió:', muted, '-> isMicOn será:', !muted);
    setIsMicOn(!muted);
  }, []);

  const handleVideoMuteChange = useCallback((muted: boolean) => {
    console.log('Video mute cambió:', muted, '-> isCameraOn será:', !muted);
    setIsCameraOn(!muted);
  }, []);

  const handleScreenSharingChange = useCallback((sharing: boolean) => {
    console.log('Screen sharing cambió:', sharing);
    setIsSharingScreen(sharing);
  }, []);

  // Sincroniza periódicamente el estado real de Jitsi con el header
  useEffect(() => {
    if (!isJitsiActive || !jitsiApiRef.current) return;

    const syncState = async () => {
      const api = jitsiApiRef.current;
      if (!api) return;

      try {
        const audioMuted = await api.isAudioMuted();
        const videoMuted = await api.isVideoMuted();
        setIsMicOn(!audioMuted);
        setIsCameraOn(!videoMuted);
      } catch (error) {
        console.error('Error al sincronizar estado:', error);
      }
    };

    // timeout inicial más largo para dejar estabilizar Jitsi
    const initialTimeout = setTimeout(syncState, 800);
    const interval = setInterval(syncState, 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isJitsiActive, isInMeeting]);

  useEffect(() => {
    const canEnable = shouldEnableVideoConference();
    if (canEnable && !isJitsiActive) {
      setIsJitsiActive(true);
    } else if (!canEnable && isJitsiActive) {
      setIsJitsiActive(false);
      setIsInMeeting(false);
    }
  }, [currentUser.currentLocation, users, isJitsiActive]);

  const allUsers = users;
  const privateWorkspaces = private_rooms;
  const sharedWorkspaces = work_rooms;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-black border-b border-neutral-800 px-6 py-4">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-lg border border-neutral-800">
              <Hexagon className="w-6 h-6 text-yellow-500" />
              <span className="text-yellow-500 tracking-wider">HIVEROOMS</span>
            </div>
          </div>

          <div ref={panelRef} className="flex items-center gap-4">
            {/* Controles de medios */}
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-900 rounded-lg border border-neutral-800">
              <button
                onClick={() => {
                  if (jitsiApiRef.current) {
                    try {
                      jitsiApiRef.current.executeCommand('toggleVideo');
                    } catch (e) {
                      console.error('Error al cambiar cámara en Jitsi', e);
                    }
                  }
                }}
                className={`h-9 w-9 rounded flex items-center justify-center transition-colors ${isCameraOn ? 'bg-neutral-800 text-white' : 'bg-black text-neutral-400'
                  }`}
                title={isCameraOn ? 'Desactivar cámara' : 'Activar cámara'}
              >
                {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  if (jitsiApiRef.current) {
                    try {
                      jitsiApiRef.current.executeCommand('toggleAudio');
                    } catch (e) {
                      console.error('Error al cambiar micrófono en Jitsi', e);
                    }
                  }
                }}
                className={`h-9 w-9 rounded flex items-center justify-center transition-colors ${isMicOn ? 'bg-neutral-800 text-white' : 'bg-black text-neutral-400'
                  }`}
                title={isMicOn ? 'Desactivar micrófono' : 'Activar micrófono'}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  if (jitsiApiRef.current) {
                    jitsiApiRef.current.executeCommand('toggleShareScreen');
                  }
                }}
                disabled={!jitsiApiRef.current}
                className={`h-9 w-9 rounded flex items-center justify-center transition-colors ${!jitsiApiRef.current ? 'bg-black text-neutral-600 cursor-not-allowed' :
                  isSharingScreen ? 'bg-yellow-500 text-black' : 'bg-black text-neutral-400'
                  }`}
                title={isSharingScreen ? 'Dejar de compartir pantalla' : 'Compartir pantalla'}
              >
                {isSharingScreen ? <MonitorUp className="w-4 h-4" /> : <MonitorX className="w-4 h-4" />}
              </button>

              {/* Botón de Videoconferencia */}
              <button
                onClick={() => {
                  if (shouldEnableVideoConference()) {
                    if (!isJitsiActive) {
                      setIsJitsiActive(true);
                    }
                    setIsInMeeting(!isInMeeting);
                  }
                }}
                disabled={!shouldEnableVideoConference()}
                className={`h-9 w-9 rounded flex items-center justify-center transition-colors ${!shouldEnableVideoConference()
                  ? 'bg-black text-neutral-600 cursor-not-allowed'
                  : isInMeeting
                    ? 'bg-green-600 text-white'
                    : 'bg-neutral-800 text-white hover:bg-neutral-700'
                  }`}
                title={
                  !shouldEnableVideoConference()
                    ? 'Necesitas 2+ personas para iniciar videoconferencia'
                    : isInMeeting
                      ? 'Ocultar videoconferencia'
                      : 'Mostrar videoconferencia'
                }
              >
                <Users className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-800">
              {currentUser.imageURL && (
                <img src={baseUrl + currentUser.imageURL} alt={currentUser.user_name} className="w-8 h-8 rounded-full" />
              )}
              <span className="stext-sm text-white">{currentUser.user_name}</span>
            </div>

            <button
              onClick={() => { setIsChatOpen(!isChatOpen); (isChatOpen === true) ? setChatWidth(window.innerWidth * 0.3) : setChatWidth(0) }}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${isChatOpen ? 'bg-yellow-500 text-black' : 'bg-white text-black border border-neutral-300'
                }`}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
          </div>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <main className={`flex-1 ${isInMeeting ? 'flex flex-col' : 'overflow-auto'}`}>
          {isInMeeting ? (
            <div className="flex-1 flex flex-col h-full">
              <div className="flex-1 min-h-0 overflow-hidden flex items-stretch justify-center bg-slate-900">
                <div id="jitsi-visible-container" className="w-full h-full"></div>
              </div>
            </div>
          ) : (
            <div className="max-w-[1800px] mx-auto p-8 space-y-6">
              {/* Oficinas Privadas */}
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black rounded-lg">
                      <Briefcase className="w-4 h-4 text-yellow-500" />
                    </div>
                    <h2 className="text-black">Private Rooms</h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {privateWorkspaces.map(room => {
                    const owner = allUsers.find(u => u.id_user === room.id_user);
                    const usersInOffice = getUsersInLocation(room.id_private_room , 'private')
                      .filter((user, index, self) => 
                        index === self.findIndex((u) => u.id_user === user.id_user)
                      );
                    const isOwner = currentUser.id_user === room.id_user;
                    const isCurrentUserHere = currentUser.currentLocation === room.id_private_room && currentUser.locationType === 'private';
                    const isOccupied = usersInOffice.length > 0;
                    const isOwnerInSharedSpace = owner && owner.locationType === 'shared';
                    const isOwnerAway = owner && owner.status === 'away' && !isOwnerInSharedSpace;

                    // Verificar si la oficina está accesible para otros usuarios
                    const isOwnerInOffice = owner && owner.currentLocation === room.id_private_room && owner.locationType === 'private';
                    const isOwnerBusy = owner && owner.status === 'busy';
                    const isOwnerInactive = owner && owner.status === 'inactive';
                    const canEnter = isOwner || (isOwnerInOffice && !isOwnerBusy && !isOwnerInactive && !room.is_locked);

                    // Verificar si estoy visitando una oficina ajena
                    const isVisitingOthersOffice = isCurrentUserHere && !isOwner;

                      // Determinar los colores del borde y fondo
                      let borderColor = 'border-slate-200';
                      let bgColor = 'bg-slate-50';

                      if (isCurrentUserHere) {
                        borderColor = 'border-yellow-400';
                        bgColor = 'bg-yellow-50';
                      } else if (isOwnerInactive || !isOwnerInOffice) {
                        // Prioridad: owner inactivo o no está
                        borderColor = 'border-slate-400';
                        bgColor = 'bg-slate-100';
                      } else if (room.is_locked) {
                        borderColor = 'border-red-600';
                        bgColor = 'bg-red-50';
                      }

                      return (
                        <div
                          key={room.id_private_room}
                          onClick={() => !isCurrentUserHere && enterWorkSpace(room.id_private_room, 'private')}
                          className={`relative border-2 rounded-lg p-4 transition-all ${canEnter ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                            } ${borderColor} ${bgColor} ${!isCurrentUserHere && canEnter && 'hover:border-yellow-500 hover:shadow-md'}`}
                        >
                              {isOwner && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                lockWorkSpace(room.id_private_room, 'private');
                              }}
                              className={`absolute top-3 right-3 h-8 w-8 rounded flex items-center justify-center ${room.is_locked ? 'bg-red-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                                }`}
                            >
                              {room.is_locked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
                            </button>
                          )}

                          {/* Mostrar usuarios en la oficina */}
                          {usersInOffice.length > 0 ? (
                            <div className="flex justify-center mb-3 flex-wrap gap-2">
                              {usersInOffice.map(user => {
                                const isUserInSharedSpace = user.locationType === 'shared' && user.id_user === room.id_user;

                                return (
                                  <div key={user.id_user} className="flex flex-col items-center gap-1">
                                    <div className="relative">
                                      {user.imageURL ? (
                                        <img
                                          src={baseUrl + user.imageURL}
                                          alt={user.user_name}
                                          className={`w-10 h-10 rounded-full border-2 border-slate-200 ${isUserInSharedSpace ? 'grayscale opacity-50' : ''
                                            }`}
                                        />
                                      ) : (
                                        <div className={`w-10 h-10 rounded-full border-2 border-slate-200 bg-slate-300 flex items-center justify-center ${isUserInSharedSpace ? 'grayscale opacity-50' : ''
                                          }`}>
                                          <span className="text-xs text-slate-600 font-medium">
                                            {user.user_name.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                      )}
                                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isUserInSharedSpace ? 'bg-slate-400' :
                                        user.status === 'online' ? 'bg-green-500' :
                                          user.status === 'busy' ? 'bg-red-500' :
                                            user.status === 'inactive' ? 'bg-gray-400' :
                                              'bg-yellow-500'
                                        }`} />
                                    </div>
                                    <span className="text-xs text-slate-700 text-center">{user.user_name}</span>
                                    <span className={`text-xs ${isUserInSharedSpace ? 'text-slate-400' :
                                      user.status === 'online' ? 'text-green-600' :
                                        user.status === 'busy' ? 'text-red-600' :
                                          user.status === 'inactive' ? 'text-gray-500' :
                                            'text-yellow-600'
                                      }`}>
                                      {isUserInSharedSpace ? 'Activo' :
                                        user.status === 'online' ? 'Activo' :
                                          user.status === 'busy' ? 'Ocupado' :
                                            user.status === 'inactive' ? 'Inactivo' :
                                              'Ausente'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            owner && (
                              <div className="flex justify-center mb-3">
                                <div className="flex flex-col items-center gap-1">
                                  <div className="relative">
                                    {owner.imageURL ? (
                                      <img
                                        src={baseUrl + owner.imageURL}
                                        alt={owner.user_name}
                                        className={`w-10 h-10 rounded-full border-2 border-slate-200 ${isOwnerInSharedSpace || (isOwner && !isCurrentUserHere) ? 'grayscale opacity-50' : ''
                                          }`}
                                      />
                                    ) : (
                                      <div className={`w-10 h-10 rounded-full border-2 border-slate-200 bg-slate-300 flex items-center justify-center ${isOwnerInSharedSpace || (isOwner && !isCurrentUserHere) ? 'grayscale opacity-50' : ''
                                        }`}>
                                        <span className="text-xs text-slate-600 font-medium">
                                          {owner.user_name.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    )}
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOwnerInSharedSpace || (isOwner && !isCurrentUserHere) ? 'bg-slate-400' :
                                      owner.status === 'online' ? 'bg-green-500' :
                                        owner.status === 'busy' ? 'bg-red-500' :
                                          owner.status === 'inactive' ? 'bg-gray-400' :
                                            'bg-yellow-500'
                                      }`} />
                                  </div>
                                  <span className="text-xs text-slate-700 text-center">{owner.user_name}</span>
                                  <span className={`text-xs ${isOwnerInSharedSpace || (isOwner && !isCurrentUserHere) ? 'text-slate-400' :
                                    owner.status === 'online' ? 'text-green-600' :
                                      owner.status === 'busy' ? 'text-red-600' :
                                        owner.status === 'inactive' ? 'text-gray-500' :
                                          'text-yellow-600'
                                    }`}>
                                      {isOwnerInSharedSpace || (isOwner && !isCurrentUserHere) ? 'Activo' :
                                        owner.status === 'online' ? 'Activo' :
                                          owner.status === 'busy' ? 'Ocupado' :
                                            owner.status === 'inactive' ? 'Inactivo' :
                                              'Ausente'}
                                    </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Espacios Compartidos */}
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm">
                <div className="px-6 py-4 border-b border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500 rounded-lg">
                        <Hexagon className="w-4 h-4 text-black" />
                      </div>
                      <h2 className="text-black">Work Rooms</h2>
                    </div>
                    <button
                      onClick={() => setShowCreateWorkspace(!showCreateWorkspace)}
                      className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors text-sm flex items-center gap-2"
                    >
                      <Hexagon className="w-4 h-4" />
                      Create Hive
                    </button>
                  </div>

                  {showCreateWorkspace && (
                    <div className="mt-4 flex gap-2">
                      <input
                        type="number"
                        min="1"
                        value={newWorkspaceMaxUsers}
                        onChange={(e) => setNewWorkspaceMaxUsers(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && createWorkSpace(newWorkspaceMaxUsers)}
                        placeholder="Max bees..."
                        className="flex-1 text-sm h-10 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <button
                        onClick={() => createWorkSpace(newWorkspaceMaxUsers)}
                        disabled={!newWorkspaceMaxUsers.trim() || parseInt(newWorkspaceMaxUsers) < 1}
                        className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateWorkspace(false);
                          setNewWorkspaceMaxUsers('8');
                        }}
                        className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {sharedWorkspaces?.map(room => {
                      const usersInSpace = getUsersInLocation(room.id_room, 'shared');
                      const isCurrentUserHere = currentUser.currentLocation === room.id_room && currentUser.locationType === 'shared';

                      return (
                        <div
                          key={room.id_room}
                          onClick={() => !isCurrentUserHere && enterWorkSpace(room.id_room, 'shared')}
                          className={`rounded-lg p-4 transition-all cursor-pointer ${room.is_locked
                            ? 'border-2 border-red-600 bg-red-50'
                            : 'border border-slate-200 bg-slate-50'
                            } ${!isCurrentUserHere && 'hover:border-blue-500 hover:shadow-md'}`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Users className="w-4 h-4" />
                              <span>{usersInSpace.length}</span>
                              {room.max_users && <span className="text-slate-400">/ {room.max_users}</span>}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteWorkSpace(room.id_room);
                                }}
                                disabled={isCurrentUserHere}
                                className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${isCurrentUserHere
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                                  }`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>

                              {isCurrentUserHere && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    lockWorkSpace(room.id_room, 'shared');
                                  }}
                                  className={`h-8 w-8 rounded flex items-center justify-center ${room.is_locked ? 'bg-red-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                                    }`}
                                >
                                  {room.is_locked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
                                </button>
                              )}

                              {isCurrentUserHere && (
                                <div className="text-xs text-blue-700 px-2 py-1 bg-blue-100 rounded border border-blue-200">
                                  Estás aquí
                                </div>
                              )}
                            </div>
                          </div>

                          {usersInSpace.length > 0 ? (
                            <div className="flex flex-wrap gap-3 justify-center">
                              {usersInSpace.map(user => (
                                <div key={user.id_user} className="group relative">
                                  {user.imageURL ? (
                                    <img
                                      src={baseUrl + user.imageURL}
                                      alt={user.user_name}
                                      className="w-12 h-12 rounded-full border-2 border-slate-200 hover:border-yellow-500 transition-colors cursor-pointer"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full border-2 border-slate-200 bg-slate-300 flex items-center justify-center hover:border-yellow-500 transition-colors cursor-pointer">
                                      <span className="text-sm text-slate-600 font-medium">
                                        {user.user_name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {user.user_name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-xs text-slate-400">
                              Empty
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Chat Panel */}
        <div className={`bg-white  border-l border-slate-200 flex`} style={{ position: 'relative', width: `${chatWidth}px` }}
        >
          <Chat tryEnter={true} />
          {/* Resizer: borde más ancho para arrastrar */}
          <div
            onMouseDown={startResize}
            style={{
              position: 'absolute',
              top: 0,
              left: 0, // o right:0 si está al otro lado
              width: '8px', // más ancho que el borde real
              height: '100%',
              cursor: 'ew-resize',
              zIndex: 10,
            }}
          />
        </div>

        {/* Jitsi - siempre montado cuando está activo, solo cambia de posición */}
        {isJitsiActive && shouldEnableVideoConference() && (
          <JitsiMeeting
            roomName={getMeetingRoomName()}
            displayName={currentUser?.user_name}
            onMeetingEnd={handleMeetingEnd}
            isVisible={isInMeeting}
            visibleContainerId="jitsi-visible-container"
            onApiReady={(api) => {
              jitsiApiRef.current = api;
              if (api) {
                // Sincronizar INMEDIATAMENTE el estado inicial con un pequeño retraso
                setTimeout(() => {
                  api.isAudioMuted()
                    .then((muted: boolean) => setIsMicOn(!muted))
                    .catch(() => { });
                  api.isVideoMuted()
                    .then((muted: boolean) => setIsCameraOn(!muted))
                    .catch(() => { });
                  api.isSharingScreen()
                    .then((sharing: boolean) => setIsSharingScreen(sharing))
                    .catch(() => { });
                }, 500);
              }
            }}
            onAudioMuteStatusChanged={handleAudioMuteChange}
            onVideoMuteStatusChanged={handleVideoMuteChange}
            onScreenSharingStatusChanged={handleScreenSharingChange}
          />
        )}
        <MessageNotifications/>
        </div>
    </div>
  );
}