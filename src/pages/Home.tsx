import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle, Building2, Briefcase, Users, Lock, LockOpen, X, Send, Trash2, Video, VideoOff, Mic, MicOff, MonitorUp, MonitorX, Hexagon, Crown } from 'lucide-react';
import Chat from "../components/chat/Chat";

import JitsiMeeting from "../components/jitsi/JitsiMeeting";
import { relative } from 'path';
import { useNavigate } from 'react-router-dom';

export type UserStatus = 'online' | 'busy' | 'away';
export type WorkspaceType = 'general' | 'shared' | 'private';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  currentLocation: string;
  locationType: WorkspaceType;
}

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  ownerId?: string;
  isLocked: boolean;
  maxUsers?: number;
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

// Datos de respaldo mínimos para pruebas locales
const FALLBACK_WORKSPACES: Workspace[] = [
  {
    id: 'private-current',
    name: 'Mi Oficina',
    type: 'private',
    ownerId: 'current-user',
    isLocked: false
  },
  {
    id: 'shared-1',
    name: 'Sala de Reuniones 1',
    type: 'shared',
    isLocked: false,
    maxUsers: 8
  }
];

const FALLBACK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Usuario invitado',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
    status: 'online',
    currentLocation: 'shared-1',
    locationType: 'shared'
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'current-user',
    name: 'Hector',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
    status: 'online',
    currentLocation: 'private-current',
    locationType: 'private'
  });

  const [users, setUsers] = useState<User[]>(FALLBACK_USERS);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(FALLBACK_WORKSPACES);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    try {
      const ws = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:3001');
      setSocket(ws);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "init" || data.type === "update") {
          setUsers(data.users);
          setWorkspaces(data.workspaces);
          const updatedCurrentUser = data.users.find((u: User) => u.id === currentUser.id);
          if (updatedCurrentUser) setCurrentUser(updatedCurrentUser);
        }
      };

      ws.onerror = () => {
        console.log('WebSocket no disponible, usando datos locales de prueba');
        setUsers(FALLBACK_USERS);
        setWorkspaces(FALLBACK_WORKSPACES);
      };
    } catch (error) {
      console.log('WebSocket no disponible, usando datos locales de prueba');
      setUsers(FALLBACK_USERS);
      setWorkspaces(FALLBACK_WORKSPACES);
    }
  }, []);

  const enterWorkSpace = (workspaceID: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "enterWorkspace",
        userId: currentUser.id,
        workspaceId: workspaceID
      }));
    } else {
      handleEnterWorkspace(workspaceID);
    }
  }

  const lockWorkSpace = (workspaceID: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "lockWorkspace",
        workspaceId: workspaceID
      }));
    } else {
      handleToggleLock(workspaceID);
    }
  }

  const createWorkSpace = (workspaceMaxUSERS: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "createWorkSpace",
        workspaceMaxUsers: workspaceMaxUSERS
      }));
    } else {
      handleCreateSharedWorkspace();
    }
  }

  const deleteWorkSpace = (workspaceID: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "deleteWorkSpace",
        userId: currentUser.id,
        workspaceId: workspaceID
      }));
    } else {
      handleDeleteSharedWorkspace(workspaceID);
    }
  }
  const navigate = useNavigate();
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

  const handleCreateSharedWorkspace = () => {
    const maxUsers = parseInt(newWorkspaceMaxUsers);
    if (isNaN(maxUsers) || maxUsers < 1) return;

    const sharedCount = sharedWorkspaces.length + 1;
    const newWorkspace: Workspace = {
      id: `shared-${Date.now()}`,
      name: `Sala ${sharedCount}`,
      type: 'shared',
      isLocked: false,
      maxUsers: maxUsers
    };

    setWorkspaces([...workspaces, newWorkspace]);
    setNewWorkspaceMaxUsers('8');
    setShowCreateWorkspace(false);
  };

  const handleDeleteSharedWorkspace = (workspaceId: string) => {
    if (currentUser.currentLocation === workspaceId) return;

    const updatedUsers = users.map(user => {
      if (user.currentLocation === workspaceId) {
        const userPrivateOffice = workspaces.find(w => w.ownerId === user.id && w.type === 'private');
        return {
          ...user,
          currentLocation: userPrivateOffice?.id || user.currentLocation,
          locationType: 'private' as WorkspaceType
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
  };

  const handleEnterWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (!workspace) return;

    if (workspace.type === 'private' && workspace.isLocked && workspace.ownerId !== currentUser.id) {
      return;
    }

    if (workspace.type === 'private' && workspace.ownerId !== currentUser.id) {
      const owner = allUsers.find(u => u.id === workspace.ownerId);
      if (!owner) return;
      if (owner.currentLocation !== workspaceId) return;
      if (owner.status === 'busy') return;
    }

    const previousLocation = currentUser.currentLocation;
    setCurrentUser({
      ...currentUser,
      currentLocation: workspaceId,
      locationType: workspace.type
    });

    if (previousLocation !== workspaceId) {
      setIsInMeeting(false);
      if (shouldEnableVideoConference()) {
        setIsJitsiActive(true);
      } else {
        setIsJitsiActive(false);
      }
    }
  };

  const handleToggleLock = (workspaceId: string) => {
    setWorkspaces(prev =>
      prev.map(w =>
        w.id === workspaceId ? { ...w, isLocked: !w.isLocked } : w
      )
    );
  };

  const getUsersInLocation = (locationId: string): User[] => {
    const usersInLocation = users.filter(u => u.currentLocation === locationId && u.id !== currentUser.id);
    if (currentUser.currentLocation === locationId) {
      return [currentUser, ...usersInLocation];
    }
    return usersInLocation;
  };

  // Funciones para videoconferencia
  const shouldEnableVideoConference = (): boolean => {
    const usersInCurrentWorkspace = getUsersInLocation(currentUser.currentLocation);
    return usersInCurrentWorkspace.length >= 2;
  };

  const getMeetingRoomName = (): string => {
    return `workspace-${currentUser.currentLocation}`;
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

  const allUsers = [currentUser, ...users.filter(u => u.id !== currentUser.id)];
  const privateWorkspaces = workspaces?.filter(w => w.type === 'private');
  const sharedWorkspaces = workspaces?.filter(w => w.type === 'shared');

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
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
              <span className="text-sm text-white">{currentUser.name}</span>
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
              <div className="flex-shrink-0 px-3 py-2 bg-white border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-black">Videoconferencia en curso</h2>
                <p className="text-sm text-neutral-600">Sala: {getMeetingRoomName()}</p>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden pb-2 flex items-center justify-center px-8">
                <div id="jitsi-visible-container" className="w-full max-w-4xl h-full overflow-hidden">
                </div>
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
                    {privateWorkspaces?.map(workspace => {
                      const owner = allUsers.find(u => u.id === workspace.ownerId);
                      const usersInOffice = getUsersInLocation(workspace.id);
                      const isOwner = currentUser.id === workspace.ownerId;
                      const isCurrentUserHere = currentUser.currentLocation === workspace.id;
                      const isOccupied = usersInOffice.length > 0;
                      const isOwnerInSharedSpace = owner && owner.locationType === 'shared';
                      const isOwnerAway = owner && owner.status === 'away' && !isOwnerInSharedSpace;

                      // Verificar si la oficina está accesible para otros usuarios
                      const isOwnerInOffice = owner && owner.currentLocation === workspace.id;
                      const isOwnerBusy = owner && owner.status === 'busy';
                      const canEnter = isOwner || isCurrentUserHere || (isOwnerInOffice && !isOwnerBusy && !workspace.isLocked);

                      // Verificar si estoy visitando una oficina ajena
                      const isVisitingOthersOffice = isCurrentUserHere && !isOwner;

                      // Determinar los colores del borde y fondo
                      let borderColor = 'border-slate-200';
                      let bgColor = 'bg-slate-50';

                      if (isCurrentUserHere) {
                        // Estoy en esta oficina (sea mi oficina o visitando): amarillo fuerte + amarillo suave
                        borderColor = 'border-yellow-400';
                        bgColor = 'bg-yellow-50';
                      } else if (isOwner && !isCurrentUserHere) {
                        // Mi oficina pero NO estoy en ella: gris fuerte + gris suave
                        borderColor = 'border-slate-600';
                        bgColor = 'bg-slate-100';
                      } else if (isOwnerBusy) {
                        // Oficina de otro, owner ocupado: rojo fuerte + rojo suave
                        borderColor = 'border-red-600';
                        bgColor = 'bg-red-50';
                      } else if (isOwnerAway) {
                        // Oficina de otro, owner ausente: gris suave + gris más suave
                        borderColor = 'border-slate-300';
                        bgColor = 'bg-slate-100';
                      } else if (isOwnerInSharedSpace) {
                        // Oficina de otro, owner en espacio compartido: gris fuerte + gris suave
                        borderColor = 'border-slate-400';
                        bgColor = 'bg-slate-100';
                      }

                      return (
                        <div
                          key={workspace.id}
                          onClick={() => !isCurrentUserHere && enterWorkSpace(workspace.id)}
                          className={`border-2 rounded-lg p-4 transition-all ${canEnter ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                            } ${borderColor} ${bgColor} ${!isCurrentUserHere && canEnter && 'hover:border-yellow-500 hover:shadow-md'}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            {isCurrentUserHere && (
                              <div className="text-xs text-yellow-800 px-2 py-0.5 bg-yellow-100 rounded border border-yellow-400 flex items-center gap-1">
                                <Crown className="w-2.5 h-2.5" />
                                You're here
                              </div>
                            )}

                            <div className={isCurrentUserHere ? '' : 'ml-auto'}>
                              {isOwner && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    lockWorkSpace(workspace.id);
                                  }}
                                  className={`h-8 w-8 rounded flex items-center justify-center ${workspace.isLocked ? 'bg-red-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                                    }`}
                                >
                                  {workspace.isLocked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Mostrar usuarios en la oficina */}
                          {usersInOffice.length > 0 ? (
                            <div className="flex justify-center mb-3 flex-wrap gap-2">
                              {usersInOffice.map(user => {
                                const isUserInSharedSpace = user.locationType === 'shared' && user.id === workspace.ownerId;

                                return (
                                  <div key={user.id} className="flex flex-col items-center gap-1">
                                    <div className="relative">
                                      <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className={`w-10 h-10 rounded-full border-2 border-slate-200 ${isUserInSharedSpace ? 'grayscale opacity-50' : ''
                                          }`}
                                      />
                                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isUserInSharedSpace ? 'bg-slate-400' :
                                        user.status === 'online' ? 'bg-green-500' :
                                          user.status === 'busy' ? 'bg-red-500' :
                                            'bg-yellow-500'
                                        }`} />
                                    </div>
                                    <span className="text-xs text-slate-700 text-center">{user.name}</span>
                                    <span className={`text-xs ${isUserInSharedSpace ? 'text-slate-400' :
                                      user.status === 'online' ? 'text-green-600' :
                                        user.status === 'busy' ? 'text-red-600' :
                                          'text-yellow-600'
                                      }`}>
                                      {isUserInSharedSpace ? 'Activo' :
                                        user.status === 'online' ? 'Activo' :
                                          user.status === 'busy' ? 'Ocupado' :
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
                                    <img
                                      src={owner.avatar}
                                      alt={owner.name}
                                      className={`w-10 h-10 rounded-full border-2 border-slate-200 ${isOwnerInSharedSpace || (isOwner && !isCurrentUserHere) ? 'grayscale opacity-50' : ''
                                        }`}
                                    />
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOwnerInSharedSpace || (isOwner && !isCurrentUserHere) ? 'bg-slate-400' :
                                      owner.status === 'online' ? 'bg-green-500' :
                                        owner.status === 'busy' ? 'bg-red-500' :
                                          'bg-yellow-500'
                                      }`} />
                                  </div>
                                  <span className="text-xs text-slate-700 text-center">{owner.name}</span>
                                  <span className={`text-xs ${isOwnerInSharedSpace || (isOwner && !isCurrentUserHere) ? 'text-slate-400' :
                                    owner.status === 'online' ? 'text-green-600' :
                                      owner.status === 'busy' ? 'text-red-600' :
                                        'text-yellow-600'
                                    }`}>
                                    {isOwnerInSharedSpace || (isOwner && !isCurrentUserHere) ? 'Activo' :
                                      owner.status === 'online' ? 'Activo' :
                                        owner.status === 'busy' ? 'Ocupado' :
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
                    {sharedWorkspaces?.map(workspace => {
                      const usersInSpace = getUsersInLocation(workspace.id);
                      const isCurrentUserHere = currentUser.currentLocation === workspace.id;

                      return (
                        <div
                          key={workspace.id}
                          onClick={() => !isCurrentUserHere && enterWorkSpace(workspace.id)}
                          className={`rounded-lg p-4 transition-all cursor-pointer ${workspace.isLocked
                            ? 'border-2 border-red-600 bg-red-50'
                            : 'border border-slate-200 bg-slate-50'
                            } ${!isCurrentUserHere && 'hover:border-blue-500 hover:shadow-md'}`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Users className="w-4 h-4" />
                              <span>{usersInSpace.length}</span>
                              {workspace.maxUsers && <span className="text-slate-400">/ {workspace.maxUsers}</span>}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteWorkSpace(workspace.id);
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
                                    lockWorkSpace(workspace.id);
                                  }}
                                  className={`h-8 w-8 rounded flex items-center justify-center ${workspace.isLocked ? 'bg-red-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                                    }`}
                                >
                                  {workspace.isLocked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
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
                                <div key={user.id} className="group relative">
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full border-2 border-slate-200 hover:border-yellow-500 transition-colors cursor-pointer"
                                  />
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {user.name}
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
          <Chat username={"johnny-fake"} password={"josue2307"} tryEnter={true} />
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
      </div>

      {/* Jitsi - siempre montado cuando está activo, solo cambia de posición */}
      {isJitsiActive && shouldEnableVideoConference() && (
        <JitsiMeeting
          roomName={getMeetingRoomName()}
          displayName={currentUser.name}
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
    </div>
  );
}
