'use client';

import DecorateHr from '@/packages/ui/components/base/DecorateHr';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import PostScrollList from '@/packages/ui/components/home/post/PostScrollList';
import TagList from '@/packages/ui/components/home/post/TagList';
import UserHeader from '@/packages/ui/components/home/profile/UserHeader';
import { useParams } from 'next/navigation';

export default function PostsListPage() {
  const params = useParams();
  const userId = params.id as string;

  return (
    <div className="flex justify-center items-center min-h-screen font-sans bg-white">
      <main className="flex flex-col justify-between items-center px-4 py-4 w-full max-w-6xl min-h-screen bg-whitesm:items-start">
        <PageTemplate visibleHomeTab={false}>
          <div className="flex flex-col gap-4 px-4 mx-auto w-full max-w-4xl sm:px-6 lg:px-8">
            <UserHeader />
            <DecorateHr />
            <TagList userId={userId} />
            <PostScrollList userId={userId} />
          </div>
        </PageTemplate>
      </main>
    </div>
  );
}
