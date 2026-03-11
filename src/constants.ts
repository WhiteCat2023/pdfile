import { 
  FileText, 
  Merge, 
  Split, 
  RefreshCw, 
  Zap, 
  Lock, 
  FileDown, 
  FileUp 
} from 'lucide-react';
import { Tool, Contributor } from './types';

import BerndtDennisCanaya from './assets/Berndt_Dennis_Canaya.png'
import EthanGabrielRolloque from './assets/Ethan_Gabriel_Rolloque.png';
import LanceKeithFajardo from './assets/Lance_Keith_Fajardo.png';
import ArlJacobNecesario from './assets/Arl_Jacob_Necesario.png';
import JosiahEphraimLago from './assets/Josiah_Ephraim_Lago.png'

export const PDF_TOOLS: Tool[] = [
  { id: 'merge', name: 'Merge PDF', icon: Merge, description: 'Combine multiple PDFs into one document.', category: 'merge' },
  { id: 'split', name: 'Split PDF', icon: Split, description: 'Extract pages or split into multiple files.', category: 'split' },
  { id: 'compress', name: 'Compress PDF', icon: Zap, description: 'Reduce file size while keeping quality.', category: 'compress' },
  { id: 'pdf-to-word', name: 'PDF to Word', icon: FileText, description: 'Convert PDF to editable Word docs.', category: 'convert' },
  { id: 'word-to-pdf', name: 'Word to PDF', icon: FileUp, description: 'Convert Word docs to PDF format.', category: 'convert' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: RefreshCw, description: 'Extract images or save pages as JPG.', category: 'convert' },
  { id: 'edit', name: 'Edit PDF', icon: FileDown, description: 'Add text, shapes, and annotations.', category: 'edit' },
  { id: 'protect', name: 'Protect PDF', icon: Lock, description: 'Add passwords and encrypt your files.', category: 'security' },
  { id: 'unlock', name: 'Unlock PDF', icon: Lock, description: 'Remove passwords from protected PDFs.', category: 'security' },
];

export const CONTRIBUTORS: Contributor[] = [
  {
    name: "Berndt Dennis F. Canaya",
    role: "Lead Full Stack Developer",
    image: BerndtDennisCanaya,
    bio: "Full-stack engineer with a passion for high-performance web applications and document processing systems.",
    social: { 
      github: "https://github.com/WhiteCat2023", 
      twitter: "#", 
      linkedin: "#" }
  },
  {
    name: "Ethan Gabriel T. Rolloque",
    role: "Assistant Full Stack Developer",
    image: EthanGabrielRolloque,
    bio: "A passionate junior developer with a strong interest in building clean, functional, and user-friendly websites.",
    social: { 
      github: "https://github.com/WhiteCat2023", 
      twitter: "#", 
      linkedin: "https://www.linkedin.com/feed/" }
  },
  {
    name: "Lance Keith Fajardo",
    role: "UI/UX Designer",
    image: LanceKeithFajardo,
    bio: "Crafting intuitive and beautiful user experiences. Focused on making complex tools accessible to everyone.",
    social: { 
      twitter: "#", 
      linkedin: "#" }
  },
  {
    name: "Arl Jacob Necesario",
    role: "UI/UX Designer",
    image: ArlJacobNecesario,
    bio: "Specialist in distributed systems and secure data handling. Ensuring PDFile is fast and safe.",
    social: { github: "#", linkedin: "#" }
  },
  {
    name: "Josiah Ephraim Lago",
    role: "UI/UX Designer",
    image: JosiahEphraimLago,
    bio: "Animation enthusiast and React expert. Bringing the PDFile interface to life with smooth interactions.",
    social: { github: "#", twitter: "#" }
  }
];
