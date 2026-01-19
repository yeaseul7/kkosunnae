'use client';

import HomeTab from '../home/HomeTab';
import ShelterHomeTab from '../home/shelter/HomeTab';
import Header from './Header';
import { usePathname } from 'next/navigation';

interface PageTemplateProps {
  children?: React.ReactNode;
  visibleHomeTab?: boolean;
  visibleHeaderButtons?: boolean;
}

export default function PageTemplate({
  children,
  visibleHomeTab = true,
  visibleHeaderButtons = true,
}: PageTemplateProps) {
  const pathname = usePathname();
  // const isShelterPage = pathname === '/shelter' || pathname.startsWith('/shelter');

  return (
    <div className="flex flex-col items-center w-full pb-10">
      <div className="w-full">
        <Header visibleHeaderButtons={visibleHeaderButtons} />
      </div>
      {visibleHomeTab && <HomeTab />}
      <div className="w-full">{children}</div>
    </div>
  );
}
