import EditingBtn from './EditingBtn';

interface EditingHeaderTextProps {
  editedName: string;
  setEditedName: (value: string) => void;
  editedDescription: string;
  setEditedDescription: (value: string) => void;
  handleSave: () => void;
  handleCancel: () => void;
  isSaving: boolean;
  isUploading: boolean;
  isOwnProfile: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}
export default function EditingHeaderText({
  editedName,
  setEditedName,
  editedDescription,
  setEditedDescription,
  handleSave,
  handleCancel,
  isSaving,
  isUploading,
  isOwnProfile,
  isEditing,
  setIsEditing,
}: EditingHeaderTextProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <input
        type="text"
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
        className="px-2 py-1 w-full text-2xl font-bold rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary1"
        placeholder="이름"
      />
      <textarea
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
        className="px-2 py-1 w-full rounded border border-gray-300 resize-none text-text2 focus:outline-none focus:ring-2 focus:ring-primary1"
        placeholder="한 줄 소개"
        rows={2}
      />
    </div>
  );
}
