
import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface UnlockPasswordProps {
  password: string;
  onPasswordChange: (password: string) => void;
  onProcess: () => void;
}

export function UnlockPassword({ password, onPasswordChange, onProcess }: UnlockPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <Lock size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-amber-900">Password required</p>
          <p className="text-xs text-amber-700 mt-0.5">
            This PDF is locked with an open password. Enter it below — it will be completely
            removed from the downloaded file.
          </p>
        </div>
      </div>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Enter the document password"
          autoComplete="current-password"
          autoFocus
          className="w-full px-4 py-2 pr-10 border border-amber-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
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
