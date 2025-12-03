import { Crown, MapPin } from 'lucide-react';
import type { User } from '../../pages/Dashboard';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const statusColors = {
    online: 'bg-green-500',
    busy: 'bg-yellow-500',
    away: 'bg-zinc-300'
  };

  const statusText = {
    online: 'Online',
    busy: 'In focus',
    away: 'Away'
  };

  return (
    <div className="bg-white rounded-xl p-4 hover:shadow-lg hover:shadow-zinc-900/5 transition-all border border-transparent hover:border-zinc-200">
      <div className="flex items-start gap-3">
        {/* Avatar with status */}
        <div className="relative flex-shrink-0">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${statusColors[user.status]} rounded-full border-2 border-white`} />
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-zinc-900 truncate">{user.name}</span>
            {user.role === 'Hive Queen' && (
              <Crown className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" fill="currentColor" />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span>{statusText[user.status]}</span>
            {user.currentRoom && (
              <>
                <span>•</span>
                <MapPin className="w-3 h-3" />
                <span className="truncate">{user.currentRoom}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}