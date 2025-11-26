'use client';

import Link from 'next/link';
import Image from 'next/image';
import RoundButton from '../common/RoundButton';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginModal from '../auth/LoginModal';
import HeaderUserIcon from './HeaderUserIcon';
import HeaderUserMenu from './HeaderUserMenu';
import { useAuth } from '@/lib/firebase/auth';

interface HeaderProps {
  visibleHeaderButtons?: boolean;
}
export default function Header({ visibleHeaderButtons = true }: HeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleNotificationClick = useCallback(() => {
    console.log('Notification clicked');
  }, []);

  const handleSearchClick = useCallback(() => {
    console.log('Search clicked');
  }, []);

  const writeArticle = useCallback(() => {
    router.push('/write');
  }, [router]);

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen((prev) => !prev);
  }, []);

  return (
    <header className="w-full h-16 bg-white">
      <div className="flex justify-between items-center px-4 w-full h-full">
        <Link href="/">
          <Image
            src="/static/images/unleashedLogo.png"
            alt="Logo"
            width={100}
            height={100}
          />
        </Link>
        {visibleHeaderButtons && (
          <div className="flex gap-2 items-center">
            <button
              className="p-2 rounded-full hover:bg-gray-200"
              onClick={handleNotificationClick}
            >
              <Image
                src="/static/svg/icon-notification.svg"
                alt="Notification"
                width={25}
                height={25}
              />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-200"
              onClick={handleSearchClick}
            >
              <Image
                src="/static/svg/icon-search-3.svg"
                alt="Search"
                width={25}
                height={25}
              />
            </button>
            {!loading && (
              <>
                {user ? (
                  <div className="flex relative items-center group">
                    <RoundButton onClick={writeArticle} className="mr-2">
                      새 글 작성
                    </RoundButton>
                    <HeaderUserIcon
                      setIsUserMenuOpen={setIsUserMenuOpen}
                      isUserMenuOpen={isUserMenuOpen}
                    />
                    {isUserMenuOpen && <HeaderUserMenu />}
                  </div>
                ) : (
                  <RoundButton onClick={openLoginModal}>로그인</RoundButton>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </header>
  );
}
