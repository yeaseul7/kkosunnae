'use client';

import { useRef, useState } from 'react';
import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { Button } from '@/components/tiptap-ui-primitive/button';
import { CloseIcon } from '@/components/tiptap-icons/close-icon';
import '@/components/tiptap-node/image-upload-node/image-upload-node.scss';
import { focusNextNode, isValidPosition } from '@/lib/tiptap-utils';
import { IoCloudUploadOutline } from 'react-icons/io5';

export interface FileItem {
  /**
   * Unique identifier for the file item
   */
  id: string;
  /**
   * The actual File object being uploaded
   */
  file: File;
  /**
   * Current upload progress as a percentage (0-100)
   */
  progress: number;
  /**
   * Current status of the file upload process
   * @default "uploading"
   */
  status: 'uploading' | 'success' | 'error';

  /**
   * URL to the uploaded file, available after successful upload
   * @optional
   */
  url?: string;
  /**
   * Controller that can be used to abort the upload process
   * @optional
   */
  abortController?: AbortController;
}

export interface UploadOptions {
  /**
   * Maximum allowed file size in bytes
   */
  maxSize: number;
  /**
   * Maximum number of files that can be uploaded
   */
  limit: number;
  /**
   * String specifying acceptable file types (MIME types or extensions)
   * @example ".jpg,.png,image/jpeg" or "image/*"
   */
  accept: string;
  /**
   * Function that handles the actual file upload process
   * @param {File} file - The file to be uploaded
   * @param {Function} onProgress - Callback function to report upload progress
   * @param {AbortSignal} signal - Signal that can be used to abort the upload
   * @returns {Promise<string>} Promise resolving to the URL of the uploaded file
   */
  upload: (
    file: File,
    onProgress: (event: { progress: number }) => void,
    signal: AbortSignal,
  ) => Promise<string>;
  /**
   * Callback triggered when a file is uploaded successfully
   * @param {string} url - URL of the successfully uploaded file
   * @optional
   */
  onSuccess?: (url: string) => void;
  /**
   * Callback triggered when an error occurs during upload
   * @param {Error} error - The error that occurred
   * @optional
   */
  onError?: (error: Error) => void;
}

/**
 * Custom hook for managing multiple file uploads with progress tracking and cancellation
 */
function useFileUpload(options: UploadOptions) {
  const [fileItems, setFileItems] = useState<FileItem[]>([]);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (file.size > options.maxSize) {
      const errorMessage = `파일 크기가 최대 허용 크기(${
        options.maxSize / 1024 / 1024
      }MB)를 초과했습니다.`;
      alert(errorMessage);
      const error = new Error(errorMessage);
      options.onError?.(error);
      return null;
    }

    const abortController = new AbortController();
    const fileId = crypto.randomUUID();

    const newFileItem: FileItem = {
      id: fileId,
      file,
      progress: 0,
      status: 'uploading',
      abortController,
    };

    setFileItems((prev) => [...prev, newFileItem]);

    try {
      if (!options.upload) {
        throw new Error('Upload function is not defined');
      }

      const url = await options.upload(
        file,
        (event: { progress: number }) => {
          setFileItems((prev) =>
            prev.map((item) =>
              item.id === fileId ? { ...item, progress: event.progress } : item,
            ),
          );
        },
        abortController.signal,
      );

      if (!url) throw new Error('Upload failed: No URL returned');

      if (!abortController.signal.aborted) {
        setFileItems((prev) =>
          prev.map((item) =>
            item.id === fileId
              ? { ...item, status: 'success', url, progress: 100 }
              : item,
          ),
        );
        options.onSuccess?.(url);
        return url;
      }

      return null;
    } catch (error) {
      if (!abortController.signal.aborted) {
        setFileItems((prev) =>
          prev.map((item) =>
            item.id === fileId
              ? { ...item, status: 'error', progress: 0 }
              : item,
          ),
        );
        const errorMessage =
          error instanceof Error
            ? error.message
            : '파일 업로드 중 오류가 발생했습니다.';
        alert(errorMessage);
        options.onError?.(
          error instanceof Error ? error : new Error('Upload failed'),
        );
      }
      return null;
    }
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) {
      options.onError?.(new Error('No files to upload'));
      return [];
    }

    if (options.limit && files.length > options.limit) {
      const errorMessage = `최대 ${options.limit}개 파일만 업로드할 수 있습니다.`;
      alert(errorMessage);
      options.onError?.(
        new Error(
          `Maximum ${options.limit} file${
            options.limit === 1 ? '' : 's'
          } allowed`,
        ),
      );
      return [];
    }

    // Upload all files concurrently
    const uploadPromises = files.map((file) => uploadFile(file));
    const results = await Promise.all(uploadPromises);

    // Filter out null results (failed uploads)
    return results.filter((url): url is string => url !== null);
  };

  const removeFileItem = (fileId: string) => {
    setFileItems((prev) => {
      const fileToRemove = prev.find((item) => item.id === fileId);
      if (fileToRemove?.abortController) {
        fileToRemove.abortController.abort();
      }
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter((item) => item.id !== fileId);
    });
  };

  const clearAllFiles = () => {
    fileItems.forEach((item) => {
      if (item.abortController) {
        item.abortController.abort();
      }
      if (item.url) {
        URL.revokeObjectURL(item.url);
      }
    });
    setFileItems([]);
  };

  return {
    fileItems,
    uploadFiles,
    removeFileItem,
    clearAllFiles,
  };
}

const ImageUploadIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="tiptap-image-upload-icon"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const FileIcon: React.FC = () => (
  <svg
    width="43"
    height="57"
    viewBox="0 0 43 57"
    fill="currentColor"
    className="tiptap-image-upload-dropzone-rect-primary"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.75 10.75C0.75 5.64137 4.89137 1.5 10 1.5H32.3431C33.2051 1.5 34.0317 1.84241 34.6412 2.4519L40.2981 8.10876C40.9076 8.71825 41.25 9.5449 41.25 10.4069V46.75C41.25 51.8586 37.1086 56 32 56H10C4.89137 56 0.75 51.8586 0.75 46.75V10.75Z"
      fill="currentColor"
      fillOpacity="0.11"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const FileCornerIcon: React.FC = () => (
  <svg
    width="10"
    height="10"
    className="tiptap-image-upload-dropzone-rect-secondary"
    viewBox="0 0 10 10"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 0.75H0.343146C1.40401 0.75 2.42143 1.17143 3.17157 1.92157L8.82843 7.57843C9.57857 8.32857 10 9.34599 10 10.4069V10.75H4C1.79086 10.75 0 8.95914 0 6.75V0.75Z"
      fill="currentColor"
    />
  </svg>
);

interface ImageUploadDragAreaProps {
  /**
   * Callback function triggered when files are dropped or selected
   * @param {File[]} files - Array of File objects that were dropped or selected
   */
  onFile: (files: File[]) => void;
  /**
   * Optional child elements to render inside the drag area
   * @optional
   * @default undefined
   */
  children?: React.ReactNode;
}

/**
 * A component that creates a drag-and-drop area for image uploads
 */
const ImageUploadDragArea: React.FC<ImageUploadDragAreaProps> = ({
  onFile,
  children,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragActive(false);
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFile(files);
    }
  };

  return (
    <div
      className={`tiptap-image-upload-drag-area ${
        isDragActive ? 'drag-active' : ''
      } ${isDragOver ? 'drag-over' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

interface ImageUploadPreviewProps {
  /**
   * The file item to preview
   */
  fileItem: FileItem;
  /**
   * Callback to remove this file from upload queue
   */
  onRemove: () => void;
}

/**
 * Component that displays a preview of an uploading file with progress
 */
const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  fileItem,
  onRemove,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="tiptap-image-upload-preview">
      {fileItem.status === 'uploading' && (
        <div
          className="tiptap-image-upload-progress"
          style={{ width: `${fileItem.progress}%` }}
        />
      )}

      <div className="tiptap-image-upload-preview-content">
        <div className="tiptap-image-upload-file-info">
          <div className="tiptap-image-upload-file-icon">
            <IoCloudUploadOutline />
          </div>
          <div className="tiptap-image-upload-details">
            <span className="tiptap-image-upload-text">
              {fileItem.file.name}
            </span>
            <span className="tiptap-image-upload-subtext">
              {formatFileSize(fileItem.file.size)}
            </span>
          </div>
        </div>
        <div className="tiptap-image-upload-actions">
          {fileItem.status === 'uploading' && (
            <span className="tiptap-image-upload-progress-text">
              {fileItem.progress}%
            </span>
          )}
          <Button
            type="button"
            data-style="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <CloseIcon className="tiptap-button-icon" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const DropZoneContent: React.FC<{
  maxSize: number;
  limit: number;
  onDelete?: () => void;
}> = ({ maxSize, limit, onDelete }) => (
  <div className="relative flex flex-col justify-center items-center p-4 rounded-lg border border-gray-300 border-dashed">
    {onDelete && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="삭제"
      >
        <CloseIcon className="w-4 h-4 text-gray-500" />
      </button>
    )}
    <IoCloudUploadOutline className="w-10 h-10 text-gray-500" />

    <div className="tiptap-image-upload-content">
      <span className="tiptap-image-upload-text">
        <em>클릭하여 업로드</em> 또는 드래그 앤 드롭
      </span>
      <span className="tiptap-image-upload-subtext">
        최대 {limit}개 파일, 각 {maxSize / 1024 / 1024}MB
      </span>
    </div>
  </div>
);

export const ImageUploadNode: React.FC<NodeViewProps> = (props) => {
  const { accept, limit, maxSize } = props.node.attrs;
  const inputRef = useRef<HTMLInputElement>(null);
  const extension = props.extension;

  const uploadOptions: UploadOptions = {
    maxSize,
    limit,
    accept,
    upload: extension.options.upload,
    onSuccess: extension.options.onSuccess,
    onError: extension.options.onError,
  };

  const { fileItems, uploadFiles, removeFileItem, clearAllFiles } =
    useFileUpload(uploadOptions);

  const handleUpload = async (files: File[]) => {
    const urls = await uploadFiles(files);

    if (urls.length > 0) {
      const pos = props.getPos();

      if (isValidPosition(pos)) {
        const imageNodes = urls.map((url, index) => {
          const filename =
            files[index]?.name.replace(/\.[^/.]+$/, '') || 'unknown';
          return {
            type: extension.options.type || 'resizableImage',
            attrs: {
              src: url,
              alt: filename,
              title: filename,
            },
          };
        });

        props.editor
          .chain()
          .focus()
          .deleteRange({ from: pos, to: pos + props.node.nodeSize })
          .insertContentAt(pos, imageNodes)
          .run();

        focusNextNode(props.editor);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      extension.options.onError?.(new Error('No file selected'));
      return;
    }
    handleUpload(Array.from(files));
  };

  const handleClick = () => {
    if (inputRef.current && fileItems.length === 0) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

  const handleDelete = () => {
    const pos = props.getPos();
    if (isValidPosition(pos)) {
      props.editor
        .chain()
        .focus()
        .deleteRange({ from: pos, to: pos + props.node.nodeSize })
        .run();
    }
  };

  const hasFiles = fileItems.length > 0;

  return (
    <NodeViewWrapper
      className="tiptap-image-upload"
      tabIndex={0}
      onClick={handleClick}
    >
      {!hasFiles && (
        <ImageUploadDragArea onFile={handleUpload}>
          <DropZoneContent
            maxSize={maxSize}
            limit={limit}
            onDelete={handleDelete}
          />
        </ImageUploadDragArea>
      )}

      {hasFiles && (
        <div className="tiptap-image-upload-previews">
          {fileItems.length > 1 && (
            <div className="tiptap-image-upload-header">
              <span>{fileItems.length}개 파일 업로드 중</span>
              <Button
                type="button"
                data-style="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllFiles();
                }}
              >
                모두 지우기
              </Button>
            </div>
          )}
          {fileItems.map((fileItem) => (
            <ImageUploadPreview
              key={fileItem.id}
              fileItem={fileItem}
              onRemove={() => removeFileItem(fileItem.id)}
            />
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        name="file"
        accept={accept}
        type="file"
        multiple={limit > 1}
        onChange={handleChange}
        onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
      />
    </NodeViewWrapper>
  );
};
