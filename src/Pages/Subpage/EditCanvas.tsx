
import React, { forwardRef } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnnotationMode, EditAnnotation } from '../../types';
import { AnnotationRenderer } from './AnnotationRenderer';

interface EditCanvasProps {
  editTotalPages: number;
  editCurrentPage: number;
  onPageChange: (page: number) => void;
  previewUrl: string | null;
  isLoading: boolean;
  annotationMode: AnnotationMode;
  annotations: EditAnnotation[];
  selectedAnnotationId: string | null;
  onPreviewClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onAnnotationMouseDown: (e: React.MouseEvent, ann: EditAnnotation) => void;
  onAnnotationClick: (e: React.MouseEvent, annId: string) => void;
}

export const EditCanvas = forwardRef<HTMLDivElement, EditCanvasProps>(({ 
  editTotalPages, editCurrentPage, onPageChange, previewUrl, isLoading, 
  annotationMode, annotations, selectedAnnotationId, onPreviewClick, onAnnotationMouseDown, onAnnotationClick
}, ref) => {

  return (
    <div className="flex-1 flex flex-col gap-2 min-w-0">
      {editTotalPages > 1 && (
        <div className="flex items-center justify-center gap-3 shrink-0">
          <button
            onClick={() => onPageChange(Math.max(1, editCurrentPage - 1))}
            disabled={editCurrentPage <= 1}
            className="p-1 rounded-lg hover:bg-zinc-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold text-zinc-700">
            Page {editCurrentPage} of {editTotalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(editTotalPages, editCurrentPage + 1))}
            disabled={editCurrentPage >= editTotalPages}
            className="p-1 rounded-lg hover:bg-zinc-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto rounded-xl bg-zinc-100 border border-zinc-200">
        <div
          ref={ref}
          className="relative w-full"
          style={{ cursor: annotationMode === 'select' ? 'default' : 'crosshair' }}
          onClick={onPreviewClick}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
              <Loader2 className="animate-spin text-zinc-400" size={32} />
            </div>
          )}
          {previewUrl && (
            <img
              src={previewUrl}
              className="w-full h-auto block select-none"
              draggable={false}
              alt={`Page ${editCurrentPage}`}
            />
          )}
          {annotations.filter(a => a.page === editCurrentPage).map(ann => (
            <AnnotationRenderer
              key={ann.id}
              annotation={ann}
              isSelected={selectedAnnotationId === ann.id}
              annotationMode={annotationMode}
              onMouseDown={(e) => onAnnotationMouseDown(e, ann)}
              onClick={(e) => onAnnotationClick(e, ann.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
