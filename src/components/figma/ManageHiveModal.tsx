import { X, ImageIcon } from "lucide-react";
import { useState } from "react";
import {updateHive} from "../../api/hiveApi";
import type { Room } from "../../pages/Dashboard.tsx";

interface ManageHiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  onUpdate: (roomId: string, description: string, image?: File) => void;
}

export function ManageHiveModal({
  isOpen,
  onClose,
  room,
  onUpdateRoom,
}: ManageHiveModalProps) {
  const [description, setDescription] = useState(room.description || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    await updateHive(room.id,imageFile,description);
    onUpdateRoom();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-[50%] max-w-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
          <h2 className="text-xl text-zinc-900">Edit Hive</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm text-zinc-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-zinc-300 rounded-lg p-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="Enter a description for your Hive"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-zinc-700 mb-2">
              Hive Image
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-lg cursor-pointer hover:bg-zinc-200 transition-colors">
                <ImageIcon className="w-5 h-5 text-zinc-600" />
                <span className="text-sm text-zinc-700">
                  {imageFile ? imageFile.name : "Choose an image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
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
