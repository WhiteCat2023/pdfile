
import { Type, Square, Circle, ImageIcon, X } from 'lucide-react';
import { EditAnnotation } from '../../types';

interface AnnotationListProps {
  annotations: EditAnnotation[];
  selectedAnnotationId: string | null;
  onSelect: (id: string, page: number) => void;
  onDelete: (id: string) => void;
}

export function AnnotationList({ annotations, selectedAnnotationId, onSelect, onDelete }: AnnotationListProps) {
  return (
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
              onClick={() => onSelect(ann.id, ann.page)}
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
                onClick={(e) => { e.stopPropagation(); onDelete(ann.id); }}
                className="p-1 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors shrink-0"
              >
                <X size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
