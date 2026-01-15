'use client';

import NavLink from '../common/NavLink';
import { MdAccessTime } from 'react-icons/md';
import TimePicker from './TimePicker';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export default function HomeTab() {
  const pathname = usePathname();
  const [animationData, setAnimationData] = useState(null);

  const isTrendingActive = pathname === '/' || pathname.startsWith('/trending');
  const isRecentActive = pathname.startsWith('/recent');

  useEffect(() => {
    fetch('/static/lottie/Hottab.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error('Failed to load animation:', err));
  }, []);

  return (
    <div className="flex flex-col gap-3 mt-4 w-full sm:flex-row sm:justify-center sm:items-center">
      <div className="flex gap-2 items-center sm:gap-2">
        <NavLink
          to="/trending"
          activeClassName="active !border-primary1"
          isActive={() => {
            return pathname === '/' || pathname.startsWith('/trending');
          }}
          className={`flex gap-2 items-center ${
            isTrendingActive ? '!text-primary1 !border-primary1' : '!text-black'
          }`}
        >
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-10 h-10 sm:w-12 sm:h-12"
            style={{ height: '24px' }}
          />
          <span className="text-sm font-bold whitespace-nowrap sm:text-sm md:text-base">
            이번달 랭킹
          </span>
        </NavLink>
        <NavLink
          to="/recent"
          activeClassName="active !border-primary1"
          isActive={() => {
            return pathname.startsWith('/recent');
          }}
          className={`flex gap-2 items-center ${
            isRecentActive ? '!text-primary1 !border-primary1' : '!text-black'
          }`}
        >
          <MdAccessTime className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          <span className="text-sm whitespace-nowrap sm:text-sm md:text-base">
            최근<span className="hidden sm:inline">귀요미 </span>
          </span>
        </NavLink>
      </div>
      {/* {(pathname === '/' || pathname.startsWith('/trending')) && (
        <div className="flex justify-end sm:justify-start">
          <TimePicker />
        </div>
      )} */}
    </div>
  );
}
