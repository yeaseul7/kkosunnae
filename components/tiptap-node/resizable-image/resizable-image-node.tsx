'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { NodeViewProps } from '@tiptap/react';
import { useRef, useState, useEffect } from 'react';
import { CloseIcon } from '@/components/tiptap-icons/close-icon';
import { isValidPosition } from '@/lib/tiptap-utils';

export const ResizableImageNode: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  selected,
  editor,
  getPos,
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
        // 초기 크기가 없으면 기본 너비 300px로 조정 (반응형)
        if (!width && !height) {
          const defaultWidth = 300; // 기본 너비 설정
          let finalWidth = defaultWidth;
          let finalHeight =
            (img.naturalHeight * defaultWidth) / img.naturalWidth;

          // 원본 이미지가 기본 너비보다 작으면 원본 크기 유지
          if (img.naturalWidth < defaultWidth) {
            finalWidth = img.naturalWidth;
            finalHeight = img.naturalHeight;
          }

          updateAttributes({
            width: Math.round(finalWidth),
            height: Math.round(finalHeight),
          });
        }
      };
      img.src = src;
    }
  }, [src, naturalSize, width, height, updateAttributes]);

  const handleMouseDown = (
    e: React.MouseEvent,
    corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth =
      width || imgRef.current?.naturalWidth || naturalSize?.width || 500;
    const startHeight =
      height || imgRef.current?.naturalHeight || naturalSize?.height || 500;
    const aspectRatio = startWidth / startHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diffX = moveEvent.clientX - startX;
      const diffY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      // 모서리별로 다른 resize 로직
      switch (corner) {
        case 'bottom-right':
          newWidth = Math.max(100, Math.min(1200, startWidth + diffX));
          newHeight = newWidth / aspectRatio;
          break;
        case 'bottom-left':
          newWidth = Math.max(100, Math.min(1200, startWidth - diffX));
          newHeight = newWidth / aspectRatio;
          break;
        case 'top-right':
          newWidth = Math.max(100, Math.min(1200, startWidth + diffX));
          newHeight = newWidth / aspectRatio;
          break;
        case 'top-left':
          newWidth = Math.max(100, Math.min(1200, startWidth - diffX));
          newHeight = newWidth / aspectRatio;
          break;
      }

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Cloudinary에서 이미지 삭제
    try {
      const response = await fetch('/api/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: src }),
      });

      if (!response.ok) {
        console.error('Failed to delete image from Cloudinary');
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }

    // 에디터에서 노드 삭제
    if (editor && typeof getPos === 'function') {
      const nodePos = getPos();
      if (isValidPosition(nodePos)) {
        editor
          .chain()
          .focus()
          .deleteRange({ from: nodePos, to: nodePos + node.nodeSize })
          .run();
      }
    }
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
          width: width ? `${width}px` : '300px',
          height: height ? `${height}px` : 'auto',
          maxWidth: '100%',
          display: 'block',
          cursor: selected ? 'move' : 'default',
          userSelect: 'none',
          borderRadius: '8px',
          overflow: 'hidden',
          margin: '0 1rem ',
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
        <>
          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            className="absolute right-2 z-20 p-1 bg-white rounded-full shadow-md transition-colors hover:bg-gray-100"
            aria-label="삭제"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              top: -10,
            }}
          >
            <CloseIcon className="w-4 h-4 text-gray-700" />
          </button>
          {/* Top Left */}
          <div
            onMouseDown={(e) => handleMouseDown(e, 'top-left')}
            className="resize-handle"
            style={{
              position: 'absolute',
              top: -5,
              left: 10,
              width: '10px',
              height: '10px',
              backgroundColor: '#3b82f6',
              cursor: 'nwse-resize',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />

          {/* Bottom Left */}
          <div
            onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
            className="resize-handle"
            style={{
              position: 'absolute',
              bottom: -5,
              left: 10,
              width: '10px',
              height: '10px',
              backgroundColor: '#3b82f6',
              cursor: 'nesw-resize',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
          {/* Bottom Right */}
          <div
            onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
            className="resize-handle"
            style={{
              position: 'absolute',
              bottom: -5,
              right: 10,
              width: '10px',
              height: '10px',
              backgroundColor: '#3b82f6',
              cursor: 'nwse-resize',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
        </>
      )}
    </NodeViewWrapper>
  );
};
