import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { User } from "./VirtualOfficeView";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
}

export function UserAvatar({ user, size = "md", showStatus = false }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const statusColors = {
    available: "bg-green-500",
    busy: "bg-red-500",
    away: "bg-amber-500",
  };

  const statusSize = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  // Generar colores de avatar consistentes basados en el nombre
  const getAvatarColor = (name: string) => {
    const colors = [
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
      "from-pink-400 to-pink-600",
      "from-green-400 to-green-600",
      "from-orange-400 to-orange-600",
      "from-cyan-400 to-cyan-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative inline-block">
      <Avatar className={`${sizeClasses[size]} ring-2 ring-white`}>
        <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor(user.name)} text-white`}>
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      {showStatus && (
        <div
          className={`absolute bottom-0 right-0 ${statusSize[size]} ${statusColors[user.status]} rounded-full ring-2 ring-white`}
          title={user.status}
        />
      )}
    </div>
  );
}