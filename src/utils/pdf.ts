
import { PDFDocument } from 'pdf-lib';

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


// Placeholder for compress and convert, as they are more complex
export const compressPdf = async (file: File): Promise<Uint8Array> => {
  console.log("Compressing PDF...", file.name);
  // pdf-lib does not have a direct compression feature of the kind users might expect (re-encoding images etc)
  // This would require a more powerful library, likely on a server or via a service.
  // For now, we will just return the original file bytes.
  return new Uint8Array(await file.arrayBuffer());
};

export const convertPdf = async (file: File, toFormat: string): Promise<Blob> => {
  console.log("Converting PDF...", file.name, toFormat);
  // pdf-lib is for PDF manipulation, not conversion to other formats like JPG, Word, etc.
  // This would require a separate library or service.
  // We will return a dummy blob for now.
  return new Blob([`Dummy conversion of ${file.name} to ${toFormat}`], { type: 'text/plain' });
};
