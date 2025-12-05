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
    <div className="flex gap-2 justify-between items-center mt-4 w-full">
      <div className="flex gap-2 items-center">
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
            style={{ height: '30px' }}
          />
          <span className="font-bold">이번주 귀요미</span>
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
          <MdAccessTime className="w-6 h-6" />
          최근 귀요미
        </NavLink>
      </div>
      {(pathname === '/' || pathname.startsWith('/trending')) && <TimePicker />}
    </div>
  );
}
