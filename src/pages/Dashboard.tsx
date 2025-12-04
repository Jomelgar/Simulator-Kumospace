import { useEffect, useState } from "react";
import { Sidebar } from "../components/figma/Sidebar";
import { Dashboard } from "../components/figma/Dashboard";
import { VirtualOfficeDB } from "../components/figma/VirtualOfficeDB";
import { getHive} from "../api/hiveApi";
import {logoutRequest} from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { ProfileView } from "../components/figma/ProfileView";
import "./Dashboard.css";
export type UserRole = "Hive Queen" | "Bee";
/*
{
      id: "1",
      name: "Strategy Room",
      type: "conference",
      capacity: 8,
      users: users.filter((u) => u.currentRoom === "Strategy Room"),
      description: "Executive planning and strategy",
      userRole: "Bee",
    },
*/
export interface Room {
  id: string;
  name: string;
  type: "meeting" | "office" | "lounge" | "conference";
  capacity: number;
  users: User[];
  isLocked?: boolean;
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

function App() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "profile" | "virtual-office"
  >("dashboard");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const navigate = useNavigate();

  // Mock data
  const hiveData: Hive = {
    name: "Design Team Hive",
    description: "Collaborative workspace for the design team",
    totalUsers: 24,
    userRole: "Hive Queen",
  };

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

  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRooms = async()=>{
    const response = await getHive();
    if(response?.status === 200)
    {
      setRooms(response.data.map((d) => ({
        id: d.id_hive,
        name: d.hive_name,
        description: d.description || "Enter to the Hive",
        userRole: d.user_role === true? "Hive Queen" : "User",
        maxUsers: d.max_count,
      })));
    }
  }
  useEffect(()=>{
    fetchRooms();
  },[]);
  const handleJoinRoom = (room: Room) => {
    const roomWithUsers = {
      ...room,
      users: users.filter((u) => u.currentRoom === room.name),
    };
    setSelectedRoom(roomWithUsers);
    setCurrentView("virtual-office");
  };

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
    setCurrentView("dashboard");
  };

  const handleNavigation = async (item: string) => {
    setActiveNavItem(item);
    if (item === "dashboard") {
      setCurrentView("dashboard");
    } else if (item === "profile") {
      setCurrentView("profile");
    }else if (item === "LogOut") {
      await logoutRequest();
      navigate("/login");
    }
  };

  const handleUpdateRoom = (roomId: string, capacity: number) => {
    fetchRooms();
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
          <VirtualOfficeDB
            room={selectedRoom}
            users={users.filter((u) => u.currentRoom === selectedRoom.name)}
            onLeave={handleLeaveRoom}
          />
        )}
      </div>
    </div>
  );
}

export default App;
