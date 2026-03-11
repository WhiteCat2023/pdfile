
interface SplitOptionsProps {
  splitOption: string;
  onOptionChange: (option: 'ranges' | 'extract') => void;
}

export function SplitOptions({ splitOption, onOptionChange }: SplitOptionsProps) {
  return (
    <div className="mb-6 bg-zinc-100 p-1 rounded-full flex items-center gap-1 shadow-inner">
      <button 
        onClick={() => onOptionChange('ranges')}
        className={`w-full text-center px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${splitOption === 'ranges' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
      >
        Split by range
      </button>
      <button 
        onClick={() => onOptionChange('extract')}
        className={`w-full text-center px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${splitOption === 'extract' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
      >
        Extract pages
      </button>
    </div>
  );
}
