'use client';

import DecorateHr from '@/packages/ui/components/base/DecorateHr';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import PostScrollList from '@/packages/ui/components/home/post/PostScrollList';
import TagList from '@/packages/ui/components/home/post/TagList';
import UserHeader from '@/packages/ui/components/home/profile/UserHeader';
import ProfileSwitchTag from '@/packages/ui/components/home/ProfileSwitchTag';
import LikedAnimalList from '@/packages/ui/components/home/shelter/LikedAnimalList';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function PostsListPage() {
  const params = useParams();
  const userId = params.id as string;
  const [category, setCategory] = useState<'posts' | 'shelter'>('posts');
  return (
    <div className="flex justify-center items-center min-h-screen font-sans bg-white">
      <main className="flex flex-col justify-between items-center px-4 py-4 w-full max-w-6xl min-h-screen bg-whitesm:items-start">
        <PageTemplate visibleHomeTab={false}>
          <div className="flex flex-col gap-4 px-4 mx-auto w-full max-w-4xl sm:px-6 lg:px-8">
            <UserHeader />
            <DecorateHr />
            <ProfileSwitchTag category={category} setCategory={setCategory} />
            {category === 'posts' && (
              <>
              <TagList userId={userId} />
              <PostScrollList userId={userId} />
              </>
            )}
            {category === 'shelter' && (
              <LikedAnimalList userId={userId} />
            )}
          </div>
        </PageTemplate>
      </main>
    </div>
  );
}
