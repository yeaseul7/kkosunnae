'use client';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import TrendingPosts from '@/packages/ui/components/home/trending/TrendingPosts';
import RecentPosts from '@/packages/ui/components/home/recent/RecentPosts';
import PageFooter from '@/packages/ui/components/base/PageFooter';
import YoutubeList from '@/packages/ui/components/common/YoutubeList';
import HomeTab from '@/packages/ui/components/home/HomeTab';
import { useState } from 'react';
import { TbPaw } from 'react-icons/tb';

export default function Home() {
  const [mode, setMode] = useState<'trending' | 'recent'>('trending');
  return (
    <div className="flex justify-center items-center min-h-screen font-sans bg-white">
      <main className="flex flex-col justify-between items-center w-full max-w-6xl min-h-screen bg-whitesm:items-start">
        <PageTemplate visibleHomeTab={false}>
          <YoutubeList />
          
          <div className="w-full">
            <h3 className="text-sm sm:text-base md:text-lg font-bold mt-10 sm:mt-8 md:mt-10 mb-3 sm:mb-4 px-4 sm:px-0 text-gray-900 flex items-center gap-1.5 sm:gap-2">
              <TbPaw className="text-primary1 text-base sm:text-lg md:text-xl" />
              꼬순내 모음
            </h3>
            <HomeTab mode={mode} setMode={setMode} isMarginTop={false} />
            {mode === 'trending' ? <TrendingPosts /> : <RecentPosts />}
          </div>
        </PageTemplate>
        <PageFooter />
      </main>
    </div>
  );
}
