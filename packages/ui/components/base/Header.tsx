'use client';

import Link from 'next/link';
import Image from 'next/image';
import RoundButton from '../common/RoundButton';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useClickOutside } from '@/packages/utils/clickEvent';
import { useRouter, usePathname } from 'next/navigation';
import LoginModal from '../auth/LoginModal';
import HeaderUserIcon from './HeaderUserIcon';
import HeaderUserMenu from './HeaderUserMenu';
import { useAuth } from '@/lib/firebase/auth';
import NotificationPop from '../home/notification/NotificationPop';
import { getUnreadHistoryCount } from '@/lib/api/hisotry';
import NavLink from '../common/NavLink';

interface HeaderProps {
  visibleHeaderButtons?: boolean;
}
export default function Header({ visibleHeaderButtons = true }: HeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationPopOpen, setIsNotificationPopOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadHistoryCount, setUnreadHistoryCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside<HTMLDivElement>(
    userMenuRef,
    () => setIsUserMenuOpen(false),
    isUserMenuOpen,
  );

  useClickOutside<HTMLDivElement>(
    notificationRef,
    () => setIsNotificationPopOpen(false),
    isNotificationPopOpen,
  );

  useClickOutside<HTMLDivElement>(
    mobileMenuRef,
    () => setIsMobileMenuOpen(false),
    isMobileMenuOpen,
  );

  const handleNotificationClick = useCallback(() => {
    setIsNotificationPopOpen((prev) => !prev);
  }, []);

  const handleSearchClick = useCallback(() => {
    router.push('/search');
  }, [router]);

  const writeArticle = useCallback(() => {
    router.push('/write');
  }, [router]);

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const fetchUnreadHistoryCount = async () => {
      if (!user?.uid) return;
      const unreadHistoryCount = await getUnreadHistoryCount(user.uid);
      setUnreadHistoryCount(unreadHistoryCount);
    };
    fetchUnreadHistoryCount();
  }, [user]);

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white border-b border-gray-200">
      <div className="flex justify-between items-center px-4 mx-auto w-full max-w-7xl h-full sm:px-6">
        <div className="flex items-center gap-4 md:gap-10">
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <Image
            src="/static/images/logoicon.png"
            alt="Logo"
            width={30}
            height={30}
            className="block md:hidden"
            loading="eager"
          />
          <Image
            src="/static/images/logorow-xl.png"
            alt="Logo"
            width={180}
            height={180}
            className="hidden md:block"
            style={{ width: 'auto', height: 'auto' }}
            loading="eager"
          />
        </Link>
        {/* 데스크탑 메뉴 */}
        <div className="hidden md:flex items-center gap-5">
          <NavLink
            to="/"
            activeClassName="active"
            isActive={() => {
              return pathname === '/';
            }}
            className={`!border-b-0 !p-0 ${
              pathname === '/'
                ? '!text-primary1'
                : '!text-black'
            }`}
          >
            커뮤니티
          </NavLink>
          <NavLink
            to="/shelter"
            activeClassName="active"
            isActive={() => {
              return pathname === '/shelter' || pathname.startsWith('/shelter');
            }}
            className={`!border-b-0 !p-0 ${
              pathname === '/shelter' || pathname.startsWith('/shelter')
                ? '!text-primary1'
                : '!text-black'
            }`}
          >
            유기견/유기묘 공고
          </NavLink>
        </div>
        {/* 모바일 햄버거 메뉴 */}
        <div ref={mobileMenuRef} className="relative md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            aria-label="메뉴"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
              <NavLink
                to="/"
                activeClassName="active"
                isActive={() => {
                  return pathname === '/';
                }}
                className={`block px-4 py-3 !border-b-0 transition-colors hover:bg-gray-50 ${
                  pathname === '/'
                    ? '!text-primary1 bg-blue-50'
                    : '!text-black'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                커뮤니티
              </NavLink>
              <NavLink
                to="/shelter"
                activeClassName="active"
                isActive={() => {
                  return pathname === '/shelter' || pathname.startsWith('/shelter');
                }}
                className={`block px-4 py-3 !border-b-0 transition-colors hover:bg-gray-50 ${
                  pathname === '/shelter' || pathname.startsWith('/shelter')
                    ? '!text-primary1 bg-blue-50'
                    : '!text-black'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                유기견/유기묘 공고
              </NavLink>
            </div>
          )}
        </div>
        </div>
        {visibleHeaderButtons && (
          <div className="flex gap-1 items-center sm:gap-2">
            <div ref={notificationRef} className="relative">
              <button
                className="relative p-2 rounded-full transition-all duration-200 hover:bg-gray-100 active:scale-95"
                onClick={handleNotificationClick}
                aria-label="알림"
              >
                <Image
                  src="/static/svg/icon-notification.svg"
                  alt="Notification"
                  width={24}
                  height={24}
                  className="transition-opacity hover:opacity-70"
                />
                {unreadHistoryCount > 0 && (
                  <span className="flex absolute top-0 right-0 justify-center items-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm">
                    {unreadHistoryCount > 99 ? '99+' : unreadHistoryCount}
                  </span>
                )}
              </button>
              {isNotificationPopOpen && (
                <NotificationPop
                  onClose={() => setIsNotificationPopOpen(false)}
                />
              )}
            </div>
            <button
              className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100 active:scale-95"
              onClick={handleSearchClick}
              aria-label="검색"
            >
              <Image
                src="/static/svg/icon-search-3.svg"
                alt="Search"
                width={24}
                height={24}
                className="transition-opacity hover:opacity-70"
              />
            </button>
            {!loading && (
              <>
                {user ? (
                  <div
                    ref={userMenuRef}
                    className="flex relative gap-2 items-center sm:gap-3"
                  >
                    <RoundButton
                      onClick={writeArticle}
                      className="hidden sm:flex"
                    >
                      글쓰기
                    </RoundButton>
                    <HeaderUserIcon
                      setIsUserMenuOpen={setIsUserMenuOpen}
                      isUserMenuOpen={isUserMenuOpen}
                    />
                    {isUserMenuOpen && (
                      <HeaderUserMenu
                        setIsUserMenuOpen={setIsUserMenuOpen}
                        isUserMenuOpen={isUserMenuOpen}
                      />
                    )}
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
