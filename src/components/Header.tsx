
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const NavLinks = ({ onLinkClick, isMobile }: { onLinkClick?: () => void, isMobile?: boolean }) => {
  const location = useLocation();
  const linkClass = isMobile 
    ? "text-lg font-bold tracking-widest transition-colors uppercase"
    : "text-[11px] font-bold tracking-widest transition-colors uppercase";

  return (
    <>
      {(['MERGE', 'SPLIT', 'CONVERT', 'COMPRESS'] as const).map((item) => (
        <Link 
          key={item} 
          to={`/${item.toLowerCase()}`}
          onClick={onLinkClick}
          className={`${linkClass} ${location.pathname === `/${item.toLowerCase()}` ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}
        >
          {item}
        </Link>
      ))}
      <Link 
        to="/proofreading"
        onClick={onLinkClick}
        className={`${linkClass} ${location.pathname === '/proofreading' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}
      >
        AI Proofreader
      </Link>
      <Link 
        to="/pricing"
        onClick={onLinkClick}
        className={`${linkClass} ${location.pathname === '/pricing' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}
      >
        Pricing
      </Link>
    </>
  );
};

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const onLinkClick = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isDrawerOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl font-extrabold tracking-tighter italic">PDFile</span>
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <NavLinks />
        {currentUser ? (
          <button 
            onClick={handleLogout}
            className="text-[11px] font-bold tracking-widest transition-colors uppercase text-zinc-400 hover:text-zinc-900"
          >
            Logout
          </button>
        ) : (
          <Link 
            to="/login"
            className={`text-[11px] font-bold tracking-widest transition-colors uppercase ${location.pathname === '/login' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}
          >
            Login
          </Link>
        )}
        <Link 
          to="/"
          className="p-1 hover:bg-zinc-100 rounded-md transition-colors"
        >
          <LayoutGrid size={18} className="text-zinc-900" />
        </Link>
      </div>

      {/* Mobile Navigation Button */}
      <div className="md:hidden">
        <button onClick={toggleDrawer} className="p-2">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={toggleDrawer}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-0 right-0 w-80 h-full bg-white z-50 p-8"
            >
              <div className="flex justify-end w-full">
                <button onClick={toggleDrawer} className="p-2">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col items-start justify-center h-full gap-8 -mt-8">
                <NavLinks onLinkClick={onLinkClick} isMobile />
                <div className="w-full border-t border-zinc-200 my-4"></div>
                {currentUser ? (
                  <button 
                    onClick={() => { handleLogout(); onLinkClick(); }}
                    className="text-lg font-bold tracking-widest transition-colors uppercase text-zinc-400 hover:text-zinc-900"
                  >
                    Logout
                  </button>
                ) : (
                  <Link 
                    to="/login"
                    onClick={onLinkClick}
                    className={`text-lg font-bold tracking-widest transition-colors uppercase ${location.pathname === '/login' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}
                  >
                    Login
                  </Link>
                )}
                <Link 
                  to="/"
                  onClick={onLinkClick}
                  className="p-1 hover:bg-zinc-100 rounded-md transition-colors"
                >
                  <LayoutGrid size={22} className="text-zinc-900" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
