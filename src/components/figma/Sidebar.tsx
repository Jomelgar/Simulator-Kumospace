//import image_b5f349cba521d3f5fa0b9c2e7af4f0d01762039d from 'figma:asset/b5f349cba521d3f5fa0b9c2e7af4f0d01762039d.png';
//import image_457a7d0109f496c4b9228e329ab7c74dc308af9c from '../../asset/logo.ng';
import { LayoutDashboard, User, LogOutIcon,MessageCircle } from "lucide-react";
import logo from "../../asset/logo2.png";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "chat", icon: MessageCircle, label: "Chat"},
    { id: "LogOut", icon: LogOutIcon, label: "Cerrar Sesión"},
  ];

  return (
    <div className="w-20 bg-zinc-900 border-r border-zinc-200 flex flex-col items-center py-8 gap-2">
      {/* Logo */}
      <div className="mb-8 relative group cursor-pointer">
        <div className="w-12 h-12 flex items-center justify-center">
          <img
            src={logo}
            alt="Rooms Hive"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`
                w-14 h-14 rounded-xl flex items-center justify-center relative group transition-all
                ${
                  isActive
                    ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }
              `}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <div className="absolute inset-0 bg-yellow-400/20 rounded-xl blur-lg" />
              )}
              {/* Tooltip */}
              <div
                className={`
                absolute left-full ml-2 px-3 py-1.5 bg-zinc-800 text-white text-sm rounded-lg whitespace-nowrap
                opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50
              `}
              >
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Avatar */}
      <div className="mt-auto"></div>
    </div>
  );
}
