import { X, ImageIcon, Link2, Copy, Check } from "lucide-react";
import { useState } from "react";
import {updateHive, generateInviteCode} from "../../api/hiveApi";
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
  const [inviteUrl, setInviteUrl] = useState<string>("");
  const [inviteCode, setInviteCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerateInvite = async () => {
    setLoading(true);
    try {
      const response = await generateInviteCode(room.id);
      if (response?.status === 200) {
        setInviteCode(response.data.invite_code);
        setInviteUrl(response.data.invite_url);
      }
    } catch (error) {
      console.error("Error generando código:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    await updateHive(room.id,imageFile,description);
    setImageFile(null);
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

          {/* Invite Code Section */}
          <div className="border-t border-zinc-200 pt-6">
            <label className="block text-sm text-zinc-700 mb-3">
              Invitar a la Hive
            </label>
            {!inviteUrl ? (
              <button
                type="button"
                onClick={handleGenerateInvite}
                disabled={loading}
                className="w-full px-4 py-3 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Link2 className="w-4 h-4" />
                {loading ? "Generando..." : "Generar URL de Invitación"}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <input
                    type="text"
                    value={inviteUrl}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-zinc-700 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 hover:bg-zinc-200 rounded transition-colors"
                    title="Copiar URL"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-zinc-600" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-zinc-500">
                  Código: <span className="font-mono font-semibold">{inviteCode}</span>
                </p>
                <button
                  type="button"
                  onClick={handleGenerateInvite}
                  className="text-xs text-zinc-600 hover:text-zinc-900 underline"
                >
                  Regenerar código
                </button>
              </div>
            )}
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
                <input type="file" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setImageFile(file);}} 
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
