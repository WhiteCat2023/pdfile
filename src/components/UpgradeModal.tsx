
import { motion } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface UpgradeModalProps {
  onClose: () => void;
}

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleUpgrade = () => {
    if (currentUser) {
      navigate('/pricing');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="bg-white rounded-2xl p-8 m-4 text-center max-w-md w-full shadow-2xl relative border border-zinc-100"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X size={24} />
        </button>
        <div className="mx-auto bg-zinc-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6">
          <Zap size={40} className="text-zinc-500" strokeWidth={1.5}/>
        </div>
        <h2 className="text-3xl font-bold text-zinc-900 mb-4">Daily Limit Reached</h2>
        <p className="text-zinc-600 mb-8">
          You have used all of your free conversions for today.
          <br />
          Upgrade to Pro for unlimited access and more features.
        </p>
        <button 
          onClick={handleUpgrade} 
          className="bg-zinc-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-zinc-700 transition-all text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
        >
          Upgrade to Pro
        </button>
      </motion.div>
    </div>
  );
}
