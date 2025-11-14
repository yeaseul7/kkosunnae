'use client';

import Link from 'next/link';
import Image from 'next/image';
import RoundButton from '../common/RoundButton';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  visibleHeaderButtons?: boolean;
}
export default function Header({ visibleHeaderButtons = true }: HeaderProps) {
  const router = useRouter();

  const handleNotificationClick = useCallback(() => {
    console.log('Notification clicked');
  }, []);

  const handleSearchClick = useCallback(() => {
    console.log('Search clicked');
  }, []);

  const writeArticle = useCallback(() => {
    router.push('/write');
  }, [router]);

  return (
    <header className="h-16 w-full">
      <div className="flex items-center justify-between w-full">
        <Link href="/">
          <h1 className="text-2xl font-bold">Logo</h1>
        </Link>
        {visibleHeaderButtons && (
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-200 rounded-full"
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
              className="p-2 hover:bg-gray-200 rounded-full"
              onClick={handleSearchClick}
            >
              <Image
                src="/static/svg/icon-search-3.svg"
                alt="Search"
                width={25}
                height={25}
              />
            </button>
            <RoundButton onClick={writeArticle}>새 글 작성</RoundButton>
          </div>
        )}
      </div>
    </header>
  );
}
