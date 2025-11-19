import { useState } from 'react';
import { MessageCircle, Building2, Briefcase, Users, Lock, LockOpen, X, Send, Trash2, Video, VideoOff, Mic, MicOff, MonitorUp, MonitorX } from 'lucide-react';

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

export default function App() {
  const [currentUser] = useState<User>({
    id: 'current-user',
    name: 'Tú',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
    status: 'online',
    currentLocation: 'private-current',
    locationType: 'private'
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'María González',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      status: 'online',
      currentLocation: 'shared-1',
      locationType: 'shared'
    },
    {
      id: '2',
      name: 'Carlos Ruiz',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      status: 'busy',
      currentLocation: 'shared-1',
      locationType: 'shared'
    },
    {
      id: '3',
      name: 'Ana Martínez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      status: 'online',
      currentLocation: 'shared-2',
      locationType: 'shared'
    },
    {
      id: '4',
      name: 'Luis Pérez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luis',
      status: 'away',
      currentLocation: 'private-4',
      locationType: 'private'
    }
  ]);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 'shared-1',
      name: 'Sala de Desarrollo',
      type: 'shared',
      isLocked: false,
      maxUsers: 8
    },
    {
      id: 'shared-2',
      name: 'Sala de Diseño',
      type: 'shared',
      isLocked: false,
      maxUsers: 6
    },
    {
      id: 'shared-3',
      name: 'Sala de Reuniones',
      type: 'shared',
      isLocked: true,
      maxUsers: 4
    },
    {
      id: 'private-current',
      name: 'Mi Oficina',
      type: 'private',
      ownerId: 'current-user',
      isLocked: false
    },
    {
      id: 'private-1',
      name: 'Oficina de María',
      type: 'private',
      ownerId: '1',
      isLocked: false
    },
    {
      id: 'private-2',
      name: 'Oficina de Carlos',
      type: 'private',
      ownerId: '2',
      isLocked: true
    },
    {
      id: 'private-3',
      name: 'Oficina de Ana',
      type: 'private',
      ownerId: '3',
      isLocked: false
    },
    {
      id: 'private-4',
      name: 'Oficina de Luis',
      type: 'private',
      ownerId: '4',
      isLocked: true
    }
  ]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatTarget, setChatTarget] = useState<string>('general');
  const [newWorkspaceMaxUsers, setNewWorkspaceMaxUsers] = useState('8');
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);

  // Estados para controles de medios
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  const handleCreateSharedWorkspace = () => {
    const maxUsers = parseInt(newWorkspaceMaxUsers);
    if (isNaN(maxUsers) || maxUsers < 1) return;
    
    // Generar nombre automático
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
    // No permitir eliminar si el usuario actual está en ese espacio
    if (currentUser.currentLocation === workspaceId) return;
    
    // Mover usuarios que estén en ese espacio a su oficina privada
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
    
    // No permitir entrar a oficinas privadas bloqueadas de otros usuarios
    if (workspace.type === 'private' && workspace.isLocked && workspace.ownerId !== currentUser.id) {
      return;
    }
    
    // Para oficinas privadas: verificar si el owner está presente y no ocupado
    if (workspace.type === 'private' && workspace.ownerId !== currentUser.id) {
      const owner = allUsers.find(u => u.id === workspace.ownerId);
      if (!owner) return;
      
      // No permitir entrar si el owner no está en su oficina
      if (owner.currentLocation !== workspaceId) {
        return;
      }
      
      // No permitir entrar si el owner está ocupado
      if (owner.status === 'busy') {
        return;
      }
    }
    
    currentUser.currentLocation = workspaceId;
    currentUser.locationType = workspace.type;
    setUsers([...users]);
  };

  const handleToggleLock = (workspaceId: string) => {
    setWorkspaces(prev =>
      prev.map(w =>
        w.id === workspaceId ? { ...w, isLocked: !w.isLocked } : w
      )
    );
  };

  const getUsersInLocation = (locationId: string): User[] => {
    const usersInLocation = users.filter(u => u.currentLocation === locationId);
    if (currentUser.currentLocation === locationId) {
      return [currentUser, ...usersInLocation];
    }
    return usersInLocation;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage,
      timestamp: new Date(),
      type: chatTarget === 'general' ? 'general' : 'private',
      recipientId: chatTarget !== 'general' ? chatTarget : undefined
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const allUsers = [currentUser, ...users];
  const privateWorkspaces = workspaces.filter(w => w.type === 'private');
  const sharedWorkspaces = workspaces.filter(w => w.type === 'shared');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-slate-300" />
            </div>
            <h1 className="text-white">Oficina Virtual</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Controles de medios */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700">
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`h-9 w-9 rounded flex items-center justify-center transition-colors ${
                  isCameraOn ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400'
                }`}
                title={isCameraOn ? 'Desactivar cámara' : 'Activar cámara'}
              >
                {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`h-9 w-9 rounded flex items-center justify-center transition-colors ${
                  isMicOn ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400'
                }`}
                title={isMicOn ? 'Desactivar micrófono' : 'Activar micrófono'}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setIsSharingScreen(!isSharingScreen)}
                className={`h-9 w-9 rounded flex items-center justify-center transition-colors ${
                  isSharingScreen ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
                title={isSharingScreen ? 'Dejar de compartir pantalla' : 'Compartir pantalla'}
              >
                {isSharingScreen ? <MonitorUp className="w-4 h-4" /> : <MonitorX className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
              <span className="text-sm text-white">{currentUser.name}</span>
            </div>

            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isChatOpen ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 border border-slate-300'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1800px] mx-auto p-8 space-y-6">
            {/* Oficinas Privadas */}
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-slate-900">Oficinas Privadas</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {privateWorkspaces.map(workspace => {
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
                        onClick={() => !isCurrentUserHere && handleEnterWorkspace(workspace.id)}
                        className={`border-2 rounded-lg p-4 transition-all ${
                          canEnter ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                        } ${borderColor} ${bgColor} ${!isCurrentUserHere && canEnter && 'hover:border-blue-500 hover:shadow-md'}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          {isCurrentUserHere && (
                            <div className="text-xs text-yellow-700 px-2 py-0.5 bg-yellow-100 rounded border border-yellow-300">
                              Estás aquí
                            </div>
                          )}
                          
                          <div className={isCurrentUserHere ? '' : 'ml-auto'}>
                            {isOwner && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleLock(workspace.id);
                                }}
                                className={`h-8 w-8 rounded flex items-center justify-center ${
                                  workspace.isLocked ? 'bg-red-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
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
                                      className={`w-10 h-10 rounded-full border-2 border-slate-200 ${
                                        isUserInSharedSpace ? 'grayscale opacity-50' : ''
                                      }`} 
                                    />
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                      isUserInSharedSpace ? 'bg-slate-400' :
                                      user.status === 'online' ? 'bg-green-500' : 
                                      user.status === 'busy' ? 'bg-red-500' : 
                                      'bg-yellow-500'
                                    }`} />
                                  </div>
                                  <span className="text-xs text-slate-700 text-center">{user.name}</span>
                                  <span className={`text-xs ${
                                    isUserInSharedSpace ? 'text-slate-400' :
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
                                    className={`w-10 h-10 rounded-full border-2 border-slate-200 ${
                                      isOwnerInSharedSpace || (isOwner && !isCurrentUserHere) ? 'grayscale opacity-50' : ''
                                    }`} 
                                  />
                                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    isOwnerInSharedSpace || (isOwner && !isCurrentUserHere) ? 'bg-slate-400' :
                                    owner.status === 'online' ? 'bg-green-500' : 
                                    owner.status === 'busy' ? 'bg-red-500' : 
                                    'bg-yellow-500'
                                  }`} />
                                </div>
                                <span className="text-xs text-slate-700 text-center">{owner.name}</span>
                                <span className={`text-xs ${
                                  isOwnerInSharedSpace || (isOwner && !isCurrentUserHere) ? 'text-slate-400' :
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
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-700 rounded-lg">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-slate-900">Espacios Compartidos</h2>
                  </div>
                  <button
                    onClick={() => setShowCreateWorkspace(!showCreateWorkspace)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Crear Espacio
                  </button>
                </div>
                
                {showCreateWorkspace && (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={newWorkspaceMaxUsers}
                      onChange={(e) => setNewWorkspaceMaxUsers(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateSharedWorkspace()}
                      placeholder="Capacidad máxima..."
                      className="flex-1 text-sm h-10 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleCreateSharedWorkspace}
                      disabled={!newWorkspaceMaxUsers.trim() || parseInt(newWorkspaceMaxUsers) < 1}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Crear
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateWorkspace(false);
                        setNewWorkspaceMaxUsers('8');
                      }}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {sharedWorkspaces.map(workspace => {
                    const usersInSpace = getUsersInLocation(workspace.id);
                    const isCurrentUserHere = currentUser.currentLocation === workspace.id;

                    return (
                      <div 
                        key={workspace.id} 
                        onClick={() => !isCurrentUserHere && handleEnterWorkspace(workspace.id)}
                        className={`rounded-lg p-4 transition-all cursor-pointer ${
                          workspace.isLocked 
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
                                handleDeleteSharedWorkspace(workspace.id);
                              }}
                              disabled={isCurrentUserHere}
                              className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${
                                isCurrentUserHere 
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
                                  handleToggleLock(workspace.id);
                                }}
                                className={`h-8 w-8 rounded flex items-center justify-center ${
                                  workspace.isLocked ? 'bg-red-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
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
                                  className="w-12 h-12 rounded-full border-2 border-slate-200 hover:border-blue-400 transition-colors cursor-pointer" 
                                />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                  {user.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-xs text-slate-400">
                            Vacío
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Chat Panel */}
        {isChatOpen && (
          <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-900">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-sm">MENSAJERÍA</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-white hover:bg-slate-800 h-7 w-7 flex items-center justify-center rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <select
                value={chatTarget}
                onChange={(e) => setChatTarget(e.target.value)}
                className="w-full bg-slate-800 border-slate-700 text-white text-sm h-9 rounded px-3 border"
              >
                <option value="general">Chat General</option>
                {allUsers.filter(u => u.id !== currentUser.id).map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
              {messages.length === 0 && (
                <div className="text-center text-xs text-slate-400 py-8">Sin mensajes</div>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Mensaje..."
                  className="flex-1 text-sm h-9 px-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="h-9 w-9 bg-blue-600 text-white rounded flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}