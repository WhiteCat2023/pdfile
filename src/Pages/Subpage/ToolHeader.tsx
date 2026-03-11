
import { ArrowLeft, Loader2, Zap } from 'lucide-react';
import { Tool } from '../../types';

interface ToolHeaderProps {
  tool: Tool;
  onBack: () => void;
  files: File[];
  isProcessing: boolean;
  handleProcess: () => void;
}

export function ToolHeader({ tool, onBack, files, isProcessing, handleProcess }: ToolHeaderProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase">{tool.name}</h2>
          <p className="text-zinc-500 text-sm font-medium">{tool.description}</p>
        </div>
      </div>

      {files.length > 0 && (
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="px-8 py-3 bg-zinc-900 text-white rounded-full font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
          {isProcessing ? 'Processing...' : (
            tool.id === 'protect' ? 'Protect PDF' :
            tool.id === 'unlock'  ? 'Unlock PDF'  :
            tool.id === 'edit'    ? 'Save PDF'    :
            tool.id === 'pdf-to-jpg' ? 'Convert to JPG' :
            `Process ${files.length} File${files.length > 1 ? 's' : ''}`
          )}
        </button>
      )}
    </div>
  );
}
