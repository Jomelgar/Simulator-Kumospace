import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  LayoutGrid, 
  Map, 
  Settings, 
  Bell,
  Search,
  User
} from "lucide-react";
import { Input } from "../ui/input";

interface OfficeHeaderProps {
  currentView: "grid" | "map";
  onViewChange: (view: "grid" | "map") => void;
  onProfileClick?: () => void;
}

export function OfficeHeader({ currentView, onViewChange, onProfileClick }: OfficeHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white">VO</span>
            </div>
            <div>
              <h2 className="text-slate-900">Virtual Office</h2>
              <p className="text-xs text-slate-500">Espacio de trabajo colaborativo</p>
            </div>
          </div>

          {/* Búsqueda */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Buscar salas o usuarios..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Vista toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <Button
                variant={currentView === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("grid")}
                className="h-8"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={currentView === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange("map")}
                className="h-8"
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>

            {/* Notificaciones */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Configuración */}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>

            {/* Avatar usuario actual */}
            <button 
              onClick={onProfileClick}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            >
              <Avatar className="w-9 h-9 ring-2 ring-blue-500 ring-offset-2 cursor-pointer hover:ring-blue-600 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  MG
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}