import { CompressionLevel } from '../../types';

interface CompressOptionsProps {
  level: CompressionLevel;
  onLevelChange: (level: CompressionLevel) => void;
}

export function CompressOptions({ level, onLevelChange }: CompressOptionsProps) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium text-zinc-700 mb-2">Compression Level</h3>
      <div className="flex space-x-4">
        <button 
          onClick={() => onLevelChange('low')} 
          className={`px-4 py-2 rounded-lg ${level === 'low' ? 'bg-zinc-800 text-white' : 'bg-white border border-zinc-200'}`}>
            Low
        </button>
        <button 
          onClick={() => onLevelChange('medium')} 
          className={`px-4 py-2 rounded-lg ${level === 'medium' ? 'bg-zinc-800 text-white' : 'bg-white border border-zinc-200'}`}>
            Medium
        </button>
        <button 
          onClick={() => onLevelChange('high')} 
          className={`px-4 py-2 rounded-lg ${level === 'high' ? 'bg-zinc-800 text-white' : 'bg-white border border-zinc-200'}`}>
            High
        </button>
      </div>
    </div>
  );
}
