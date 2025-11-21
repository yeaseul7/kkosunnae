import { useImageUpload } from '@/components/tiptap-ui/image-upload-button';
import { Editor } from '@tiptap/react';

export default function ImageUpload({
  editor,
  menuButtonStyle,
}: {
  editor: Editor;
  menuButtonStyle: string;
}) {
  const { isVisible, isActive, canInsert, handleImage, label, Icon } =
    useImageUpload({
      editor: editor,
      hideWhenUnavailable: true,
      onInserted: () => console.log('Image inserted!'),
    });

  if (!isVisible) return null;

  return (
    <button
      onClick={handleImage}
      disabled={!canInsert}
      aria-label={label}
      aria-pressed={isActive}
      className={menuButtonStyle}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
