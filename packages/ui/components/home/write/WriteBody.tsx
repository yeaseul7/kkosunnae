'use client';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import WriteTag from './WriteTag';
import { Placeholder } from '@tiptap/extensions';
import TextAlign from '@tiptap/extension-text-align';
import { ResizableImage } from '@/components/tiptap-node/resizable-image/resizable-image-extension';
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node';
import { handleImageUpload } from '@/lib/tiptap-utils';
import { PostData } from '@/packages/type/postType';

export default function WriteBody({
  postData,
  setPostData,
}: {
  postData: PostData | null;
  setPostData: Dispatch<SetStateAction<PostData | null>>;
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
    content: postData?.content || '',
    onUpdate: ({ editor }) => {
      setPostData({ ...(postData as PostData), content: editor.getHTML() });
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && postData?.content) {
      const currentContent = editor.getHTML();
      if (currentContent !== postData.content) {
        editor.commands.setContent(postData.content);
      }
    }
  }, [editor, postData?.content]);

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      {editor && <div className="shrink-0 mb-4"><WriteTag editor={editor as Editor} /></div>}
      <div className="overflow-auto flex-1 w-full min-h-0">
        {editor && <EditorContent editor={editor} className="tiptap" />}
      </div>
    </div>
  );
}
