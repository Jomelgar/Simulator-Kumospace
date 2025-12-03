import { useState } from "react";
import { Users, Video, Coffee, Presentation, MessageSquare, Plus } from "lucide-react";
import { CreateRoomDialog } from "./CreateRoomDialog";
import { VirtualOffice } from "./VirtualOffice";

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'busy' | 'away';
  currentRoom: string | null;
  role?: 'Hive Queen' | 'Bee';
}

export interface Room {
  id: string;
  name: string;
  type: "meeting" | "office" | "lounge" | "conference";
  capacity: number;
  users: User[];
  isLocked?: boolean;
  description?: string;
}

interface VirtualOfficeViewProps {
  onBackToProfile: () => void;
  spaceId: string | null;
}

// Mock users
const mockUsers: User[] = [
  { id: "1", name: "Ana García", avatar: "...", status: "online", currentRoom: null },
  { id: "2", name: "Carlos Ruiz", avatar: "...", status: "busy", currentRoom: null },
  { id: "3", name: "María López", avatar: "...", status: "online", currentRoom: null },
  { id: "4", name: "Jorge Martínez", avatar: "...", status: "online", currentRoom: null },
  { id: "5", name: "Laura Sánchez", avatar: "...", status: "away", currentRoom: null },
  { id: "6", name: "Diego Torres", avatar: "...", status: "busy", currentRoom: null },
];

const mockRooms: Room[] = [
  {
    id: "1",
    name: "Sala de Reuniones Principal",
    type: "conference",
    capacity: 20,
    description: "Sala para reuniones grandes",
    users: [mockUsers[0], mockUsers[1], mockUsers[2]],
  },
  {
    id: "2",
    name: "Oficina - Marketing",
    type: "office",
    capacity: 8,
    users: [mockUsers[3], mockUsers[4]],
  },
  {
    id: "3",
    name: "Sala de Conferencias",
    type: "meeting",
    capacity: 15,
    users: [],
  },
  {
    id: "4",
    name: "Área de Descanso",
    type: "lounge",
    capacity: 10,
    users: [mockUsers[5]],
  },
];

export function VirtualOfficeView({ onBackToProfile }: VirtualOfficeViewProps) {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleJoinRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room && !room.isLocked) {
      setCurrentRoom(room);
    }
  };

  const handleLeaveRoom = () => setCurrentRoom(null);

  const handleCreateRoom = (data: { name: string; type: Room["type"]; capacity: number; isLocked: boolean }) => {
    const newRoom: Room = {
      id: crypto.randomUUID(),
      name: data.name,
      type: data.type,
      capacity: data.capacity,
      users: [],
      isLocked: data.isLocked,
    };

    setRooms(r => [...r, newRoom]);
    setIsCreateDialogOpen(false);
  };

  if (currentRoom) {
    return (
      <VirtualOffice
        room={currentRoom}
        users={currentRoom.users}
        onLeave={handleLeaveRoom}
      />
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Oficina Virtual</h1>

      <button
        className="px-3 py-2 bg-slate-800 text-white rounded flex items-center gap-2"
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <Plus /> Crear Oficina
      </button>

      <div className="grid grid-cols-3 gap-4">
        {rooms.map((room) => {
          const Icon = {
            conference: Presentation,
            meeting: Video,
            office: Users,
            lounge: Coffee
          }[room.type] || MessageSquare;

          return (
            <div
              key={room.id}
              className="p-4 border rounded cursor-pointer hover:shadow"
              onClick={() => handleJoinRoom(room.id)}
            >
              <Icon className="w-5 h-5" />
              <p>{room.name}</p>
              <p>{room.users.length}/{room.capacity}</p>
            </div>
          );
        })}
      </div>

      <CreateRoomDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}
