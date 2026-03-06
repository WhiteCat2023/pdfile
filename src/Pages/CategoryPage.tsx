
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tool } from '../types';

interface CategoryPageProps {
  category: string;
  tools: Tool[];
}

export function CategoryPage({ category, tools }: CategoryPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col"
    >
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tight text-zinc-900 mb-4 uppercase">{category} Tools</h1>
        <p className="text-zinc-500 font-medium">Select a tool to start processing your documents.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {tools.map((tool) => (
          <Link to={`/tool/${tool.id}`} key={tool.id} className="block h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="group relative bg-white rounded-2xl p-8 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all cursor-pointer overflow-hidden h-full"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-zinc-900 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
              <div className="flex flex-col h-full">
                <div className="mb-6 p-3 bg-zinc-50 rounded-xl w-fit group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <tool.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:translate-x-1 transition-transform">{tool.name}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">{tool.description}</p>
                <div className="mt-auto flex items-center text-xs font-bold tracking-wider text-zinc-400 group-hover:text-zinc-900 transition-colors uppercase">
                  <span>Open Tool</span>
                  <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
