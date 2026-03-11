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

// ─── Edit PDF types ───────────────────────────────────────────────────────────

export type AnnotationType = 'text' | 'rect' | 'circle' | 'image';
export type AnnotationMode = 'select' | 'text' | 'rect' | 'circle' | 'image';

/**
 * A single annotation to be burned into a PDF page.
 * All positional values (x, y, width, height) are **normalized 0–1**
 * relative to the rendered page size (top-left origin in UI coords).
 */
export interface EditAnnotation {
  id: string;
  page: number;          // 1-indexed page number
  type: AnnotationType;
  x: number;             // left edge, 0-1 of page width
  y: number;             // top edge, 0-1 of page height
  width: number;         // 0-1 of page width
  height: number;        // 0-1 of page height
  text?: string;
  fontSize?: number;
  fontColor?: string;    // hex e.g. '#000000'
  strokeColor?: string;  // hex
  fillColor?: string;    // hex
  strokeWidth?: number;
  imageDataUrl?: string; // base64 data URL for image annotations
}

// ─── Protect PDF types ────────────────────────────────────────────────────────

export interface PdfPermissions {
  printing: boolean;
  copying: boolean;
  modifying: boolean;
  annotating: boolean;
}
