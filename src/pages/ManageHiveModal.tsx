import { X, Users, Shield, Settings } from 'lucide-react';
import { useState } from 'react';
import type { Room } from '../App';

interface ManageHiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  onUpdateRoom: (roomId: string, maxUsers: number) => void;
}

export function ManageHiveModal({ isOpen, onClose, room, onUpdateRoom }: ManageHiveModalProps) {
  const [maxUsers, setMaxUsers] = useState(room.maxUsers);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRoom(room.id, maxUsers);
    onClose();
  };

  const hiveSizes = [
    { value: 4, label: 'Small (4 members)', description: 'Ideal for small teams' },
    { value: 8, label: 'Medium (8 members)', description: 'Perfect for mid-size groups' },
    { value: 15, label: 'Large (15 members)', description: 'Great for larger teams' },
    { value: 20, label: 'Extra Large (20 members)', description: 'For big organizations' },
    { value: 25, label: 'Enterprise (25 members)', description: 'Maximum capacity' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl text-zinc-900">Manage Hive</h2>
              <p className="text-sm text-zinc-500">{room.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Current Status */}
          <div className="bg-zinc-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-zinc-600" />
                <div>
                  <p className="text-sm text-zinc-600">Current Occupancy</p>
                  <p className="text-zinc-900">
                    {room.usersInside} / {room.maxUsers} members
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-zinc-600">Administrator</span>
              </div>
            </div>
          </div>

          {/* Hive Size Selection */}
          <div className="mb-6">
            <label className="block text-sm text-zinc-700 mb-3">
              Hive Capacity
            </label>
            <div className="space-y-2">
              {hiveSizes.map((size) => (
                <label
                  key={size.value}
                  className={`
                    flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${maxUsers === size.value 
                      ? 'border-zinc-900 bg-zinc-50' 
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="maxUsers"
                      value={size.value}
                      checked={maxUsers === size.value}
                      onChange={(e) => setMaxUsers(Number(e.target.value))}
                      className="w-4 h-4 text-zinc-900 focus:ring-zinc-900"
                    />
                    <div>
                      <p className="text-zinc-900">{size.label}</p>
                      <p className="text-sm text-zinc-500">{size.description}</p>
                    </div>
                  </div>
                  {maxUsers === size.value && (
                    <div className="w-2 h-2 rounded-full bg-zinc-900" />
                  )}
                </label>
              ))}
            </div>
            {maxUsers < room.usersInside && (
              <p className="mt-3 text-sm text-red-600 flex items-center gap-2">
                ⚠️ Warning: Current occupancy ({room.usersInside}) exceeds the selected capacity
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}