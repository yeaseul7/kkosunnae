'use client';
import { MdArrowDropDown } from 'react-icons/md';
import { PiDogFill } from 'react-icons/pi';
import Image from 'next/image';
import { useAuth } from '@/lib/firebase/auth';
import { firestore } from '@/lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function HeaderUserIcon({
  setIsUserMenuOpen,
  isUserMenuOpen,
}: {
  setIsUserMenuOpen: (isOpen: boolean) => void;
  isUserMenuOpen: boolean;
}) {
  const { user } = useAuth();
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid) {
        setUserPhotoURL(null);
        setUserDisplayName('');
        return;
      }

      try {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserPhotoURL(userData?.photoURL || null);
          setUserDisplayName(
            userData?.nickname ||
              userData?.displayName ||
              user.displayName ||
              'User',
          );
        } else {
          // Firestore에 문서가 없으면 Auth의 정보 사용
          setUserPhotoURL(user.photoURL || null);
          setUserDisplayName(user.displayName || 'User');
        }
      } catch (error) {
        console.error('사용자 프로필 가져오기 실패:', error);
        // 오류 시 Auth의 정보 사용
        setUserPhotoURL(user.photoURL || null);
        setUserDisplayName(user.displayName || 'User');
      }
    };

    fetchUserProfile();
  }, [user]);

  return (
    <button
      className="flex items-center ml-2 cursor-pointer group"
      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
    >
      {userPhotoURL ? (
        <Image
          src={userPhotoURL}
          alt={userDisplayName}
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
