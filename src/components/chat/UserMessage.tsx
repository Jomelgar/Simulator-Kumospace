import React from "react";
import "./UserMessage.css";

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
    <div className="relative max-w-xs w-full animate-slide-in-right rounded-2xl shadow-2xl overflow-hidden
                    bg-black/90 border border-amber-500/50">

      {/* Hexágonos amarillos brillantes en los bordes */}
      <div className="absolute inset-0 pointer-events-none bg-hexagon-yellow-border bg-hexagon-gradient"></div>

      <div className="relative flex gap-3 p-3">
        {/* Avatar hexagonal */}
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center
                        bg-amber-500 font-bold border-2
                        border-zinc-600 rounded-full text-zinc-600 font-xl">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className=" w-full h-full object-cover" />
          ) : (
            username[0].toUpperCase()
          )}
        </div>

        {/* Contenido del mensaje */}
        <div className="flex-1 flex flex-col gap-1 text-zinc-600">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{username}</span>
            <div className="flex items-center gap-2">
              {timestamp && <span className=" text-xs">{timestamp}</span>}
              <button
                className="text-zinc-500 hover:text-zinc-200 text-sm font-bold"
                onClick={() => onClose(id)}
              >
                X
              </button>
            </div>
          </div>
          <p className=" text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
