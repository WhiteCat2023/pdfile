
import { EditAnnotation } from '../../../types';

interface PropertiesPanelProps {
  annotation: EditAnnotation | undefined;
  onUpdate: (id: string, updates: Partial<EditAnnotation>) => void;
  onReplaceImage: () => void;
}

export function PropertiesPanel({ annotation, onUpdate, onReplaceImage }: PropertiesPanelProps) {
  if (!annotation) return null;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-3 space-y-3 overflow-y-auto flex-1">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Properties</p>

      {annotation.type === 'text' && (
        <>
          <div>
            <label className="text-[10px] font-semibold text-zinc-500 block mb-1">Content</label>
            <textarea
              value={annotation.text ?? ''}
              onChange={(e) => onUpdate(annotation.id, { text: e.target.value })}
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
              value={annotation.fontSize ?? 14}
              onChange={(e) => onUpdate(annotation.id, { fontSize: Number(e.target.value) })}
              className="w-full px-2 py-1 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-semibold text-zinc-500">Color</label>
            <input
              type="color"
              value={annotation.fontColor ?? '#000000'}
              onChange={(e) => onUpdate(annotation.id, { fontColor: e.target.value })}
              className="w-8 h-7 rounded cursor-pointer border border-zinc-200"
            />
          </div>
        </>
      )}

      {(annotation.type === 'rect' || annotation.type === 'circle') && (
        <>
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-semibold text-zinc-500 w-14">Stroke</label>
            <input
              type="color"
              value={annotation.strokeColor ?? '#000000'}
              onChange={(e) => onUpdate(annotation.id, { strokeColor: e.target.value })}
              className="w-8 h-7 rounded cursor-pointer border border-zinc-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-semibold text-zinc-500 w-14">Fill</label>
            <input
              type="color"
              value={annotation.fillColor || '#ffffff'}
              onChange={(e) => onUpdate(annotation.id, { fillColor: e.target.value })}
              className="w-8 h-7 rounded cursor-pointer border border-zinc-200"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-zinc-500 block mb-1">Stroke width</label>
            <input
              type="number"
              min={1}
              max={20}
              value={annotation.strokeWidth ?? 2}
              onChange={(e) => onUpdate(annotation.id, { strokeWidth: Number(e.target.value) })}
              className="w-full px-2 py-1 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>
        </>
      )}

      {annotation.type === 'image' && (
        <button
          onClick={onReplaceImage}
          className="w-full text-xs font-bold py-1.5 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
        >
          Replace image
        </button>
      )}
    </div>
  );
}
