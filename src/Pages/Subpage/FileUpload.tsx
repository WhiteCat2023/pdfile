
import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFiles: (files: FileList) => void;
  allowsMultipleFiles: boolean;
}

export function FileUpload({ onFiles, allowsMultipleFiles }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); onFiles(e.dataTransfer.files); }}
      onClick={() => fileInputRef.current?.click()}
      className={`
        flex-1 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-all cursor-pointer
        ${isDragging ? 'border-zinc-900 bg-zinc-100 scale-[1.01]' : 'border-zinc-200 bg-white shadow-sm hover:border-zinc-400'}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && onFiles(e.target.files)}
        multiple={allowsMultipleFiles}
        accept=".pdf"
        className="hidden"
      />
      <div className="p-6 bg-zinc-50 rounded-full text-zinc-400">
        <Upload size={48} strokeWidth={1} />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Drop your PDF{allowsMultipleFiles ? 's' : ''} here</h2>
        <p className="text-zinc-500 text-sm">or click to browse your files</p>
      </div>
    </div>
  );
}
