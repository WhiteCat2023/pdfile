
import {
  MousePointer, Type, Square, Circle, ImageIcon
} from 'lucide-react';
import { AnnotationMode } from '../../../types';

interface EditToolbarProps {
  annotationMode: AnnotationMode;
  onModeChange: (mode: AnnotationMode) => void;
  onImageUpload: () => void;
}

const tools = [
  { mode: 'select' as AnnotationMode, Icon: MousePointer, title: 'Select & move' },
  { mode: 'text' as AnnotationMode, Icon: Type, title: 'Add text' },
  { mode: 'rect' as AnnotationMode, Icon: Square, title: 'Rectangle' },
  { mode: 'circle' as AnnotationMode, Icon: Circle, title: 'Circle / ellipse' },
  { mode: 'image' as AnnotationMode, Icon: ImageIcon, title: 'Insert image' },
];

export function EditToolbar({ annotationMode, onModeChange, onImageUpload }: EditToolbarProps) {
  return (
    <div className="flex flex-col gap-1 p-2 bg-white rounded-2xl border border-zinc-200 shadow-sm w-11 shrink-0">
      {tools.map(({ mode, Icon, title }) => (
        <button
          key={mode}
          title={title}
          onClick={() => {
            onModeChange(mode);
            if (mode === 'image') onImageUpload();
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
  );
}
