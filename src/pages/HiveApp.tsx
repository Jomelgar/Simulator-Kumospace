import { useState } from "react";

import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import VirtualOffice from "./VirtualOffice";
import ProfileView from "./ProfileView";

export type UserRole = "administrator" | "supervisor" | "member";

export interface Room {
  id: string;
  name: string;
  type: "private" | "work";
  usersInside: number;
  maxUsers: number;
  description?: string;
  userRole?: UserRole;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "busy" | "away";
  currentRoom: string | null;
  role?: "Hive Queen" | "Bee";
}

export interface Hive {
  name: string;
  description: string;
  totalUsers: number;
  userRole: "Hive Queen" | "Bee";
}

export default function HiveApp() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "profile" | "virtual-office"
  >("dashboard");

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeNavItem, setActiveNavItem] = useState("dashboard");

  // Mock data
  const hiveData: Hive = {
    name: "Design Team Hive",
    description: "Collaborative workspace for the design team",
    totalUsers: 24,
    userRole: "Hive Queen",
  };

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      name: "Strategy Room",
      type: "private",
      usersInside: 5,
      maxUsers: 8,
      description: "Executive planning and strategy",
      userRole: "administrator",
    },
    {
      id: "2",
      name: "Design Studio",
      type: "private",
      usersInside: 3,
      maxUsers: 6,
      description: "Creative design workspace",
      userRole: "supervisor",
    },
    {
      id: "3",
      name: "Main Office",
      type: "work",
      usersInside: 12,
      maxUsers: 20,
      description: "General workspace",
      userRole: "member",
    },
    {
      id: "4",
      name: "Development Lab",
      type: "work",
      usersInside: 8,
      maxUsers: 15,
      description: "Code and development",
      userRole: "administrator",
    },
    {
      id: "5",
      name: "Meeting Room A",
      type: "work",
      usersInside: 4,
      maxUsers: 10,
      description: "Team meetings and presentations",
      userRole: "member",
    },
    {
      id: "6",
      name: "Focus Zone",
      type: "private",
      usersInside: 2,
      maxUsers: 4,
      description: "Deep work only",
      userRole: "administrator",
    },
  ]);

  const users: User[] = [
    {
      id: "1",
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      status: "online",
      currentRoom: "Main Office",
      role: "Hive Queen",
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      status: "busy",
      currentRoom: "Design Studio",
    },
    {
      id: "3",
      name: "Emily Watson",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      status: "online",
      currentRoom: "Development Lab",
    },
    {
      id: "4",
      name: "James Park",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      status: "away",
      currentRoom: null,
    },
    {
      id: "5",
      name: "Lisa Anderson",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      status: "online",
      currentRoom: "Main Office",
    },
    {
      id: "6",
      name: "David Kim",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
      status: "busy",
      currentRoom: "Focus Zone",
    },
    {
      id: "7",
      name: "Ana Martinez",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
      status: "online",
      currentRoom: "Main Office",
    },
    {
      id: "8",
      name: "Tom Wilson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      status: "online",
      currentRoom: "Development Lab",
    },
  ];

  const handleJoinRoom = (room: Room) => {
    setSelectedRoom(room);
    setCurrentView("virtual-office");
  };

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
    setCurrentView("dashboard");
  };

  const handleNavigation = (item: string) => {
    setActiveNavItem(item);
    if (item === "dashboard") setCurrentView("dashboard");
    if (item === "profile") setCurrentView("profile");
  };

  const handleUpdateRoom = (roomId: string, maxUsers: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, maxUsers } : room
      )
    );
  };

  return (
    <div className="flex h-screen bg-white text-zinc-900 overflow-hidden">
      <Sidebar activeItem={activeNavItem} onItemClick={handleNavigation} />

      <div className="flex-1 flex overflow-hidden">
        {currentView === "dashboard" && (
          <Dashboard
            hiveData={hiveData}
            rooms={rooms}
            users={users}
            onJoinRoom={handleJoinRoom}
            onUpdateRoom={handleUpdateRoom}
          />
        )}

        {currentView === "profile" && <ProfileView hiveData={hiveData} />}

        {currentView === "virtual-office" && selectedRoom && (
          <VirtualOffice
            room={selectedRoom}
            users={users.filter((u) => u.currentRoom === selectedRoom.name)}
            onLeave={handleLeaveRoom}
          />
        )}
      </div>
    </div>
  );
}
