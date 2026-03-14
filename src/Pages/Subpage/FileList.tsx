
import { AnimatePresence, motion } from 'framer-motion';
import { FileIcon, Trash2 } from 'lucide-react';

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onAddMore: () => void;
  allowsMultipleFiles: boolean;
}

export function FileList({ files, onRemove, onAddMore, allowsMultipleFiles }: FileListProps) {
  return (
    <div className="flex-1 w-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Selected Files ({files.length})</span>
        {allowsMultipleFiles &&
          <button 
            onClick={onAddMore}
            className="text-xs font-bold text-zinc-900 hover:underline"
          >
            Add more
          </button>
        }
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence initial={false}>
          {files.map((file, index) => (
            <motion.div 
              key={`${file.name}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100 group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-white rounded-lg text-zinc-400 shadow-sm">
                  <FileIcon size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-zinc-900 truncate">{file.name}</p>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => onRemove(index)}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
