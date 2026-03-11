
import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Zap, Unlock, Lock } from 'lucide-react';
import { saveAs } from 'file-saver';
import { Tool, EditAnnotation, AnnotationMode } from '../types';
import {
  mergePdfs,
  splitPdf,
  extractPages,
  pdfToJpgZip,
  editPdf,
  protectPdf,
  unlockPdf,
  isPasswordError,
  getPdfPageCount,
  renderPdfPagePreview,
} from '../utils/pdf';
import { SuccessDialog } from '../components/SuccessDialog';
import { Notification } from '../components/Notification';
import { PDF_TOOLS } from '../constants';
import { ToolHeader } from './Subpage/ToolHeader';
import { FileUpload } from './Subpage/FileUpload';
import { FileList } from './Subpage/FileList';
import { SplitOptions } from './Subpage/SplitOptions';
import { ProtectPassword } from './Subpage/ProtectPassword';
import { UnlockPassword } from './Subpage/UnlockPassword';
import { EditContainer } from './Subpage/EditContainer';

// Wrapper component to handle routing and data fetching
export function ToolWorkspaceWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tool = PDF_TOOLS.find(t => t.id === id);

  if (!tool) {
    return <div>Tool not found</div>; // Or a more sophisticated 404 page
  }

  return <ToolWorkspace tool={tool} onBack={() => navigate(-1)} />;
}

interface DragState {
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
}

interface ToolWorkspaceProps {
  tool: Tool;
  onBack: () => void;
}

