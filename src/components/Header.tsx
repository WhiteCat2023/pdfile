
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';

export const Header = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl font-extrabold tracking-tighter italic">PDFile</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        {(['MERGE', 'SPLIT', 'CONVERT', 'COMPRESS'] as const).map((item) => (
          <Link 
            key={item} 
            to={`/${item.toLowerCase()}`}
            className={`text-[11px] font-bold tracking-widest transition-colors uppercase ${
              location.pathname === `/${item.toLowerCase()}` ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'
            }`}
          >
            {item}
          </Link>
        ))}
        <Link 
          to="/proofreading"
          className={`text-[11px] font-bold tracking-widest transition-colors uppercase ${
            location.pathname === '/proofreading' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'
          }`}
        >
          AI Proofreader
        </Link>
        <Link 
          to="/pricing"
          className={`text-[11px] font-bold tracking-widest transition-colors uppercase ${
            location.pathname === '/pricing' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'
          }`}
        >
          Pricing
        </Link>
        <Link 
          to="/login"
          className={`text-[11px] font-bold tracking-widest transition-colors uppercase ${
            location.pathname === '/login' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'
          }`}
        >
          Login
        </Link>
        <Link 
          to="/"
          className="p-1 hover:bg-zinc-100 rounded-md transition-colors"
        >
          <LayoutGrid size={18} className="text-zinc-900" />
        </Link>
      </div>
    </nav>
  );
};
