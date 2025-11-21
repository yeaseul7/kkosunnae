'use client';
import { MdArrowDropDown } from 'react-icons/md';
import { PiDogFill } from 'react-icons/pi';
import Image from 'next/image';
import { useAuth } from '@/lib/firebase/auth';

export default function HeaderUserIcon({
  setIsUserMenuOpen,
  isUserMenuOpen,
}: {
  setIsUserMenuOpen: (isOpen: boolean) => void;
  isUserMenuOpen: boolean;
}) {
  const { user } = useAuth();

  return (
    <button
      className="flex items-center cursor-pointer group"
      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
    >
      {user?.photoURL ? (
        <Image
          src={user.photoURL}
          alt={user.displayName || 'User'}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover transition-all duration-125 ease-in shadow-[0px_0_8px_rgba(0,0,0,0.085)] group-hover:shadow-[0px_0_12px_rgba(0,0,0,0.1)]"
        />
      ) : (
        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-element3">
          <PiDogFill className="text-2xl" />
        </div>
      )}
      <MdArrowDropDown className="ml-1 text-text3 transition-all duration-125 ease-in -mr-1.75 text-2xl group-hover:text-text1" />
    </button>
  );
}
