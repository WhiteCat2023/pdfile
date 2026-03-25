
import { PDFDocument, rgb, StandardFonts } from '@cantoo/pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import type { EditAnnotation, PdfPermissions, CompressionLevel } from '../types';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const pdfBytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }
  return mergedPdf.save();
};

export const splitPdf = async (file: File, ranges: string): Promise<Uint8Array[]> => {
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);
  const pageCount = pdf.getPageCount();
  const rangeRegex = /(?:\d+-\d+|\d+)/g;
  const matches = ranges.match(rangeRegex) || [];
  const documents: Uint8Array[] = [];

  for (const match of matches) {
    const newPdf = await PDFDocument.create();
    let pages: number[] = [];

    if (match.includes('-')) {
      const [start, end] = match.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        pages.push(i - 1);
      }
    } else {
      pages.push(Number(match) - 1);
    }

    pages = pages.filter(p => p >= 0 && p < pageCount);
    const copiedPages = await newPdf.copyPages(pdf, pages);
    copiedPages.forEach(page => newPdf.addPage(page));
    documents.push(await newPdf.save());
  }

  return documents;
};

export const extractPages = async (file: File, pagesStr: string): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);
  const pageCount = pdf.getPageCount();
  const newPdf = await PDFDocument.create();

  const rangeRegex = /(?:\d+-\d+|\d+)/g;
  const matches = pagesStr.match(rangeRegex) || [];
  let pages: number[] = [];

  for (const match of matches) {
    if (match.includes('-')) {
      const [start, end] = match.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        pages.push(i - 1);
      }
    } else {
      pages.push(Number(match) - 1);
    }
  }

  pages = pages.filter(p => p >= 0 && p < pageCount);
  // remove duplicates and sort
  pages = [...new Set(pages)].sort((a, b) => a - b);

  if (pages.length > 0) {
    const copiedPages = await newPdf.copyPages(pdf, pages);
    copiedPages.forEach(page => newPdf.addPage(page));
  }

  return newPdf.save();
};


export const compressPdf = async (file: File, level: CompressionLevel): Promise<Uint8Array> => {
  console.log(`Compressing PDF with level: ${level}...`, file.name);
  // pdf-lib does not have a direct compression feature of the kind users might expect (re-encoding images etc)
  // This would require a more powerful library, likely on a server or via a service.
  // For now, we will just return the original file bytes as a placeholder.
  return new Uint8Array(await file.arrayBuffer());
};

export const pdfToWord = async (file: File): Promise<Blob> => {
    console.log("Converting PDF to Word...", file.name);
    // This is a placeholder. Real PDF to Word conversion is very complex
    // and would likely require a server-side service.
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let textContent = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map(item => (item as any).str).join(' ');
        textContent += '\n';
    }

    return new Blob([textContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
};

export const wordToPdf = async (file: File): Promise<Uint8Array> => {
    console.log("Converting Word to PDF...", file.name);
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText(value);

    return pdfDoc.save();
};

// ─── PDF to JPG ───────────────────────────────────────────────────────────────

/**
 * Renders every page of a PDF to a JPEG Blob at 2× device-pixel ratio for
 * crisp output, then returns them in page order.
 *
 * @param file    - The PDF File object to convert.
 * @param quality - JPEG quality 0–1 (default 0.92).
 * @returns       Array of JPEG Blobs, one per page.
 */
export const pdfToJpg = async (file: File, quality = 0.92): Promise<Blob[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const doc = await loadingTask.promise;
  const pageCount = doc.numPages;

  if (pageCount === 0) {
    throw new Error('The PDF has no pages to convert.');
  }

  const blobs: Blob[] = [];
  const SCALE = 2; // 2× resolution for crisp output

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: SCALE });

    const canvas = new OffscreenCanvas(Math.round(viewport.width), Math.round(viewport.height));
    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    if (!ctx) throw new Error(`Could not get 2D context for page ${pageNum}.`);

    await page.render({canvas: canvas as unknown as HTMLCanvasElement, canvasContext: ctx as unknown as CanvasRenderingContext2D, viewport }).promise;

    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
    blobs.push(blob);
  }

  return blobs;
};

/**
 * Converts a PDF to a ZIP archive containing one JPEG per page.
 *
 * @param file    - The PDF File object.
 * @param quality - JPEG quality 0–1.
 * @returns       A Blob of the ZIP archive.
 */
