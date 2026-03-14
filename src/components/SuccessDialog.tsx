import { motion } from 'framer-motion';
import { CheckCircle2, Download, Share2 } from 'lucide-react';

interface SuccessDialogProps {
  toolName: string;
  onClose: () => void;
}

export function SuccessDialog({ toolName, onClose }: SuccessDialogProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-emerald-50 text-emerald-500 rounded-full">
            <CheckCircle2 size={48} />
          </div>
        </div>
        
        <h3 className="text-2xl font-black tracking-tight text-zinc-900 mb-2 uppercase">Task Complete!</h3>
        <p className="text-zinc-500 text-sm font-medium mb-8">
          Your files have been successfully processed using the <span className="text-zinc-900 font-bold">{toolName}</span> tool.
        </p>

        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download Result
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-zinc-50 text-zinc-900 rounded-2xl font-bold text-sm hover:bg-zinc-100 transition-all flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share Link
          </button>
          <button 
            onClick={onClose}
            className="mt-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
