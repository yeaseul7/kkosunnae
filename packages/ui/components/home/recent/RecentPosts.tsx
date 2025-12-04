'use client';
import { getRecentBoardsData } from '@/lib/api/post';
import { useEffect, useState } from 'react';

import PostCard from '../../base/PostCard';
import Loading from '../../base/Loading';
import { PostData } from '@/packages/type/postType';

export default function RecentPosts() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getRecentBoardsData();

        setPosts(postsData as PostData[]);
      } catch (e) {
        console.error('게시물 조회 중 오류 발생:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  if (loading) {
    return <Loading />;
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">게시물이 없습니다.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 pt-8 w-full md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
