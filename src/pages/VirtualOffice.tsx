import { useState } from 'react';
import { ArrowLeft, Users, Circle, Send, Video, Mic, Share2, LogOut, Hexagon } from 'lucide-react';
import type { Room, User } from '../App';

interface VirtualOfficeProps {
  room: Room;
  users: User[];
  onLeave: () => void;
}

export function VirtualOffice({ room, users, onLeave }: VirtualOfficeProps) {
  const [message, setMessage] = useState('');
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  const mockMessages = [
    { id: 1, user: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', message: 'Welcome to the room!', time: '10:30 AM' },
    { id: 2, user: 'Marcus Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', message: 'Let\'s start the collaboration', time: '10:32 AM' },
  ];

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  // Create a grid layout for users (honeycomb-inspired positions)
  const getHexPosition = (index: number) => {
    const positions = [
      { x: 50, y: 30 },
      { x: 25, y: 50 },
      { x: 75, y: 50 },
      { x: 35, y: 70 },
      { x: 65, y: 70 },
      { x: 50, y: 90 },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Main Office Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onLeave}
                className="w-10 h-10 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-all flex items-center justify-center group"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-600 group-hover:text-zinc-900" />
              </button>
              <div>
                <h2 className="text-xl text-zinc-900 flex items-center gap-2">
                  {room.name}
                </h2>
                <p className="text-sm text-zinc-500">{room.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-lg border border-zinc-200">
                <Users className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-zinc-900">{users.length} / {room.maxUsers}</span>
              </div>
              <button
                onClick={onLeave}
                className="px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Leave Room
              </button>
            </div>
          </div>
        </div>

        {/* Virtual Office Grid */}
        <div className="flex-1 relative overflow-hidden bg-zinc-50">
          {/* Honeycomb background pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexagons-office" width="100" height="86.6" patternUnits="userSpaceOnUse">
                  <polygon 
                    points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons-office)" className="text-yellow-600"/>
            </svg>
          </div>

          {/* User Grid */}
          <div className="absolute inset-0 p-8">
            <div className="relative w-full h-full">
              {users.map((user, index) => {
                const pos = getHexPosition(index);
                const isHovered = hoveredUser === user.id;
                const statusColors = {
                  online: 'border-green-500',
                  busy: 'border-yellow-500',
                  away: 'border-zinc-400'
                };

                return (
                  <div
                    key={user.id}
                    className="absolute transition-all duration-300"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onMouseEnter={() => setHoveredUser(user.id)}
                    onMouseLeave={() => setHoveredUser(null)}
                  >
                    {/* Hexagon container */}
                    <div className="relative group cursor-pointer">
                      {/* Glow effect */}
                      {isHovered && (
                        <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full" />
                      )}
                      
                      {/* Avatar with hexagon border */}
                      <div className="relative">
                        <svg width="120" height="104" viewBox="0 0 120 104" className="absolute inset-0">
                          <polygon
                            points="60,2 110,28 110,76 60,102 10,76 10,28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`${statusColors[user.status]} transition-all ${isHovered ? 'stroke-yellow-500' : ''}`}
                          />
                        </svg>
                        <div className="w-24 h-24 m-3 rounded-full overflow-hidden">
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Status indicator */}
                        <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
                          user.status === 'online' ? 'bg-green-500' :
                          user.status === 'busy' ? 'bg-yellow-500' :
                          'bg-zinc-400'
                        }`} />
                      </div>

                      {/* User info tooltip */}
                      <div className={`
                        absolute top-full mt-2 left-1/2 -translate-x-1/2 
                        bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 whitespace-nowrap
                        transition-all duration-200 z-10
                        ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                      `}>
                        <div className="text-sm text-white">{user.name}</div>
                        <div className="text-xs text-zinc-400 capitalize">{user.status}</div>
                      </div>

                      {/* Action buttons on hover */}
                      {isHovered && (
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                          <button className="w-8 h-8 rounded-full bg-white border border-zinc-200 hover:bg-green-500 hover:border-green-500 hover:text-white transition-all flex items-center justify-center shadow-lg">
                            <Video className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 rounded-full bg-white border border-zinc-200 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all flex items-center justify-center shadow-lg">
                            <Mic className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Empty slots hint */}
              {users.length < room.maxUsers && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                  <div className="text-sm text-zinc-400">
                    {room.maxUsers - users.length} more {room.maxUsers - users.length === 1 ? 'spot' : 'spots'} available
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Control Bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 bg-white/90 backdrop-blur-lg border border-zinc-200 rounded-2xl p-3 shadow-2xl">
            <button className="w-12 h-12 rounded-xl bg-zinc-100 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center group">
              <Video className="w-5 h-5 text-zinc-600 group-hover:text-white" />
            </button>
            <button className="w-12 h-12 rounded-xl bg-zinc-100 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center group">
              <Mic className="w-5 h-5 text-zinc-600 group-hover:text-white" />
            </button>
            <button className="w-12 h-12 rounded-xl bg-zinc-100 hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center group">
              <Share2 className="w-5 h-5 text-zinc-600 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 border-l border-zinc-200 bg-white flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-zinc-200">
          <h3 className="flex items-center gap-2 text-zinc-900">
            <Hexagon className="w-5 h-5 text-yellow-600" />
            Room Chat
          </h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
          {mockMessages.map(msg => (
            <div key={msg.id} className="flex gap-3">
              <img 
                src={msg.avatar} 
                alt={msg.user}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-zinc-900">{msg.user}</span>
                  <span className="text-xs text-zinc-400">{msg.time}</span>
                </div>
                <p className="text-sm text-zinc-700 bg-white border border-zinc-200 px-3 py-2 rounded-lg">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message the room..."
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-500 transition-colors"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition-all flex items-center justify-center text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}