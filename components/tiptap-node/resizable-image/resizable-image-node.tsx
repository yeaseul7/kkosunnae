'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { NodeViewProps } from '@tiptap/react';
import { useRef, useState, useEffect } from 'react';

export const ResizableImageNode: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const { src, alt, title, width, height } = node.attrs;

  // 이미지의 원본 크기 가져오기
  useEffect(() => {
    if (imgRef.current && !naturalSize) {
      const img = new Image();
      img.onload = () => {
        setNaturalSize({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        // 초기 크기가 없으면 원본 크기로 설정
        if (!width && !height) {
          updateAttributes({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        }
      };
      img.src = src;
    }
  }, [src, naturalSize, width, height, updateAttributes]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const currentWidth = width || imgRef.current?.naturalWidth || naturalSize?.width || 500;
    const currentHeight = height || imgRef.current?.naturalHeight || naturalSize?.height || 500;
    const aspectRatio = currentWidth / currentHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diffX = moveEvent.clientX - startX;
      
      // 대각선으로 리사이즈 (비율 유지)
      const newWidth = Math.max(100, Math.min(1200, currentWidth + diffX));
      const newHeight = newWidth / aspectRatio;

      updateAttributes({
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <NodeViewWrapper
      ref={containerRef}
      className={`resizable-image-wrapper ${selected ? 'selected' : ''}`}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt || ''}
        title={title || ''}
        style={{
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto',
          maxWidth: '100%',
          display: 'block',
          cursor: selected ? 'move' : 'default',
          userSelect: 'none',
        }}
        draggable={false}
        onLoad={() => {
          // 이미지 로드 후 원본 크기 저장
          if (imgRef.current && !naturalSize) {
            setNaturalSize({
              width: imgRef.current.naturalWidth,
              height: imgRef.current.naturalHeight,
            });
          }
        }}
      />
      {selected && (
        <div
          onMouseDown={handleMouseDown}
          className="resize-handle"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '16px',
            height: '16px',
            backgroundColor: '#3b82f6',
            border: '2px solid white',
            borderRadius: '4px',
            cursor: 'nwse-resize',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      )}
    </NodeViewWrapper>
  );
};

