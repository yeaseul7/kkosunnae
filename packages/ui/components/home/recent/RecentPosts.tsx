'use client';
import { getBoardsData, getRecentBoardsData } from '@/lib/api/post';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Timestamp } from 'firebase/firestore';
import { HiHeart } from 'react-icons/hi2';
import { PiDogFill } from 'react-icons/pi';
import PostCard from '../../base/PostCard';
import Loading from '../../base/Loading';

export interface PostData {
  id: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorPhotoURL: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export default function RecentPosts() {
  const router = useRouter();
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
