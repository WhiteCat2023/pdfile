import { LucideIcon } from 'lucide-react';

export type Page = 'home' | 'merge' | 'split' | 'convert' | 'compress' | 'team' | 'proofreading' | 'pricing';

export interface Tool {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  category: string;
}

export interface Contributor {
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}
