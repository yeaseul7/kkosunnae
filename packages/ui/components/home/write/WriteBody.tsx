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
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  // postData.content가 변경될 때 에디터 콘텐츠 업데이트
  useEffect(() => {
    if (editor && postData?.content) {
      const currentContent = editor.getHTML();
      // 현재 콘텐츠와 다를 때만 업데이트 (무한 루프 방지)
      if (currentContent !== postData.content) {
        editor.commands.setContent(postData.content);
      }
    }
  }, [editor, postData?.content]);

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
