
import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  Zap,
  Upload,
  File as FileIcon,
  Trash2,
  Lock,
  Unlock,
  Type,
  Square,
  Circle,
  Image as ImageIcon,
  Eye,
  EyeOff,
  MousePointer,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
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


interface ToolWorkspaceProps {
  tool: Tool;
  onBack: () => void;
}

export function ToolWorkspace({ tool, onBack }: ToolWorkspaceProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [splitOption, setSplitOption] = useState('ranges'); // 'ranges' or 'extract'
  const [splitRanges, setSplitRanges] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Protect PDF state ─────────────────────────────────────────────────────
  const [protectUserPwd, setProtectUserPwd] = useState('');
  const [showUserPwd, setShowUserPwd] = useState(false);

  // ── Unlock PDF state ──────────────────────────────────────────────────────
  const [unlockPwd, setUnlockPwd] = useState('');
  const [showUnlockPwd, setShowUnlockPwd] = useState(false);
  const [showUnlockPwdField, setShowUnlockPwdField] = useState(false);

  // ── Edit PDF state ────────────────────────────────────────────────────────
  const [annotations, setAnnotations] = useState<EditAnnotation[]>([]);
  const [annotationMode, setAnnotationMode] = useState<AnnotationMode>('select');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [editCurrentPage, setEditCurrentPage] = useState(1);
  const [editTotalPages, setEditTotalPages] = useState(0);
  const [editPagePreviewUrl, setEditPagePreviewUrl] = useState<string | null>(null);
  const [editPreviewLoading, setEditPreviewLoading] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const imageAnnotationInputRef = useRef<HTMLInputElement>(null);
  /** Tracks active drag: annotation id + pointer start + original position */
  const dragStateRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

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

  /** Handle click on the PDF preview area to place a new annotation */
  const handlePreviewClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (annotationMode === 'select' || annotationMode === 'image') return;
    const rect = e.currentTarget.getBoundingClientRect();
    addAnnotation(
      (e.clientX - rect.left) / rect.width,
      (e.clientY - rect.top) / rect.height,
      annotationMode,
    );
  }, [annotationMode, addAnnotation]);

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

  /** Mouse-down on an annotation div starts a drag operation */
  const handleAnnotationMouseDown = useCallback((
    e: React.MouseEvent,
    ann: EditAnnotation,
  ) => {
    if (annotationMode !== 'select') return;
    e.stopPropagation();
    e.preventDefault();
    const container = previewContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    dragStateRef.current = { id: ann.id, startX: e.clientX, startY: e.clientY, origX: ann.x, origY: ann.y };
    setSelectedAnnotationId(ann.id);

    const onMove = (me: MouseEvent) => {
      if (!dragStateRef.current) return;
      const dx = (me.clientX - dragStateRef.current.startX) / rect.width;
      const dy = (me.clientY - dragStateRef.current.startY) / rect.height;
      updateAnnotation(dragStateRef.current.id, {
        x: Math.max(0, Math.min(dragStateRef.current.origX + dx, 0.95)),
        y: Math.max(0, Math.min(dragStateRef.current.origY + dy, 0.90)),
      });
    };
    const onUp = () => {
      dragStateRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [annotationMode, updateAnnotation]);

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

  const SplitOptions = () => (
    <div className="mb-6 bg-zinc-100 p-1 rounded-full flex items-center gap-1 shadow-inner">
      <button 
        onClick={() => setSplitOption('ranges')}
        className={`w-full text-center px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${splitOption === 'ranges' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
      >
        Split by range
      </button>
      <button 
        onClick={() => setSplitOption('extract')}
        className={`w-full text-center px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${splitOption === 'extract' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
      >
        Extract pages
      </button>
    </div>
  );

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

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500 hover:text-zinc-900"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase">{tool.name}</h2>
            <p className="text-zinc-500 text-sm font-medium">{tool.description}</p>
          </div>
        </div>

        {files.length > 0 && (
          <button 
            onClick={handleProcess}
            disabled={isProcessing}
            className="px-8 py-3 bg-zinc-900 text-white rounded-full font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
            {isProcessing ? 'Processing...' : (
              tool.id === 'protect' ? 'Protect PDF' :
              tool.id === 'unlock'  ? 'Unlock PDF'  :
              tool.id === 'edit'    ? 'Save PDF'    :
              tool.id === 'pdf-to-jpg' ? 'Convert to JPG' :
              `Process ${files.length} File${files.length > 1 ? 's' : ''}`
            )}
          </button>
        )}
      </div>

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
            <SplitOptions />
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

        {/* ── Protect PDF: password panel ─────────────────────────────────── */}
        {tool.id === 'protect' && files.length > 0 && (
          <div className="mb-4 p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
            <label className="block text-sm font-bold text-zinc-800 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-zinc-500 mb-3">
              Encrypts the PDF so it cannot be viewed without the password. Anyone trying to open the file will be prompted to enter it.
            </p>
            <div className="relative">
              <input
                type={showUserPwd ? 'text' : 'password'}
                value={protectUserPwd}
                onChange={(e) => setProtectUserPwd(e.target.value)}
                placeholder="Enter a password"
                autoComplete="new-password"
                className="w-full px-4 py-2 pr-10 border border-zinc-200 bg-zinc-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                onKeyDown={(e) => { if (e.key === 'Enter') handleProcess(); }}
              />
              <button
                type="button"
                onClick={() => setShowUserPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              >
                {showUserPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* ── Unlock PDF: password prompt (revealed only when PDF requires it) ── */}
        {tool.id === 'unlock' && showUnlockPwdField && files.length > 0 && (
          <div className="mb-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <Lock size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-900">Password required</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  This PDF is locked with an open password. Enter it below — it will be completely
                  removed from the downloaded file.
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                type={showUnlockPwd ? 'text' : 'password'}
                value={unlockPwd}
                onChange={(e) => setUnlockPwd(e.target.value)}
                placeholder="Enter the document password"
                autoComplete="current-password"
                autoFocus
                className="w-full px-4 py-2 pr-10 border border-amber-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                onKeyDown={(e) => { if (e.key === 'Enter') handleProcess(); }}
              />
              <button
                type="button"
                onClick={() => setShowUnlockPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              >
                {showUnlockPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        {files.length === 0 ? (
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={`
              flex-1 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-all cursor-pointer
              ${isDragging ? 'border-zinc-900 bg-zinc-100 scale-[1.01]' : 'border-zinc-200 bg-white shadow-sm hover:border-zinc-400'}
            `}
          >
            <div className="p-6 bg-zinc-50 rounded-full text-zinc-400">
              <Upload size={48} strokeWidth={1} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Drop your PDF{allowsMultipleFiles ? 's' : ''} here</h2>
              <p className="text-zinc-500 text-sm">or click to browse your files</p>
            </div>
          </div>
        ) : tool.id === 'edit' ? (
          /* ── Edit PDF: full canvas editor ────────────────────────────────── */
          <div className="flex-1 flex gap-3 min-h-[500px]">
            {/* Hidden input for image annotations */}
            <input ref={imageAnnotationInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageAnnotationFile} />

            {/* Left toolbar: annotation mode buttons */}
            <div className="flex flex-col gap-1 p-2 bg-white rounded-2xl border border-zinc-200 shadow-sm w-11 shrink-0">
              {([
                { mode: 'select' as AnnotationMode, Icon: MousePointer, title: 'Select & move' },
                { mode: 'text'   as AnnotationMode, Icon: Type,         title: 'Add text' },
                { mode: 'rect'   as AnnotationMode, Icon: Square,       title: 'Rectangle' },
                { mode: 'circle' as AnnotationMode, Icon: Circle,       title: 'Circle / ellipse' },
                { mode: 'image'  as AnnotationMode, Icon: ImageIcon,    title: 'Insert image' },
              ]).map(({ mode, Icon, title }) => (
                <button
                  key={mode}
                  title={title}
                  onClick={() => {
                    setAnnotationMode(mode);
                    if (mode === 'image') imageAnnotationInputRef.current?.click();
                  }}
                  className={`p-2 rounded-xl transition-colors ${
                    annotationMode === mode
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>

            {/* Center: preview + overlays */}
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              {/* Page navigation */}
              {editTotalPages > 1 && (
                <div className="flex items-center justify-center gap-3 shrink-0">
                  <button
                    onClick={() => setEditCurrentPage(p => Math.max(1, p - 1))}
                    disabled={editCurrentPage <= 1}
                    className="p-1 rounded-lg hover:bg-zinc-100 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm font-semibold text-zinc-700">
                    Page {editCurrentPage} of {editTotalPages}
                  </span>
                  <button
                    onClick={() => setEditCurrentPage(p => Math.min(editTotalPages, p + 1))}
                    disabled={editCurrentPage >= editTotalPages}
                    className="p-1 rounded-lg hover:bg-zinc-100 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {/* Canvas area */}
              <div className="flex-1 overflow-y-auto rounded-xl bg-zinc-100 border border-zinc-200">
                <div
                  ref={previewContainerRef}
                  className="relative w-full"
                  style={{ cursor: annotationMode === 'select' ? 'default' : 'crosshair' }}
                  onClick={handlePreviewClick}
                >
                  {editPreviewLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                      <Loader2 className="animate-spin text-zinc-400" size={32} />
                    </div>
                  )}
                  {editPagePreviewUrl && (
                    <img
                      src={editPagePreviewUrl}
                      className="w-full h-auto block select-none"
                      draggable={false}
                      alt={`Page ${editCurrentPage}`}
                    />
                  )}
                  {/* Annotation overlays */}
                  {annotations.filter(a => a.page === editCurrentPage).map(ann => {
                    const isSelected = selectedAnnotationId === ann.id;
                    return (
                      <div
                        key={ann.id}
                        onMouseDown={(e) => handleAnnotationMouseDown(e, ann)}
                        onClick={(e) => { e.stopPropagation(); setSelectedAnnotationId(ann.id); }}
                        style={{
                          position: 'absolute',
                          left:   `${ann.x * 100}%`,
                          top:    `${ann.y * 100}%`,
                          width:  `${ann.width * 100}%`,
                          height: `${ann.height * 100}%`,
                          outline: isSelected ? '2px solid #2563eb' : '1px dashed #94a3b8',
                          cursor: annotationMode === 'select' ? 'move' : 'default',
                          userSelect: 'none',
                          boxSizing: 'border-box',
                          overflow: 'hidden',
                        }}
                      >
                        {ann.type === 'text' && (
                          <span
                            style={{
                              fontSize: `${ann.fontSize ?? 14}px`,
                              color: ann.fontColor ?? '#000000',
                              lineHeight: 1.2,
                              display: 'block',
                              padding: '2px 4px',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                            }}
                          >
                            {ann.text}
                          </span>
                        )}
                        {ann.type === 'rect' && (
                          <div style={{
                            width: '100%', height: '100%',
                            border: `${ann.strokeWidth ?? 2}px solid ${ann.strokeColor ?? '#000'}`,
                            background: ann.fillColor || 'transparent',
                            boxSizing: 'border-box',
                          }} />
                        )}
                        {ann.type === 'circle' && (
                          <div style={{
                            width: '100%', height: '100%',
                            borderRadius: '50%',
                            border: `${ann.strokeWidth ?? 2}px solid ${ann.strokeColor ?? '#000'}`,
                            background: ann.fillColor || 'transparent',
                            boxSizing: 'border-box',
                          }} />
                        )}
                        {ann.type === 'image' && ann.imageDataUrl && (
                          <img src={ann.imageDataUrl} style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }} alt="" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right panel: annotation list + properties */}
            <div className="w-52 shrink-0 flex flex-col gap-3 overflow-hidden">
              {/* Annotation list */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col overflow-hidden" style={{ maxHeight: 240 }}>
                <div className="px-3 py-2 border-b border-zinc-100 bg-zinc-50/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Annotations ({annotations.length})
                  </span>
                </div>
                <div className="overflow-y-auto flex-1">
                  {annotations.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-4 px-3">No annotations yet.<br/>Click a tool to add one.</p>
                  ) : (
                    annotations.map(ann => (
                      <div
                        key={ann.id}
                        onClick={() => { setSelectedAnnotationId(ann.id); setEditCurrentPage(ann.page); }}
                        className={`flex items-center justify-between px-3 py-2 cursor-pointer border-b border-zinc-50 hover:bg-zinc-50 transition-colors ${selectedAnnotationId === ann.id ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {ann.type === 'text'   && <Type   size={12} className="shrink-0 text-zinc-400" />}
                          {ann.type === 'rect'   && <Square size={12} className="shrink-0 text-zinc-400" />}
                          {ann.type === 'circle' && <Circle size={12} className="shrink-0 text-zinc-400" />}
                          {ann.type === 'image'  && <ImageIcon size={12} className="shrink-0 text-zinc-400" />}
                          <span className="text-xs text-zinc-700 truncate">
                            {ann.type === 'text' ? (ann.text ?? '').slice(0, 18) : ann.type} · p.{ann.page}
                          </span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteAnnotation(ann.id); }}
                          className="p-1 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors shrink-0"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Properties panel for selected annotation */}
              {(() => {
                const ann = annotations.find(a => a.id === selectedAnnotationId);
                if (!ann) return null;
                return (
                  <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-3 space-y-3 overflow-y-auto flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Properties</p>

                    {ann.type === 'text' && (
                      <>
                        <div>
                          <label className="text-[10px] font-semibold text-zinc-500 block mb-1">Content</label>
                          <textarea
                            value={ann.text ?? ''}
                            onChange={(e) => updateAnnotation(ann.id, { text: e.target.value })}
                            rows={3}
                            className="w-full px-2 py-1 text-xs border border-zinc-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-zinc-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-zinc-500 block mb-1">Font size</label>
                          <input
                            type="number"
                            min={6}
                            max={96}
                            value={ann.fontSize ?? 14}
                            onChange={(e) => updateAnnotation(ann.id, { fontSize: Number(e.target.value) })}
                            className="w-full px-2 py-1 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-semibold text-zinc-500">Color</label>
                          <input
                            type="color"
                            value={ann.fontColor ?? '#000000'}
                            onChange={(e) => updateAnnotation(ann.id, { fontColor: e.target.value })}
                            className="w-8 h-7 rounded cursor-pointer border border-zinc-200"
                          />
                        </div>
                      </>
                    )}

                    {(ann.type === 'rect' || ann.type === 'circle') && (
                      <>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-semibold text-zinc-500 w-14">Stroke</label>
                          <input
                            type="color"
                            value={ann.strokeColor ?? '#000000'}
                            onChange={(e) => updateAnnotation(ann.id, { strokeColor: e.target.value })}
                            className="w-8 h-7 rounded cursor-pointer border border-zinc-200"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-semibold text-zinc-500 w-14">Fill</label>
                          <input
                            type="color"
                            value={ann.fillColor || '#ffffff'}
                            onChange={(e) => updateAnnotation(ann.id, { fillColor: e.target.value })}
                            className="w-8 h-7 rounded cursor-pointer border border-zinc-200"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-zinc-500 block mb-1">Stroke width</label>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={ann.strokeWidth ?? 2}
                            onChange={(e) => updateAnnotation(ann.id, { strokeWidth: Number(e.target.value) })}
                            className="w-full px-2 py-1 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400"
                          />
                        </div>
                      </>
                    )}

                    {ann.type === 'image' && (
                      <button
                        onClick={() => imageAnnotationInputRef.current?.click()}
                        className="w-full text-xs font-bold py-1.5 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
                      >
                        Replace image
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Selected Files ({files.length})</span>
              {allowsMultipleFiles &&
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-zinc-900 hover:underline"
                >
                  Add more
                </button>
              }
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <AnimatePresence initial={false}>
                {files.map((file, index) => (
                  <motion.div 
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100 group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-white rounded-lg text-zinc-400 shadow-sm">
                        <FileIcon size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-zinc-900 truncate">{file.name}</p>
                        <p className="text-[10px] text-zinc-400 font-medium uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(index)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
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
