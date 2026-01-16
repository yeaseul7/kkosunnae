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
}: EditingHeaderTextProps) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 w-full">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="px-3 py-2 sm:px-4 sm:py-2 flex-1 text-xl sm:text-2xl md:text-3xl font-bold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary1 transition-all"
          placeholder="이름"
        />
      </div>
      <textarea
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
        className="px-3 py-2 sm:px-4 sm:py-2 w-full text-sm sm:text-base rounded-lg border border-gray-300 resize-none text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary1 transition-all"
        placeholder="한 줄 소개"
        rows={4}
      />
    </div>
  );
}
