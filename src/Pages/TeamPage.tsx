
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Contributor } from '../types';

interface TeamPageProps {
  contributors: Contributor[];
}

export function TeamPage({ contributors }: TeamPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col"
    >
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900 mb-6 uppercase">Developers & Contributors</h1>
        <p className="text-zinc-500 text-lg font-medium">
          Meet the talented individuals who built PDFile from the ground up to revolutionize document management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {contributors.map((person, index) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="relative mb-6 overflow-hidden rounded-2xl aspect-square">
              <img 
                src={person.image} 
                alt={person.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-xl font-black text-zinc-900 mb-1 uppercase tracking-tight">{person.name}</h3>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">{person.role}</p>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-medium">{person.bio}</p>
            
            <div className="flex items-center gap-4 text-zinc-400">
              {person.social.github && <a href={person.social.github} className="hover:text-zinc-900 transition-colors"><Github size={18} /></a>}
              {person.social.twitter && <a href={person.social.twitter} className="hover:text-zinc-900 transition-colors"><Twitter size={18} /></a>}
              {person.social.linkedin && <a href={person.social.linkedin} className="hover:text-zinc-900 transition-colors"><Linkedin size={18} /></a>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 p-12 bg-zinc-900 rounded-[3rem] text-center text-white">
        <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Want to contribute?</h2>
        <p className="text-zinc-400 mb-8 max-w-xl mx-auto font-medium">
          We're always looking for passionate developers and designers to join our open-source mission.
        </p>
        <button className="px-8 py-4 bg-white text-zinc-900 rounded-full font-bold text-sm hover:bg-zinc-100 transition-colors flex items-center gap-2 mx-auto">
          <Mail size={18} />
          Get in touch
        </button>
      </div>
    </motion.div>
  );
}
