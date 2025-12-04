import { useEffect } from 'react';

interface EditingBtnProps {
  handleSave: () => void;
  handleCancel: () => void;
  isSaving: boolean;
  isUploading: boolean;
  isOwnProfile: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}
export default function EditingBtn({
  handleSave,
  handleCancel,
  isSaving,
  isUploading,
  isOwnProfile,
  isEditing,
  setIsEditing,
}: EditingBtnProps) {
  return (
    <div className="flex gap-2 justify-end w-full">
      {isOwnProfile && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="py-2 text-sm text-primary1 hover:text-primary2 flex-start"
        >
          프로필 수정
        </button>
      )}
      {isOwnProfile && isEditing && (
        <>
          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="px-4 py-2 text-sm text-white rounded bg-primary1 hover:bg-primary2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving || isUploading}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
        </>
      )}
    </div>
  );
}
