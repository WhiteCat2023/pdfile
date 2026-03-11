
import { useRef, useCallback } from 'react';
import { AnnotationMode, EditAnnotation } from '../../types';
import { EditToolbar } from './EditToolbar';
import { EditCanvas } from './EditCanvas';
import { AnnotationList } from './AnnotationList';
import { PropertiesPanel } from './PropertiesPanel';

interface DragState {
  id: string;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
}

interface EditContainerProps {
  // State
  annotations: EditAnnotation[];
  annotationMode: AnnotationMode;
  selectedAnnotationId: string | null;
  editCurrentPage: number;
  editTotalPages: number;
  editPagePreviewUrl: string | null;
  editPreviewLoading: boolean;

  // State Setters
  setAnnotationMode: (mode: AnnotationMode) => void;
  setSelectedAnnotationId: (id: string | null) => void;
  setEditCurrentPage: (page: number) => void;
  updateAnnotation: (id: string, updates: Partial<EditAnnotation>) => void;
  deleteAnnotation: (id: string) => void;
  addAnnotation: (nx: number, ny: number, mode: AnnotationMode, extra?: Partial<EditAnnotation>) => void;
  handleImageAnnotationFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dragStateRef: React.MutableRefObject<DragState | null>;
}

export function EditContainer({
  annotations, annotationMode, selectedAnnotationId, editCurrentPage, editTotalPages, editPagePreviewUrl, editPreviewLoading,
  setAnnotationMode, setSelectedAnnotationId, setEditCurrentPage, updateAnnotation, deleteAnnotation, addAnnotation, handleImageAnnotationFile, dragStateRef
}: EditContainerProps) {

  const imageAnnotationInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const handlePreviewClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (annotationMode === 'select' || annotationMode === 'image') return;
    const rect = e.currentTarget.getBoundingClientRect();
    addAnnotation(
      (e.clientX - rect.left) / rect.width,
      (e.clientY - rect.top) / rect.height,
      annotationMode,
    );
  }, [annotationMode, addAnnotation]);

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
  }, [annotationMode, updateAnnotation, setSelectedAnnotationId, dragStateRef]);

  return (
    <div className="flex-1 flex gap-3 min-h-[500px]">
      <input ref={imageAnnotationInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageAnnotationFile} />

      <EditToolbar
        annotationMode={annotationMode}
        onModeChange={setAnnotationMode}
        onImageUpload={() => imageAnnotationInputref.current?.click()}
      />

      <EditCanvas
        ref={previewContainerRef}
        editTotalPages={editTotalPages}
        editCurrentPage={editCurrentPage}
        onPageChange={setEditCurrentPage}
        previewUrl={editPagePreviewUrl}
        isLoading={editPreviewLoading}
        annotationMode={annotationMode}
        annotations={annotations}
        selectedAnnotationId={selectedAnnotationId}
        onPreviewClick={handlePreviewClick}
        onAnnotationMouseDown={handleAnnotationMouseDown}
        onAnnotationClick={(e, annId) => { e.stopPropagation(); setSelectedAnnotationId(annId); }}
      />

      <div className="w-52 shrink-0 flex flex-col gap-3 overflow-hidden">
        <AnnotationList
          annotations={annotations}
          selectedAnnotationId={selectedAnnotationId}
          onSelect={(id, page) => { setSelectedAnnotationId(id); setEditCurrentPage(page); }}
          onDelete={deleteAnnotation}
        />
        <PropertiesPanel
          annotation={annotations.find(a => a.id === selectedAnnotationId)}
          onUpdate={updateAnnotation}
          onReplaceImage={() => imageAnnotationInputRef.current?.click()}
        />
      </div>
    </div>
  );
}
