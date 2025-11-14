'use client';

import NavLink from '../common/NavLink';
import { MdAccessTime, MdTrendingUp } from 'react-icons/md';
import TimePicker from './TimePicker';
import { usePathname } from 'next/navigation';

export default function HomeTab() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 w-full justify-between mt-4">
      <div className="flex items-center gap-2">
        <NavLink
          to="/trending"
          activeClassName="active"
          isActive={() => {
            return pathname === '/' || pathname.startsWith('/trending');
          }}
          className="flex items-center gap-2"
        >
          <MdTrendingUp className="w-6 h-6" />
          이번주 귀요미
        </NavLink>
        <NavLink
          to="/recent"
          activeClassName="active"
          isActive={() => {
            return pathname.startsWith('/recent');
          }}
          className="flex items-center gap-2"
        >
          <MdAccessTime className="w-6 h-6" />
          최근 귀요미
        </NavLink>
      </div>
      {(pathname === '/' || pathname.startsWith('/trending')) && <TimePicker />}
    </div>
  );
}
