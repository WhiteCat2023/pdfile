
import { EditAnnotation, AnnotationMode } from '../../types';

interface AnnotationRendererProps {
  annotation: EditAnnotation;
  isSelected: boolean;
  annotationMode: AnnotationMode;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: (e: React.MouseEvent) => void;
}

export function AnnotationRenderer({ annotation, isSelected, annotationMode, onMouseDown, onClick }: AnnotationRendererProps) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${annotation.x * 100}%`,
    top: `${annotation.y * 100}%`,
    width: `${annotation.width * 100}%`,
    height: `${annotation.height * 100}%`,
    outline: isSelected ? '2px solid #2563eb' : '1px dashed #94a3b8',
    cursor: annotationMode === 'select' ? 'move' : 'default',
    userSelect: 'none',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  return (
    <div onMouseDown={onMouseDown} onClick={onClick} style={style}>
      {annotation.type === 'text' && (
        <span
          style={{
            fontSize: `${annotation.fontSize ?? 14}px`,
            color: annotation.fontColor ?? '#000000',
            lineHeight: 1.2,
            display: 'block',
            padding: '2px 4px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {annotation.text}
        </span>
      )}
      {annotation.type === 'rect' && (
        <div style={{
          width: '100%', height: '100%',
          border: `${annotation.strokeWidth ?? 2}px solid ${annotation.strokeColor ?? '#000'}`,
          background: annotation.fillColor || 'transparent',
          boxSizing: 'border-box',
        }} />
      )}
      {annotation.type === 'circle' && (
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '50%',
          border: `${annotation.strokeWidth ?? 2}px solid ${annotation.strokeColor ?? '#000'}`,
          background: annotation.fillColor || 'transparent',
          boxSizing: 'border-box',
        }} />
      )}
      {annotation.type === 'image' && annotation.imageDataUrl && (
        <img src={annotation.imageDataUrl} style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }} alt="" />
      )}
    </div>
  );
}
