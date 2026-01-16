import getOptimizedCloudinaryUrl from '@/packages/utils/optimization';
import Image from 'next/image';
import { PiDogFill } from 'react-icons/pi';
interface ReasHeaderImgProps {
  currentPhotoURL: string;
  currentName: string;
}
export default function ReasHeaderImg({
  currentPhotoURL,
  currentName,
}: ReasHeaderImgProps) {
  return (
    <>
      {currentPhotoURL ? (
        <div className="relative w-24 h-24 shrink-0 aspect-square sm:w-32 sm:h-32 lg:w-40 lg:h-40">
          <div className="absolute inset-0 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(173,216,230,0.3),0_0_20px_rgba(173,216,230,0.4),0_0_30px_rgba(135,206,250,0.2)]" />
          <Image
            src={getOptimizedCloudinaryUrl(currentPhotoURL, 200, 200)}
            alt={currentName || 'User'}
            fill
            className="rounded-full object-cover transition-all duration-125 ease-in border-2 border-white"
          />
        </div>
      ) : (
        <div className="flex overflow-hidden justify-center items-center w-24 h-24 rounded-full shrink-0 sm:w-32 sm:h-32 lg:w-40 lg:h-40 aspect-square bg-[#F8EDE8] border-2 border-white shadow-[0_0_0_2px_rgba(173,216,230,0.3),0_0_20px_rgba(173,216,230,0.4),0_0_30px_rgba(135,206,250,0.2)]">
          <PiDogFill className="text-3xl sm:text-4xl lg:text-5xl" />
        </div>
      )}
    </>
  );
}
