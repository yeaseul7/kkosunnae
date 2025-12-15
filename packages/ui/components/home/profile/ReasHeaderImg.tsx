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
        <div className="relative w-16 h-16 shrink-0 aspect-square sm:w-20 sm:h-20 lg:w-28 lg:h-28">
          <Image
            src={getOptimizedCloudinaryUrl(currentPhotoURL, 100, 100)}
            alt={currentName || 'User'}
            fill
            className="rounded-full object-cover transition-all duration-125 ease-in shadow-[0px_0_8px_rgba(0,0,0,0.085)] group-hover:shadow-[0px_0_12px_rgba(0,0,0,0.1)]"
          />
        </div>
      ) : (
        <div className="flex overflow-hidden justify-center items-center w-16 h-16 rounded-full shrink-0 sm:w-20 sm:h-20 lg:w-28 lg:h-28 aspect-square bg-element3">
          <PiDogFill className="text-2xl sm:text-3xl lg:text-4xl" />
        </div>
      )}
    </>
  );
}
