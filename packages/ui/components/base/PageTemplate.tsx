'use client';

import dynamic from 'next/dynamic';
import Header from './Header';

const HomeTab = dynamic(
  () => import('../home/HomeTab'),
  { ssr: true }
);

interface PageTemplateProps {
  children?: React.ReactNode;
  visibleHomeTab?: boolean;
  visibleHeaderButtons?: boolean;
  mode?: 'trending' | 'recent';
  setMode?: (mode: 'trending' | 'recent') => void;
}

export default function PageTemplate({
  children,
  visibleHomeTab = true,
  visibleHeaderButtons = true,
  mode,
  setMode,
}: PageTemplateProps) {

  return (
    <div className="flex flex-col items-center w-full h-full min-h-0">
      <div className="shrink-0 w-full">
        <Header visibleHeaderButtons={visibleHeaderButtons} />
      </div>
      {visibleHomeTab && <div className="shrink-0"><HomeTab mode={mode as 'trending' | 'adoption'} setMode={setMode as (mode: 'trending' | 'adoption') => void} /></div>}
      <div className="flex-1 min-h-0 w-full bg-lightBlue overflow-hidden">
        <div className="flex flex-col h-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl mb-15 pb-15">{children}</div>
      </div>
    </div>
  );
}
