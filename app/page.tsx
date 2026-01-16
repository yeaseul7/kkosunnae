'use client';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import { app } from '@/lib/firebase/firebase';
import { usePathname } from 'next/navigation';
import TrendingPosts from '@/packages/ui/components/home/trending/TrendingPosts';
import RecentPosts from '@/packages/ui/components/home/recent/RecentPosts';
import PageFooter from '@/packages/ui/components/base/PageFooter';

export default function Home() {
  const pathname = usePathname();
  return (
    <div className="flex justify-center items-center min-h-screen font-sans bg-white">
      <main className="flex flex-col justify-between items-center w-full max-w-6xl min-h-screen bg-whitesm:items-start">
        <PageTemplate>
          {pathname === '/' || pathname.startsWith('/trending') ? (
            <TrendingPosts />
          ) : (
            <RecentPosts />
          )}
        </PageTemplate>
        <PageFooter />
      </main>
    </div>
  );
}
