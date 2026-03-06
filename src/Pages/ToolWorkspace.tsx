
import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Loader2, 
  Zap, 
  Upload, 
  File as FileIcon, 
  Trash2, 
  Lock 
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { Tool } from '../types';
import { mergePdfs, splitPdf } from '../utils/pdf';
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
  const [splitRanges, setSplitRanges] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowsMultipleFiles = useMemo(() => tool.category === 'merge', [tool.category]);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const pdfFiles = Array.from(newFiles).filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    
    if (allowsMultipleFiles) {
      setFiles(prev => [...prev, ...pdfFiles]);
    } else {
      setFiles(pdfFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const showNotification = (message: string, type: 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setNotification(null);

    try {
      let success = false;
      switch (tool.id) {
        case 'merge':
          if (files.length < 2) {
            showNotification('Please select at least two files to merge.', 'error');
            setIsProcessing(false);
            return;
          }
          const mergedPdf = await mergePdfs(files);
          saveAs(new Blob([mergedPdf], { type: 'application/pdf' }), 'merged.pdf');
          success = true;
          break;

        case 'split':
          if (files.length !== 1 || !splitRanges) {
            showNotification('Please select one file and specify ranges to split.', 'error');
            setIsProcessing(false);
            return;
          }
          const splitPdfs = await splitPdf(files[0], splitRanges);
          splitPdfs.forEach((pdf, i) => {
            saveAs(new Blob([pdf], { type: 'application/pdf' }), `split-${files[0].name.replace('.pdf', '')}-${i + 1}.pdf`);
          });
          success = true;
          break;

        case 'compress':
          if (files.length !== 1) {
            showNotification('Please select one file to compress.', 'error');
            setIsProcessing(false);
            return;
          }
          showNotification("The compress feature is not yet implemented.");
          success = false;
          break;

        case 'pdf-to-word':
        case 'pdf-to-excel':
        case 'pdf-to-ppt':
        case 'pdf-to-jpg':
          if (files.length !== 1) {
            showNotification(`Please select one file to convert to ${tool.name.split(' ').pop()}.`, 'error');
            setIsProcessing(false);
            return;
          }
          showNotification(`The ${tool.name} feature is not yet implemented.`);
          success = false;
          break;
      }

      if (success) {
        setShowSuccess(true);
        setFiles([]);
        setSplitRanges('');
      }
    } catch (error) {
      console.error("Error processing files:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      showNotification(`An error occurred: ${errorMessage}`, 'error');
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
            {isProcessing ? 'Processing...' : `Process ${files.length} File${files.length > 1 ? 's' : ''}`}
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
        
        {tool.id === 'split-pdf' && files.length > 0 && (
          <div className="mb-4">
            <label htmlFor="split-ranges" className="block text-sm font-medium text-zinc-700 mb-2">Page ranges to split</label>
            <input
              type="text"
              id="split-ranges"
              value={splitRanges}
              onChange={(e) => setSplitRanges(e.target.value)}
              placeholder="e.g., 1-3, 5, 7-9"
              className="w-full px-4 py-2 border border-zinc-200 bg-white rounded-lg focus:ring-zinc-500 focus:border-zinc-500 shadow-sm"
            />
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
            <Lock size={14} />
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
