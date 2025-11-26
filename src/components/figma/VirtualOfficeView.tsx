import { useState } from "react";
import { Users, Video, Coffee, Presentation, MessageSquare, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { CreateRoomDialog } from "./CreateRoomDialog";
import { OfficeHeader } from "./OfficeHeader";
import { RoomCard } from "./RoomCard";
import { RoomInterior } from "./RoomInterior";

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: "available" | "busy" | "away";
}

export interface Room {
  id: string;
  name: string;
  type: "meeting" | "office" | "lounge" | "conference";
  capacity: number;
  users: User[];
  isLocked?: boolean;
}

interface VirtualOfficeViewProps {
  onBackToProfile: () => void;
  spaceId: string | null;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Ana García",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    status: "available",
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    status: "busy",
  },
  {
    id: "3",
    name: "María López",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    status: "available",
  },
  {
    id: "4",
    name: "Jorge Martínez",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    status: "available",
  },
  {
    id: "5",
    name: "Laura Sánchez",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    status: "away",
  },
  {
    id: "6",
    name: "Diego Torres",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    status: "busy",
  },
];

const mockRooms: Room[] = [
  {
    id: "1",
    name: "Sala de Reuniones Principal",
    type: "conference",
    capacity: 20,
    users: [mockUsers[0], mockUsers[1], mockUsers[2]],
  },
  {
    id: "2",
    name: "Oficina - Equipo Marketing",
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
  {
    id: "5",
    name: "Oficina - Desarrollo",
    type: "office",
    capacity: 12,
    users: [mockUsers[0], mockUsers[2], mockUsers[3]],
  },
  {
    id: "6",
    name: "Sala Privada - Dirección",
    type: "meeting",
    capacity: 6,
    users: [],
    isLocked: true,
  },
];

export function VirtualOfficeView({
  onBackToProfile,
  spaceId,
}: VirtualOfficeViewProps) {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [selectedView, setSelectedView] = useState<"grid" | "map">("grid");
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleJoinRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room && !room.isLocked) {
      setCurrentRoom(roomId);
    }
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };

  const handleMoveToRoom = (roomId: string) => {
    setCurrentRoom(roomId);
  };

  const handleCreateRoom = (roomData: {
    name: string;
    type: Room["type"];
    capacity: number;
    isLocked: boolean;
  }) => {
    const newRoom: Room = {
      id: String(rooms.length + 1),
      name: roomData.name,
      type: roomData.type,
      capacity: roomData.capacity,
      users: [],
      isLocked: roomData.isLocked,
    };
    setRooms([...rooms, newRoom]);
    setIsCreateDialogOpen(false);
  };

  const getRoomIcon = (type: Room["type"]) => {
    switch (type) {
      case "conference":
        return Presentation;
      case "meeting":
        return Video;
      case "office":
        return Users;
      case "lounge":
        return Coffee;
      default:
        return MessageSquare;
    }
  };

  // If we're inside a room, render its interior
  if (currentRoom) {
    const room = rooms.find((r) => r.id === currentRoom);
    if (room) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <OfficeHeader
            currentView={selectedView}
            onViewChange={setSelectedView}
            onProfileClick={onBackToProfile}
          />
          <RoomInterior
            room={room}
            allRooms={rooms}
            onLeave={handleLeaveRoom}
            onMoveToRoom={handleMoveToRoom}
          />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <OfficeHeader
        currentView={selectedView}
        onViewChange={setSelectedView}
        onProfileClick={onBackToProfile}
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-slate-900 mb-2">Oficina Virtual</h1>
            <p className="text-slate-600">
              Haz click en un espacio para unirte
              {spaceId ? ` (ID actual: ${spaceId})` : ""}
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Crear Oficina
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              icon={getRoomIcon(room.type)}
              onJoin={handleJoinRoom}
            />
          ))}
        </div>
      </main>

      <CreateRoomDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}