export function ToolWorkspace({ tool, onBack }: ToolWorkspaceProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [splitOption, setSplitOption] = useState('ranges'); // 'ranges' or 'extract'
  const [splitRanges, setSplitRanges] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Protect PDF state ─────────────────────────────────────────────────────
  const [protectUserPwd, setProtectUserPwd] = useState('');

  // ── Unlock PDF state ──────────────────────────────────────────────────────
  const [unlockPwd, setUnlockPwd] = useState('');
  const [showUnlockPwdField, setShowUnlockPwdField] = useState(false);

  // ── Edit PDF state ────────────────────────────────────────────────────────
  const [annotations, setAnnotations] = useState<EditAnnotation[]>([]);
  const [annotationMode, setAnnotationMode] = useState<AnnotationMode>('select');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [editCurrentPage, setEditCurrentPage] = useState(1);
  const [editTotalPages, setEditTotalPages] = useState(0);
  const [editPagePreviewUrl, setEditPagePreviewUrl] = useState<string | null>(null);
  const [editPreviewLoading, setEditPreviewLoading] = useState(false);
  const dragStateRef = useRef<DragState | null>(null);

  const allowsMultipleFiles = useMemo(() => tool.category === 'merge', [tool.category]);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const pdfFiles = Array.from(newFiles).filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    
    if (allowsMultipleFiles) {
      setFiles(prev => [...prev, ...pdfFiles]);
    } else {
      setFiles(pdfFiles.slice(0, 1));
    }
    // Reset unlock prompt whenever a new file is selected
    if (tool.id === 'unlock' && pdfFiles.length > 0) {
      setShowUnlockPwdField(false);
      setUnlockPwd('');
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const showNotification = (message: string, type: 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  // ── Edit PDF: load page count when a PDF file is added ───────────────────
  useEffect(() => {
    if (tool.id !== 'edit' || files.length === 0) {
      setEditTotalPages(0);
      setEditPagePreviewUrl(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const count = await getPdfPageCount(files[0]);
        if (cancelled) return;
        setEditTotalPages(count);
        setEditCurrentPage(1);
      } catch {
        if (!cancelled) setNotification({ message: 'Could not read the PDF file.', type: 'error' });
      }
    })();
    return () => { cancelled = true; };
  }, [files, tool.id]);

  // ── Edit PDF: re-render preview when page changes ────────────────────────
  useEffect(() => {
    if (tool.id !== 'edit' || files.length === 0 || editTotalPages === 0) return;
    let cancelled = false;
    setEditPreviewLoading(true);
    (async () => {
      try {
        const dataUrl = await renderPdfPagePreview(files[0], editCurrentPage);
        if (cancelled) return;
        setEditPagePreviewUrl(dataUrl);
      } catch {
        if (!cancelled) setNotification({ message: 'Failed to render page preview.', type: 'error' });
      } finally {
        if (!cancelled) setEditPreviewLoading(false);
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editCurrentPage, editTotalPages, tool.id]);

  /** Place a new annotation at normalized (0-1) coords on the current page */
  const addAnnotation = useCallback((
    nx: number,
    ny: number,
    mode: AnnotationMode,
    extra?: Partial<EditAnnotation>,
  ) => {
    if (mode === 'select') return;
    const DEFAULTS: Record<string, Partial<EditAnnotation>> = {
      text:   { width: 0.35, height: 0.07, text: 'Text', fontSize: 16, fontColor: '#000000' },
      rect:   { width: 0.30, height: 0.20, strokeColor: '#000000', fillColor: '',  strokeWidth: 2 },
      circle: { width: 0.25, height: 0.15, strokeColor: '#000000', fillColor: '',  strokeWidth: 2 },
      image:  { width: 0.30, height: 0.20 },
    };
    const ann: EditAnnotation = {
      id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      page: editCurrentPage,
      type: mode as EditAnnotation['type'],
      x: Math.max(0, Math.min(nx, 0.95)),
      y: Math.max(0, Math.min(ny, 0.90)),
      width: 0.30,
      height: 0.15,
      ...DEFAULTS[mode],
      ...extra,
    } as EditAnnotation;
    setAnnotations(prev => [...prev, ann]);
    setSelectedAnnotationId(ann.id);
    setAnnotationMode('select');
  }, [editCurrentPage]);

  /** Handle image file selection for image annotations */
  const handleImageAnnotationFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addAnnotation(0.35, 0.40, 'image', { imageDataUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(f);
    e.target.value = '';
  }, [addAnnotation]);

  /** Update one or more fields of an annotation by id */
  const updateAnnotation = useCallback((id: string, updates: Partial<EditAnnotation>) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const deleteAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
    setSelectedAnnotationId(prev => prev === id ? null : prev);
  }, []);

  /** Wraps a pdf-lib Uint8Array into a Blob, avoiding SharedArrayBuffer type conflicts */
  const pdfBlob = (bytes: Uint8Array) =>
    new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer], {
      type: 'application/pdf',
    });

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setNotification(null);

    try {
      let success = false;
      switch (tool.id) {
        case 'merge': {
          if (files.length < 2) {
            showNotification('Please select at least two files to merge.', 'error');
            setIsProcessing(false);
            return;
          }
          const mergedPdf = await mergePdfs(files);
          saveAs(pdfBlob(mergedPdf), 'merged.pdf');
          success = true;
          break;
        }

        case 'split': {
          if (files.length !== 1 || !splitRanges) {
            showNotification('Please select one file and specify pages.', 'error');
            setIsProcessing(false);
            return;
          }
          if (splitOption === 'ranges') {
            const splitPdfs = await splitPdf(files[0], splitRanges);
            splitPdfs.forEach((pdf, i) => {
              saveAs(pdfBlob(pdf), `split-${files[0].name.replace('.pdf', '')}-${i + 1}.pdf`);
            });
          } else {
            const extractedPdf = await extractPages(files[0], splitRanges);
            saveAs(pdfBlob(extractedPdf), `extracted-${files[0].name}`);
          }
          success = true;
          break;
        }

        case 'compress': {
          if (files.length !== 1) {
            showNotification('Please select one file to compress.', 'error');
            setIsProcessing(false);
            return;
          }
          showNotification('The compress feature is not yet implemented.');
          success = false;
          break;
        }

        case 'pdf-to-word':
        case 'pdf-to-excel':
        case 'pdf-to-ppt': {
          showNotification(`The ${tool.name} feature is not yet implemented.`);
          success = false;
          break;
        }

        // ── PDF to JPG ────────────────────────────────────────────────────
        case 'pdf-to-jpg': {
          if (files.length !== 1) {
            showNotification('Please select one PDF file to convert.', 'error');
            setIsProcessing(false);
            return;
          }
          const zipBlob = await pdfToJpgZip(files[0]);
          const baseName = files[0].name.replace(/\.pdf$/i, '');
          saveAs(zipBlob, `${baseName}-images.zip`);
          success = true;
          break;
        }

        // ── Edit PDF ──────────────────────────────────────────────────────
        case 'edit': {
          if (files.length !== 1) {
            showNotification('Please select one PDF file to edit.', 'error');
            setIsProcessing(false);
            return;
          }
          const editedBytes = await editPdf(files[0], annotations);
          saveAs(pdfBlob(editedBytes), `edited-${files[0].name}`);
          success = true;
          break;
        }

        // ── Protect PDF ───────────────────────────────────────────────────
        case 'protect': {
          if (files.length !== 1) {
            showNotification('Please select one PDF file to protect.', 'error');
            setIsProcessing(false);
            return;
          }
          if (!protectUserPwd.trim()) {
            showNotification('Please enter a password to protect the PDF.', 'error');
            setIsProcessing(false);
            return;
          }
          const protectedBytes = await protectPdf(
            files[0],
            protectUserPwd,  // user password — file cannot be opened without this
            protectUserPwd,  // owner password — same as user (standard practice)
            { printing: true, copying: true, modifying: true, annotating: true },
          );
          saveAs(pdfBlob(protectedBytes), `protected-${files[0].name}`);
          success = true;
          break;
        }

        // ── Unlock PDF ────────────────────────────────────────────────────
        case 'unlock': {
          if (files.length !== 1) {
            showNotification('Please select one PDF file to unlock.', 'error');
            setIsProcessing(false);
            return;
          }
          const password = unlockPwd.trim();
          try {
            const unlockedBytes = await unlockPdf(files[0], password);
            // Strip any existing "unlocked-" prefix to avoid stacking
            const outputName = files[0].name.replace(/^unlocked-/i, '');
            saveAs(pdfBlob(unlockedBytes), `unlocked-${outputName}`);
            success = true;
          } catch (unlockErr) {
            if (isPasswordError(unlockErr)) {
              if (!password) {
                // PDF has a user (open) password — reveal the password field
                setShowUnlockPwdField(true);
                showNotification(
                  'This PDF requires a password to open. Enter it below and click Unlock PDF again.',
                  'info',
                );
              } else {
                showNotification('Incorrect password. Please double-check and try again.', 'error');
              }
              setIsProcessing(false);
              return;
            }
            throw unlockErr;
          }
          break;
        }
      }

      if (success) {
        setShowSuccess(true);
        setFiles([]);
        setSplitRanges('');
        // Reset per-tool form state
        setProtectUserPwd('');
        setUnlockPwd('');
        setShowUnlockPwdField(false);
        setAnnotations([]);
        setSelectedAnnotationId(null);
        setEditCurrentPage(1);
        setEditTotalPages(0);
        setEditPagePreviewUrl(null);
      }
    } catch (error) {
      console.error('Error processing files:', error);
      // Friendly message for wrong password errors from pdf-lib
      const raw = error instanceof Error ? error.message : String(error);
      showNotification(
        isPasswordError(error)
          ? 'Incorrect password. Please check and try again.'
          : `An error occurred: ${raw}`,
        'error',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col"
    >
      <AnimatePresence>
        {notification && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
        {showSuccess && (
          <SuccessDialog 
            toolName={tool.name} 
            onClose={() => setShowSuccess(false)} 
          />
        )}
      </AnimatePresence>

      <ToolHeader 
        tool={tool} 
        onBack={onBack} 
        files={files} 
        isProcessing={isProcessing} 
        handleProcess={handleProcess} 
      />

      <div className="flex-1 flex flex-col p-6 bg-zinc-50 rounded-3xl border border-zinc-100 min-h-[400px]">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          multiple={allowsMultipleFiles}
          accept=".pdf"
          className="hidden"
        />
        
        {tool.id === 'split' && files.length > 0 && (
          <div className="mb-4">
            <SplitOptions splitOption={splitOption} onOptionChange={setSplitOption} />
            <label htmlFor="split-ranges" className="block text-sm font-medium text-zinc-700 mb-2">
              {splitOption === 'ranges' ? 'Page ranges to split' : 'Pages to extract'}
            </label>
            <input
              type="text"
              id="split-ranges"
              value={splitRanges}
              onChange={(e) => setSplitRanges(e.target.value)}
              placeholder={splitOption === 'ranges' ? "e.g., 1-3, 5, 7-9" : "e.g., 1, 3-5, 8"}
              className="w-full px-4 py-2 border border-zinc-200 bg-white rounded-lg focus:ring-zinc-500 focus:border-zinc-500 shadow-sm"
            />
            <p className="text-xs text-zinc-500 mt-2">
              {splitOption === 'ranges'
                ? "Each range will be saved as a separate PDF."
                : "All extracted pages will be saved into a single new PDF."}
            </p>
          </div>
        )}

        {tool.id === 'protect' && files.length > 0 && (
          <ProtectPassword 
            password={protectUserPwd} 
            onPasswordChange={setProtectUserPwd} 
            onProcess={handleProcess} 
          />
        )}

        {tool.id === 'unlock' && showUnlockPwdField && files.length > 0 && (
          <UnlockPassword 
            password={unlockPwd} 
            onPasswordChange={setUnlockPwd} 
            onProcess={handleProcess} 
          />
        )}

        {files.length === 0 ? (
          <FileUpload onFiles={(files) => handleFiles(files)} allowsMultipleFiles={allowsMultipleFiles} />
        ) : tool.id === 'edit' ? (
          <EditContainer 
            annotations={annotations}
            annotationMode={annotationMode}
            selectedAnnotationId={selectedAnnotationId}
            editCurrentPage={editCurrentPage}
            editTotalPages={editTotalPages}
            editPagePreviewUrl={editPagePreviewUrl}
            editPreviewLoading={editPreviewLoading}
            setAnnotationMode={setAnnotationMode}
            setSelectedAnnotationId={setSelectedAnnotationId}
            setEditCurrentPage={setEditCurrentPage}
            updateAnnotation={updateAnnotation}
            deleteAnnotation={deleteAnnotation}
            addAnnotation={addAnnotation}
            handleImageAnnotationFile={handleImageAnnotationFile}
            dragStateRef={dragStateRef}
          />
        ) : (
          <FileList 
            files={files} 
            onRemove={removeFile} 
            onAddMore={() => fileInputRef.current?.click()} 
            allowsMultipleFiles={allowsMultipleFiles} 
          />
        )}
        
        <div className="mt-8 flex items-center justify-center gap-8 text-zinc-400">
          <div className="flex items-center gap-2">
            {tool.id === 'unlock' ? <Unlock size={14} /> : <Lock size={14} />}
            <span className="text-[10px] font-bold uppercase tracking-wider">End-to-end encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Processed in seconds</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
