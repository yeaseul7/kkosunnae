'use client';
import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import HomeTabSkeleton from '@/packages/ui/components/base/HomeTabSkeleton';
import PostCardSkeleton from '@/packages/ui/components/base/PostCardSkeleton';

const PageTemplate = dynamic(
    () => import('@/packages/ui/components/base/PageTemplate'),
    { ssr: true }
);

const PageFooter = dynamic(
    () => import('@/packages/ui/components/base/PageFooter'),
    { ssr: true }
);

const HomeTab = dynamic(
    () => import('@/packages/ui/components/home/HomeTab'),
    {
        ssr: true,
        loading: () => <HomeTabSkeleton />
    }
);

const TrendingPosts = dynamic(
    () => import('@/packages/ui/components/home/trending/TrendingPosts'),
    { ssr: true }
);

const RecentPosts = dynamic(
    () => import('@/packages/ui/components/home/recent/RecentPosts'),
    { ssr: true }
);



export default function CommunityPage() {
    const [mode, setMode] = useState<'trending' | 'adoption'>('trending');
    return (
        <main className="page-container-full">
            <PageTemplate visibleHomeTab={false}>
                <div className="w-full">
                    <Suspense fallback={<HomeTabSkeleton />}>
                        <HomeTab mode={mode} setMode={setMode} />
                    </Suspense>
                    <Suspense fallback={
                        <div className="w-full">
                            <div className="grid grid-cols-1 gap-4 px-4 pt-8 w-full sm:px-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {Array.from({ length: 12 }).map((_, index) => (
                                    <PostCardSkeleton key={`skeleton-${index}`} />
                                ))}
                            </div>
                        </div>
                    }>
                        {mode === 'trending' ? <TrendingPosts /> : <RecentPosts />}
                    </Suspense>
                </div>

            </PageTemplate>
            <PageFooter />
        </main>
    );
}
