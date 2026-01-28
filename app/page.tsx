'use client';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import PageFooter from '@/packages/ui/components/base/PageFooter';
import TrendingPosts from '@/packages/ui/components/home/trending/TrendingPosts';
import RecentPosts from '@/packages/ui/components/home/recent/RecentPosts';
import YoutubeList from '@/packages/ui/components/common/YoutubeList';

const HomeTab = dynamic(
  () => import('@/packages/ui/components/home/HomeTab'),
  {
    ssr: true,
    loading: () => <div className="flex justify-center items-center mt-8 w-full mb-4 h-[92px]" />
  }
);


export default function Home() {
  const [mode, setMode] = useState<'trending' | 'adoption'>('trending');
  return (
    <main className="page-container-full">
      <PageTemplate visibleHomeTab={false}>
        <div className="w-full">
          <Suspense fallback={<div className="flex justify-center items-center mt-8 w-full mb-4 h-[92px]" />}>
            <HomeTab mode={mode} setMode={setMode} />
          </Suspense>
          <Suspense fallback={<div className="py-12 text-center text-gray-500">로딩 중...</div>}>
            {mode === 'trending' ? <TrendingPosts /> : <RecentPosts />}
          </Suspense>
        </div>
        <Suspense fallback={<div className="py-12 text-center text-gray-500">로딩 중...</div>}>
          <YoutubeList />
        </Suspense>
      </PageTemplate>
      <PageFooter />
    </main>
  );
}
