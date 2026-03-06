
import { Link, useLocation } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();

  return (
    <footer className="border-t border-zinc-100 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <Link to="/" className="flex flex-col items-center md:items-start gap-2">
          <span className="text-xl font-extrabold tracking-tighter italic">PDFile</span>
          <p className="text-xs text-zinc-400 font-medium">© 2024 PDFile. All rights reserved.</p>
        </Link>
        
        <div className="flex items-center gap-8">
          {['Privacy', 'Terms', 'Contact', 'API'].map((item) => (
            <a key={item} href="#" className="text-xs font-bold tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors uppercase">
              {item}
            </a>
          ))}
          <Link 
            to="/team"
            className={`text-xs font-bold tracking-widest transition-colors uppercase ${
              location.pathname === '/team' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Developers
          </Link>
        </div>
      </div>
    </footer>
  );
};
