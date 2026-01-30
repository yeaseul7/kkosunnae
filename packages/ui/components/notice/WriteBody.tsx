'use client';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Placeholder } from '@tiptap/extensions';
import TextAlign from '@tiptap/extension-text-align';
import { ResizableImage } from '@/components/tiptap-node/resizable-image/resizable-image-extension';
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node';
import { handleImageUpload } from '@/lib/tiptap-utils';
import { NoticeData } from '@/packages/type/noticeType';
import WriteTag from '../home/write/WriteTag';

export default function WriteBody({
  noticeData,
  setNoticeData,
}: {
  noticeData: NoticeData | null;
  setNoticeData: Dispatch<SetStateAction<NoticeData>>;
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
      ResizableImage.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          style: 'max-width: 100%; display: block;',
        },
      }),
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: 5 * 1024 * 1024,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
    ],
    content: noticeData?.content || '',
    onUpdate: ({ editor }) => {
      setNoticeData({ ...(noticeData as NoticeData), content: editor.getHTML() });
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && noticeData?.content) {
      const currentContent = editor.getHTML();
      if (currentContent !== noticeData.content) {
        editor.commands.setContent(noticeData.content);
      }
    }
  }, [editor, noticeData?.content]);

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      <div className="overflow-auto flex-1 w-full min-h-0">
        {editor && <div className="shrink-0 mb-4"><WriteTag editor={editor as Editor} /></div>}
        {editor && <EditorContent editor={editor} className="tiptap" />}
      </div>
    </div>
  );
}
