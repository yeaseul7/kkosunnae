'use client';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import TrendingPosts from '@/packages/ui/components/home/trending/TrendingPosts';
import RecentPosts from '@/packages/ui/components/home/recent/RecentPosts';
import PageFooter from '@/packages/ui/components/base/PageFooter';
import YoutubeList from '@/packages/ui/components/common/YoutubeList';
import HomeTab from '@/packages/ui/components/home/HomeTab';
import { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState<'trending' | 'adoption'>('trending');
  return (
    <main className="page-container-full">
      <PageTemplate visibleHomeTab={false}>
        <div className="w-full">
          <HomeTab mode={mode} setMode={setMode} />
          {mode === 'trending' ? <TrendingPosts /> : <RecentPosts />}
        </div>
        <YoutubeList />
      </PageTemplate>
      <PageFooter />
    </main>
  );
}
