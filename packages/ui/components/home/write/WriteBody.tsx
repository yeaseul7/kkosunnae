'use client';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import WriteTag from './WriteTag';
import { Placeholder } from '@tiptap/extensions';
import TextAlign from '@tiptap/extension-text-align';
import { Image } from '@tiptap/extension-image';
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node';
import { handleImageUpload } from '@/lib/tiptap-utils';
import { PostData } from '@/packages/ui/components/home/write/WriteContainer';

export default function WriteBody({
  postData,
  setPostData,
}: {
  postData: PostData;
  setPostData: Dispatch<SetStateAction<PostData>>;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '내용을 입력하세요',
        emptyEditorClass: 'is-editor-empty',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: 5 * 1024 * 1024,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
    ],
    content: postData.content,
    onUpdate: ({ editor }) => {
      setPostData({ ...postData, content: editor.getHTML() });
    },
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full h-full">
        {editor && <WriteTag editor={editor as Editor} />}
        <div className="overflow-auto flex-1 mt-4 w-full min-h-0">
          {editor && <EditorContent editor={editor} className="tiptap" />}
        </div>
      </div>
    </div>
  );
}
