import { useState } from 'react';
import { ArrowLeft, Users, Send, Video, Mic, Share2, LogOut, Hexagon } from 'lucide-react';
import type { Room, User } from './VirtualOfficeView';

interface VirtualOfficeProps {
  room: Room;
  users: User[];
  onLeave: () => void;
}

export function VirtualOffice({ room, users, onLeave }: VirtualOfficeProps) {
  const [message, setMessage] = useState('');
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  const mockMessages = [
    { id: 1, user: 'Sarah Chen', avatar: '...', message: 'Welcome to the room!', time: '10:30 AM' },
    { id: 2, user: 'Marcus', avatar: '...', message: 'Let´s start!', time: '10:32 AM' },
  ];

  const handleSend = () => {
    if (message.trim()) setMessage('');
  };

  const getHexPosition = (index: number) => {
    const p = [
      { x: 50, y: 30 },
      { x: 25, y: 50 },
      { x: 75, y: 50 },
      { x: 35, y: 70 },
      { x: 65, y: 70 },
      { x: 50, y: 90 },
    ];
    return p[index % p.length];
  };

  const statusColor = {
    available: "border-green-500",
    online: "border-green-500",
    busy: "border-yellow-500",
    away: "border-zinc-400",
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* HEADER */}
        <div className="p-4 border-b flex justify-between">
          <button onClick={onLeave} className="btn"> <ArrowLeft /> </button>
          <div>
            <h2 className="text-xl">{room.name}</h2>
            {room.description && <p className="text-sm">{room.description}</p>}
          </div>
          <button onClick={onLeave} className="btn bg-red-500 text-white flex items-center gap-2">
            <LogOut /> Leave
          </button>
        </div>

        {/* GRID */}
        <div className="flex-1 relative bg-zinc-50">
          {users.map((u, i) => {
            const pos = getHexPosition(i);
            const hovered = hoveredUser === u.id;

            return (
              <div
                key={u.id}
                className="absolute"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
                onMouseEnter={() => setHoveredUser(u.id)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                <div className="relative group">
                  <svg width="120" height="104" viewBox="0 0 120 104">
                    <polygon
                      points="60,2 110,28 110,76 60,102 10,76 10,28"
                      fill="none"
                      strokeWidth="2"
                      className={`${statusColor[u.status]} ${hovered ? "stroke-yellow-500" : ""}`}
                    />
                  </svg>
                  <img src={u.avatar} className="absolute w-20 h-20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT */}
      <aside className="w-80 border-l flex flex-col">
        <header className="p-3 border-b flex items-center gap-2">
          <Hexagon /> Chat
        </header>

        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {mockMessages.map(m => (
            <div key={m.id} className="flex gap-2">
              <img src={m.avatar} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm">{m.user}</p>
                <span className="text-xs text-zinc-500">{m.time}</span>
                <p className="bg-white border px-2 py-1 rounded">{m.message}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="p-3 flex gap-2 border-t">
          <input
            className="border flex-1 px-2"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button className="p-2 bg-yellow-500 text-white" onClick={handleSend}>
            <Send />
          </button>
        </footer>
      </aside>
    </div>
  );
}
