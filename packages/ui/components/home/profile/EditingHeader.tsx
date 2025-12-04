import Image from 'next/image';
import { PiDogFill } from 'react-icons/pi';

interface EditingHeaderProps {
  currentPhotoURL: string | null;
  currentName: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageRemove: () => void;
  isUploading: boolean;
}
export default function EditingHeader({
  currentPhotoURL,
  currentName,
  fileInputRef,
  handleImageChange,
  handleImageRemove,
  isUploading,
}: EditingHeaderProps) {
  return (
    <div className="relative">
      {currentPhotoURL ? (
        <Image
          src={currentPhotoURL}
          alt={currentName || 'User'}
          width={112}
          height={112}
          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-full object-cover transition-all duration-125 ease-in shadow-[0px_0_8px_rgba(0,0,0,0.085)]"
        />
      ) : (
        <div className="flex shrink-0 justify-center items-center w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 aspect-square rounded-full overflow-hidden bg-element3">
          <PiDogFill className="text-2xl sm:text-3xl lg:text-4xl" />
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <div className="flex flex-col gap-2 mt-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-2 py-1 w-16 text-sm font-bold text-white rounded sm:w-20 lg:w-28 bg-primary1 hover:bg-primary2 disabled:opacity-50"
        >
          {isUploading ? '업로드 중...' : '이미지 변경'}
        </button>
        <button
          onClick={handleImageRemove}
          className="px-2 py-1 w-16 text-sm font-bold sm:w-20 lg:w-28 text-primary1 hover:text-primary2"
        >
          이미지 제거
        </button>
      </div>
    </div>
  );
}
