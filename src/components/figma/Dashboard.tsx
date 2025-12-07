import { Crown, Link2, Plus, MessageSquare } from "lucide-react";
import { useState } from "react";
import {createHive} from "../../api/hiveApi";
import type { Hive, Room, User } from "../../pages/Dashboard";
import { RoomCardDB } from "./RoomCardDB";
import { ImageWithFallback } from "./ImageWithFallback";
import { JoinByURLModal } from "./JoinByURLModal";
import { CreateHiveModal } from "./CreateHiveModal";
import { create } from "domain";

interface DashboardProps {
  hiveData: Hive;
  rooms: Room[];
  users: User[];
  onJoinRoom: (room: Room) => void;
  onUpdateRoom: (roomId: string, maxUsers: number) => void;
}

export function Dashboard({
  hiveData,
  rooms,
  users,
  onJoinRoom,
  onUpdateRoom,
}: DashboardProps) {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleJoinByURL = () => {
    onUpdateRoom('', 0);
  };

  const handleCreateHive = async (name: string, size: number, url: string) => {
    const response = await createHive(name,size);
    if(response?.status === 200)
    {
      alert("Hive created");
      onUpdateRoom();
    }else 
    {
      alert("Error creating Hive. Please try again.");
    }

  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-[1200px] mx-auto px-12 py-12">
        {/* Simple Header */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h1 className="text-4xl text-zinc-900 mb-2">Your Hives</h1>
              <p className="text-zinc-500">Workspaces you have access to</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="px-5 py-2.5 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors flex items-center gap-2 text-zinc-700"
              >
                <Link2 className="w-4 h-4" />
                Join by URL
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Hive
              </button>
            </div>
          </div>
        </div>

        {/* Hives Grid */}
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {rooms.map((room) => (
                <RoomCardDB
                  key={room.id}
                  room={room}
                  icon={MessageSquare}
                  onJoin={(roomId: string) => {
                    const target = rooms.find((r) => r.id === roomId);
                    if (target) onJoinRoom(target);
                  }}
                  onUpdateRoom={onUpdateRoom}
                />
                
            ))}
            </div>
          ) : (
            <div className="flex gap-6 border-b w-full">
              <div className=" text-zinc-500 mt-4 mb-4 col-span-full text-lg">
                No hay Hives disponibles. Crea uno o únete a un Hive existente.
              </div>
            </div>
        )}
      </div>

      {/* Join by URL Modal */}
      <JoinByURLModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinByURL}
      />

      {/* Create Hive Modal */}
      <CreateHiveModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateHive}
      />
    </div>
  );
}
