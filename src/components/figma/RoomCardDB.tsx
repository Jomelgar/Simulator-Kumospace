import { Users, Lock, Crown, Settings, Shield, UserCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Room } from "../../pages/Dashboard.tsx";
import { ImageWithFallback } from "./ImageWithFallback.tsx";
import { ManageHiveModal } from "./ManageHiveModal.tsx";

interface RoomCardDBProps {
  room: Room;
  onJoin: (room: Room) => void;
  onUpdateRoom: (roomId: string, maxUsers: number) => void;
}

const roomImages: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1744095407215-66e40734e23a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  "2": "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  "3": "https://images.unsplash.com/photo-1630283017802-785b7aff9aac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  "4": "https://images.unsplash.com/photo-1600508774764-4ce704363d66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  "5": "https://images.unsplash.com/photo-1652422485236-886645c581a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  "6": "https://images.unsplash.com/photo-1692133226337-55e513450a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
};

export function RoomCardDB({ room, onJoin, onUpdateRoom }: RoomCardDBProps) {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const isPrivate = room?.type === "private";
  const isFull = room?.usersInside >= room?.maxUsers;
  const isAdministrator = room?.userRole === "Hive Queen";
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-zinc-900/5 transition-all group">
        {/* Image */}
        <div className="relative h-48 bg-zinc-100 overflow-hidden">
          <ImageWithFallback
            src={room?.imageURL || roomImages[room.id % 6]}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Overlay info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
              <Users className="w-4 h-4" />
              <span>
                {room?.usersInside || 0} / {room?.maxUsers || 0} members
              </span>
            </div>
          </div>

          {/* Administrator badge */}
          {isAdministrator && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white rounded-md text-xs border border-white/20">
                <Settings className="w-3 h-3" />
                Hive Queen
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl text-zinc-900 mb-1">{room.name}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {room.description}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mb-4">
            {room?.userRole === "Hive Queen" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-md text-xs">
                <Crown className="w-3 h-3" fill="currentColor" />
                Hive Queen
              </span>
            )}
            {room?.userRole === "Bee" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs">
                <UserCheck className="w-3 h-3" />
                Bee
              </span>
            )}
            {isFull && (
              <span className="inline-flex items-center px-2.5 py-1 bg-red-50 text-red-700 rounded-md text-xs">
                Full
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isAdministrator && (
              <button
                onClick={() => setIsManageModalOpen(true)}
                className="flex-1 py-3 px-4 rounded-lg transition-all border border-zinc-300 text-zinc-700 hover:bg-zinc-50 flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage
              </button>
            )}
            <button
              onClick={() => navigate("/office")}
              disabled={isFull}
              className={`
                ${
                  isAdministrator ? "flex-1" : "w-full"
                } py-3 px-4 rounded-lg transition-all hover:scale-105
                ${
                  isFull
                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed hover:scale-105"
                    : "bg-zinc-900 text-white hover:bg-zinc-800 hover:scale-105"
                }
              `}
            >
              {isFull ? "Hive Full" : "Join Hive"}
            </button>
          </div>
        </div>
      </div>

      {/* Manage Modal */}
      <ManageHiveModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        room={room}
        onUpdateRoom={onUpdateRoom}
      />
    </>
  );
}
