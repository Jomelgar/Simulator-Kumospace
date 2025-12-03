import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { UserAvatar } from "./UserAvatar";
import { Badge } from "../ui/badge";
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone,
  Settings,
  Users,
  MessageSquare
} from "lucide-react";
import type { Room } from "./VirtualOfficeView";
import type { LucideIcon } from "lucide-react";

interface RoomInteriorProps {
  room: Room;
  allRooms: Room[];
  onLeave: () => void;
  onMoveToRoom: (roomId: string) => void;
}

export function RoomInterior({ room, allRooms, onLeave, onMoveToRoom }: RoomInteriorProps) {
  const otherRooms = allRooms.filter(r => r.id !== room.id && !r.isLocked);

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header de la sala */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onLeave}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Salir
              </Button>
              <div>
                <h2 className="text-slate-900">{room.name}</h2>
                <p className="text-sm text-slate-500">
                  {room.users.length} {room.users.length === 1 ? "persona" : "personas"} en la sala
                </p>
              </div>
            </div>

            {/* Controles de la sala */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Mic className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={onLeave}>
                <Phone className="w-4 h-4 rotate-135" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Área principal - Usuarios en la sala */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h3 className="text-slate-900 mb-4">Participantes en esta sala</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {room.users.map((user) => (
                  <div 
                    key={user.id}
                    className="bg-slate-50 rounded-lg p-4 flex flex-col items-center gap-3 border border-slate-200"
                  >
                    <UserAvatar user={user} size="lg" showStatus />
                    <div className="text-center">
                      <p className="text-sm text-slate-900">{user.name}</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center">
                          <Mic className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                          <Video className="w-3 h-3 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Área de video/contenido compartido (placeholder) */}
            <Card className="p-6">
              <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400">Pantalla compartida</p>
                  <p className="text-sm text-slate-500">No hay contenido compartido actualmente</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Otras salas disponibles */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-slate-900 mb-4">Otros espacios disponibles</h3>
              <div className="space-y-2">
                {otherRooms.map((otherRoom) => (
                  <button
                    key={otherRoom.id}
                    onClick={() => onMoveToRoom(otherRoom.id)}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 truncate group-hover:text-blue-700">
                          {otherRoom.name}
                        </p>
                        {otherRoom.users.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex -space-x-1">
                              {otherRoom.users.slice(0, 3).map((user) => (
                                <div key={user.id} className="ring-2 ring-white rounded-full">
                                  <UserAvatar user={user} size="sm" showStatus={false} />
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-slate-500 ml-1">
                              {otherRoom.users.length}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {otherRoom.type === "office" ? "Privada" : "Común"}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Información de la sala */}
            <Card className="p-4">
              <h3 className="text-slate-900 mb-3">Información de la sala</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tipo:</span>
                  <span className="text-slate-900">
                    {room.type === "office" ? "Oficina" : 
                     room.type === "conference" ? "Conferencia" :
                     room.type === "lounge" ? "Descanso" : "Reunión"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Capacidad:</span>
                  <span className="text-slate-900">{room.capacity} personas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Ocupación:</span>
                  <span className="text-slate-900">
                    {Math.round((room.users.length / room.capacity) * 100)}%
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
