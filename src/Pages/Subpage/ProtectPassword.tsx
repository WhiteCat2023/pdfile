
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ProtectPasswordProps {
  password: string;
  onPasswordChange: (password: string) => void;
  onProcess: () => void;
}

export function ProtectPassword({ password, onPasswordChange, onProcess }: ProtectPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4 p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
      <label className="block text-sm font-bold text-zinc-800 mb-1">
        Password <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-zinc-500 mb-3">
        Encrypts the PDF so it cannot be viewed without the password. Anyone trying to open the file will be prompted to enter it.
      </p>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Enter a password"
          autoComplete="new-password"
          className="w-full px-4 py-2 pr-10 border border-zinc-200 bg-zinc-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
          onKeyDown={(e) => { if (e.key === 'Enter') onProcess(); }}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
