import { X } from 'lucide-react';
import { useState } from 'react';
import { joinByCode } from '../../api/hiveApi';

interface JoinByURLModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: () => void;
}

export function JoinByURLModal({ isOpen, onClose, onJoin }: JoinByURLModalProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const extractCode = (input: string): string | null => {
    const trimmed = input.trim();
    const urlMatch = trimmed.match(/[?&]code=([^&]+)/i);
    if (urlMatch) return urlMatch[1];
    if (/^[A-Z0-9_-]{8,}$/i.test(trimmed)) return trimmed.toUpperCase();
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = extractCode(url);
    
    if (!code) {
      setError('Código de invitación inválido. Ingresa la URL completa o solo el código.');
      return;
    }

    setLoading(true);
    try {
      const response = await joinByCode(code);
      if (response?.status === 200) {
        setUrl('');
        onJoin();
        onClose();
        window.location.reload();
      } else {
        setError(response?.data?.message || 'Error al unirse a la Hive');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al unirse a la Hive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
          <h2 className="text-xl text-zinc-900">Join a Hive</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm text-zinc-700 mb-2">
              Hive URL or Invite Code
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://roomshive.com/invite/abc123"
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              autoFocus
            />
            <p className="mt-2 text-xs text-zinc-500">
              Ingresa el enlace de invitacion o el codigo compartido contigo
            </p>
            {error && (
              <p className="mt-2 text-xs text-red-600">{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url.trim() || loading}
              className="flex-1 px-4 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uniéndose...' : 'Unirse a Hive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