export const pdfToJpgZip = async (file: File, quality = 0.92): Promise<Blob> => {
  const blobs = await pdfToJpg(file, quality);
  const zip = new JSZip();
  const baseName = file.name.replace(/\.pdf$/i, '');

  blobs.forEach((blob, index) => {
    const paddedNum = String(index + 1).padStart(3, '0');
    zip.file(`${baseName}-page-${paddedNum}.jpg`, blob);
  });

  return zip.generateAsync({ type: 'blob', compression: 'STORE' });
};

// ─── Edit PDF ─────────────────────────────────────────────────────────────────

/**
 * Parses a CSS hex color string and returns an rgb() value for pdf-lib.
 * Supports both '#rrggbb' and '#rgb' shorthand.
 */
function hexToRgb(hex: string): ReturnType<typeof rgb> {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
}

/**
 * Burns a list of annotations into a PDF and returns the modified bytes.
 * Coordinates in EditAnnotation are normalized 0–1 (top-left origin, UI space)
 * and are converted to pdf-lib's bottom-left coordinate space here.
 *
 * @param file        - The source PDF File.
 * @param annotations - The annotations to draw.
 * @returns           Modified PDF bytes.
 */
export const editPdf = async (file: File, annotations: EditAnnotation[]): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(pdfBytes);
  const pages = doc.getPages();

  // Embed a font once – reused for all text annotations
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);

  for (const ann of annotations) {
    const pageIndex = ann.page - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) continue;

    const page = pages[pageIndex];
    const { width: pw, height: ph } = page.getSize();

    // Convert normalized coords to pdf-lib pts (bottom-left origin)
    const xPt = ann.x * pw;
    const yPt = (1 - ann.y - ann.height) * ph; // flip Y axis
    const wPt = ann.width * pw;
    const hPt = ann.height * ph;

    const strokeColor = ann.strokeColor ? hexToRgb(ann.strokeColor) : rgb(0, 0, 0);
    const fillColor   = ann.fillColor   ? hexToRgb(ann.fillColor)   : undefined;
    const fontColor   = ann.fontColor   ? hexToRgb(ann.fontColor)   : rgb(0, 0, 0);
    const strokeWidth = ann.strokeWidth ?? 1;

    switch (ann.type) {
      case 'text': {
        const fontSize = ann.fontSize ?? 14;
        page.drawText(ann.text ?? '', {
          x: xPt,
          y: yPt + hPt, // top-left of bounding box in pdf-lib space
          size: fontSize,
          font: helvetica,
          color: fontColor,
          maxWidth: wPt,
        });
        break;
      }

      case 'rect': {
        page.drawRectangle({
          x: xPt,
          y: yPt,
          width: wPt,
          height: hPt,
          borderColor: strokeColor,
          borderWidth: strokeWidth,
          ...(fillColor ? { color: fillColor } : { opacity: 0 }),
        });
        break;
      }

      case 'circle': {
        page.drawEllipse({
          x: xPt + wPt / 2,
          y: yPt + hPt / 2,
          xScale: wPt / 2,
          yScale: hPt / 2,
          borderColor: strokeColor,
          borderWidth: strokeWidth,
          ...(fillColor ? { color: fillColor } : { opacity: 0 }),
        });
        break;
      }

      case 'image': {
        if (!ann.imageDataUrl) break;
        try {
          let embeddedImage;
          if (ann.imageDataUrl.startsWith('data:image/png')) {
            const base64 = ann.imageDataUrl.split(',')[1];
            embeddedImage = await doc.embedPng(
              Uint8Array.from(atob(base64), c => c.charCodeAt(0))
            );
          } else {
            const base64 = ann.imageDataUrl.split(',')[1];
            embeddedImage = await doc.embedJpg(
              Uint8Array.from(atob(base64), c => c.charCodeAt(0))
            );
          }
          page.drawImage(embeddedImage, { x: xPt, y: yPt, width: wPt, height: hPt });
        } catch {
          console.warn('Failed to embed image annotation – skipping.');
        }
        break;
      }
    }
  }

  return doc.save();
};

// ─── Protect PDF ──────────────────────────────────────────────────────────────

