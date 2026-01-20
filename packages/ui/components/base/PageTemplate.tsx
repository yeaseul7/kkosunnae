'use client';

import HomeTab from '../home/HomeTab';
import Header from './Header';

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
    <div className="flex flex-col items-center w-full pb-10">
      <div className="w-full">
        <Header visibleHeaderButtons={visibleHeaderButtons} />
      </div>
      {visibleHomeTab && <HomeTab mode={mode as 'trending' | 'recent'} setMode={setMode as (mode: 'trending' | 'recent') => void} />}
      <div className="w-full">{children}</div>
    </div>
  );
}
