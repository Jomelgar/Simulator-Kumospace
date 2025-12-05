import React from "react";
import './UserMessage.css';

interface UserMessageProps {
  id: string;
  username: string;
  message: string;
  avatarUrl?: string;
  timestamp?: string;
  onClose: (id: string) => void;
}

export function UserMessage({
  id,
  username,
  message,
  avatarUrl,
  timestamp,
  onClose,
}: UserMessageProps) {
  return (
    <div className="max-w-xs w-full bg-white shadow-lg rounded-lg p-3 flex items-start gap-3 animate-slide-in-right border border-zinc-200 relative">
      {/* Botón de cierre */}
      <button
        className="absolute top-1 right-2 text-zinc-400 hover:text-zinc-600 text-sm font-bold"
        onClick={() => onClose(id)}
      >
        ×
      </button>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-200 flex-shrink-0 flex items-center justify-center text-zinc-500 font-bold">
        {avatarUrl ? (
          <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
        ) : (
          username[0].toUpperCase()
        )}
      </div>

      {/* Contenido del mensaje */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-zinc-900">{username}</span>
          {timestamp && <span className="text-zinc-400 text-xs">{timestamp}</span>}
        </div>
        <p className="text-zinc-700 text-sm mt-1">{message}</p>
      </div>
    </div>
  );
}
