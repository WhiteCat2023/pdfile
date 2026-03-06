
import { motion } from 'motion/react';
import { X, Info, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
  type?: 'error' | 'info';
  duration?: number;
}

export function Notification({ message, onClose, type = 'info', duration = 5000 }: NotificationProps) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-zinc-800';
  const Icon = type === 'error' ? AlertTriangle : Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`fixed top-24 left-1/2 -translate-x-1/2 p-4 rounded-full text-white shadow-2xl z-50 flex items-center gap-3 text-sm font-medium ${bgColor}`}
    >
      <Icon size={18} />
      <p>{message}</p>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
        <X size={16} />
      </button>
    </motion.div>
  );
}