/**
 * Adds user and owner passwords to a PDF and optionally restricts permissions.
 *
 * @param file           - The source PDF File.
 * @param userPassword   - Password required to open the document.
 * @param ownerPassword  - Password that grants full access (defaults to userPassword if omitted).
 * @param permissions    - Granular permission flags.
 * @returns              Encrypted PDF bytes.
 */
export const protectPdf = async (
  file: File,
  userPassword: string,
  ownerPassword: string,
  permissions: PdfPermissions,
): Promise<Uint8Array> => {
  const pdfBytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(pdfBytes);

  // doc.encrypt() applies RC4-128 / AES-256 encryption before save.
  // Permissions map directly to PDF spec flags.
  doc.encrypt({
    userPassword,
    ownerPassword: ownerPassword.trim() || userPassword,
    permissions: {
      printing:            permissions.printing   ? 'highResolution' : false,
      copying:             permissions.copying,
      annotating:          permissions.annotating,
      modifying:           permissions.modifying,
      fillingForms:        permissions.annotating,   // follows the annotation toggle
      contentAccessibility: true,                    // always on — required by WCAG
      documentAssembly:    permissions.modifying,    // follows the modification toggle
    },
  });

  return doc.save();
};

// ─── Unlock PDF ───────────────────────────────────────────────────────────────

/**
 * Classifies a thrown error as a password-related failure (wrong, missing, or
 * encrypted PDF) vs. a structural / IO error. Used by the UI to show a password
 * prompt instead of a generic error message.
 */
export const isPasswordError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  // @cantoo/pdf-lib throws "Password incorrect" or "NEEDS PASSWORD"
  return (
    msg === 'password incorrect' ||
    msg === 'needs password' ||
    msg.includes('password') ||
    msg.includes('encrypted') ||
    msg.includes('decrypt')
  );
};

/**
 * Removes ALL password protection and restrictions from a PDF.
 *
 * Strategy:
 *  • Attempts to load with `password` (empty string by default).
 *  • Owner-restricted PDFs (no open password) succeed instantly with ''.
 *  • User-password PDFs require the correct password to be passed.
 *  • Saving WITHOUT calling doc.encrypt() strips every encryption entry from
 *    the PDF trailer, producing a fully unlocked, unrestricted file.
 *
 * @throws When the password is wrong or missing — caller should use
 *         `isPasswordError` to distinguish from other failures.
 */
export const unlockPdf = async (file: File, password = ''): Promise<Uint8Array> => {
  // Copy into a plain Uint8Array — avoids SharedArrayBuffer restrictions in
  // cross-origin-isolated browser contexts.
  const pdfBytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(pdfBytes, { password });
  // No encrypt() call → outputs a plain, fully unlocked PDF.
  return doc.save();
};

// ─── PDF Preview helpers (for Edit PDF UI) ───────────────────────────────────

/**
 * Simple in-memory cache: avoids re-loading the same PDF document when the
 * user navigates between pages. Key = "name-size-lastModified".
 */
const _pdfDocCache = new Map<string, pdfjs.PDFDocumentProxy>();

const _getCachedDoc = async (file: File): Promise<pdfjs.PDFDocumentProxy> => {
  const key = `${file.name}-${file.size}-${file.lastModified}`;
  const cached = _pdfDocCache.get(key);
  if (cached) return cached;
  const arrayBuffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  _pdfDocCache.set(key, doc);
  return doc;
};

/** Returns the total number of pages in a PDF file. */
export const getPdfPageCount = async (file: File): Promise<number> => {
  const doc = await _getCachedDoc(file);
  return doc.numPages;
};

/**
 * Renders one page of a PDF to a PNG data URL using pdfjs-dist.
 * Uses a regular <canvas> element so the result is compatible with any
 * environment (no OffscreenCanvas required here).
 *
 * @param file    - The PDF File to render.
 * @param pageNum - 1-indexed page number.
 * @param scale   - Render scale (default 1.5 — good balance of quality vs speed).
 * @returns       PNG data URL string.
 */
export const renderPdfPagePreview = async (
  file: File,
  pageNum: number,
  scale = 1.5,
): Promise<string> => {
  const doc = await _getCachedDoc(file);
  const page = await doc.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext('2d')!;

  await page.render({canvas, canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL('image/png');
};
