import { X, Hexagon } from 'lucide-react';
import { useState } from 'react';

interface CreateHiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, size: number, url: string) => void;
}

const HIVE_SIZES = [
  { label: '1 Work Room', value: 1 },
  { label: '2 Work Rooms', value: 2 },
  { label: '3 Work Rooms', value: 3 },
  { label: '4 Work Rooms', value: 4 },
  { label: '6 Work Rooms', value: 6 },
];

export function CreateHiveModal({ isOpen, onClose, onCreate }: CreateHiveModalProps) {
  const [hiveName, setHiveName] = useState('');
  const [selectedSize, setSelectedSize] = useState<number>(1);
  const [customURL, setCustomURL] = useState('');
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});

  if (!isOpen) return null;

  const validateFields = () => {
    const newErrors: { name?: string; url?: string } = {};
    if (!hiveName.trim()) {
      newErrors.name = 'Hive name is required';
    } else if (hiveName.length < 3) {
      newErrors.name = 'Hive name must be at least 3 characters';
    }
    /*
    if (customURL) {
      const regex = /^[a-z0-9-]+$/;
      if (!regex.test(customURL)) {
        newErrors.url = 'URL can only contain lowercase letters, numbers and hyphens';
      }
      if (customURL.length < 3) {
        newErrors.url = 'URL must be at least 3 characters';
      }
    }
    */
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (validateFields()) {
      onCreate(hiveName.trim(), selectedSize, customURL.trim());
      setHiveName('');
      setSelectedSize(1);
      setCustomURL('');
      setErrors({});
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Hexagon className="w-5 h-5 text-yellow-600" fill="currentColor" />
            </div>
            <h2 className="text-xl text-zinc-900">Create New Hive</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors text-zinc-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Hive Name */}
          <div>
            <label className="block text-sm text-zinc-700 mb-2">
              Hive Name
            </label>
            <input
              type="text"
              value={hiveName}
              onChange={(e) => setHiveName(e.target.value)}
              placeholder="Enter hive name"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-zinc-900 placeholder-zinc-400
                ${errors.name ? 'border-red-500' : 'border-zinc-300'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm text-zinc-700 mb-3">
              Hive Work Rooms (With 4 as Max Users as Default)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {HIVE_SIZES.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedSize(option.value)}
                  className={`
                    px-4 py-3 rounded-lg border transition-all text-sm
                    ${selectedSize === option.value
                      ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                      : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/*{ Custom URL }
          <div>
            <label className="block text-sm text-zinc-700 mb-2">
              Custom URL <span className="text-zinc-400">(optional)</span>
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-transparent">
              <span className="px-4 py-3 bg-zinc-50 text-zinc-500 text-sm border-r border-zinc-300">
                roomshive.com/
              </span>
              <input
                type="text"
                value={customURL}
                onChange={(e) => setCustomURL(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="your-hive-url"
                className={`flex-1 px-4 py-3 focus:outline-none text-zinc-900 placeholder-zinc-400 ${errors.url ? 'border-red-500' : ''}`}
              />
            </div>
              {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
          </div>
            */}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!hiveName.trim() || Object.keys(errors).length > 0}
            className={`
              flex-1 px-4 py-3 rounded-lg transition-colors
              ${hiveName.trim() && Object.keys(errors).length === 0
                ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              }
            `}
          >
            Create Hive
          </button>
        </div>
      </div>
    </div>
  );
}
