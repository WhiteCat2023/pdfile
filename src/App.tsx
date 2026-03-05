import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid
} from 'lucide-react';

import { Page } from './types';
import { PDF_TOOLS, CONTRIBUTORS } from './constants';
import { ToolWorkspace } from './Pages/ToolWorkspace';
import { HomePage } from './Pages/HomePage';
import { CategoryPage } from './Pages/CategoryPage';
import { TeamPage } from './Pages/TeamPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const selectedTool = PDF_TOOLS.find(t => t.id === selectedToolId);

  // Reset tool when page changes
  useEffect(() => {
    setSelectedToolId(null);
  }, [currentPage]);

  const renderContent = () => {
    if (selectedTool) {
      return <ToolWorkspace tool={selectedTool} onBack={() => setSelectedToolId(null)} />;
    }

    if (currentPage === 'team') {
      return <TeamPage contributors={CONTRIBUTORS} />;
    }

    if (currentPage === 'home') {
      return <HomePage tools={PDF_TOOLS} onSelectTool={setSelectedToolId} />;
    }

    // Category Pages
    const filteredTools = PDF_TOOLS.filter(t => t.category === currentPage);
    
    return (
      <CategoryPage 
        category={currentPage} 
        tools={filteredTools} 
        onSelectTool={setSelectedToolId} 
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setCurrentPage('home')}
        >
          <span className="text-2xl font-extrabold tracking-tighter italic">PDFile</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {(['MERGE', 'SPLIT', 'CONVERT', 'COMPRESS'] as const).map((item) => (
            <button 
              key={item} 
              onClick={() => setCurrentPage(item.toLowerCase() as Page)}
              className={`text-[11px] font-bold tracking-widest transition-colors uppercase ${
                currentPage === item.toLowerCase() ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'
              }`}
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage('home')}
            className="p-1 hover:bg-zinc-100 rounded-md transition-colors"
          >
            <LayoutGrid size={18} className="text-zinc-900" />
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (selectedToolId || '')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xl font-extrabold tracking-tighter italic cursor-pointer" onClick={() => setCurrentPage('home')}>PDFile</span>
            <p className="text-xs text-zinc-400 font-medium">© 2024 PDFile. All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-8">
            {['Privacy', 'Terms', 'Contact', 'API'].map((item) => (
              <a key={item} href="#" className="text-xs font-bold tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors uppercase">
                {item}
              </a>
            ))}
            <button 
              onClick={() => setCurrentPage('team')}
              className={`text-xs font-bold tracking-widest transition-colors uppercase ${
                currentPage === 'team' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'
              }`}
            >
              Developers
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
