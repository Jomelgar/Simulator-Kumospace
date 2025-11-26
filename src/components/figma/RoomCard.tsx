import { Card } from "../ui/card";
import { UserAvatar } from "./UserAvatar";
import { Badge } from "../ui/badge";
import { Lock } from "lucide-react";
import type { Room } from "./VirtualOfficeView";
import type { LucideIcon } from "lucide-react";

interface RoomCardProps {
  room: Room;
  icon: LucideIcon;
  onJoin: (roomId: string) => void;
}

export function RoomCard({ room, icon: Icon, onJoin }: RoomCardProps) {
  const isEmpty = room.users.length === 0;

  const getTypeLabel = (type: Room["type"]) => {
    switch (type) {
      case "conference":
      case "meeting":
      case "lounge":
        return "Sala Común";
      case "office":
        return "Oficina Privada";
    }
  };

  return (
    <Card
      className={`group transition-all duration-200 overflow-hidden ${
        room.isLocked
          ? "opacity-60 cursor-not-allowed"
          : "hover:shadow-lg hover:border-blue-300 cursor-pointer"
      }`}
      onClick={() => !room.isLocked && onJoin(room.id)}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <Icon className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-slate-900 truncate">{room.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-xs">
                {getTypeLabel(room.type)}
              </Badge>
              {room.isLocked && <Lock className="w-3 h-3 text-slate-400" />}
            </div>
          </div>
        </div>

        {!isEmpty && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <div className="flex -space-x-2">
              {room.users.slice(0, 4).map((user) => (
                <div key={user.id} className="ring-2 ring-white rounded-full">
                  <UserAvatar user={user} size="sm" showStatus={false} />
                </div>
              ))}
            </div>
            <span className="text-xs text-slate-600">
              {room.users.length}{" "}
              {room.users.length === 1 ? "persona" : "personas"}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
