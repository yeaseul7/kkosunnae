'use client';
import { useAuth } from '@/lib/firebase/auth';
import { firestore } from '@/lib/firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import PostCard from '../../base/PostCard';
import Loading from '../../base/Loading';
import { PostData } from '@/packages/type/postType';
import { enrichPostsWithAuthorInfo } from '@/lib/api/post';

export default function PostScrollList({ userId }: { userId?: string }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || user?.uid;

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!targetUserId) {
        setLoading(false);
        return;
      }

      try {
        const boardsCol = collection(firestore, 'boards');
        const q = query(boardsCol, where('authorId', '==', targetUserId));
        const boardsSnapshot = await getDocs(q);

        const postsList = boardsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PostData[];

        // 클라이언트에서 최신순으로 정렬
        postsList.sort((a, b) => {
          const aTime = a.createdAt?.toMillis() || 0;
          const bTime = b.createdAt?.toMillis() || 0;
          return bTime - aTime; // 내림차순 (최신순)
        });

        // 작성자 정보 추가
        const postsWithAuthorInfo = await enrichPostsWithAuthorInfo(postsList);
        setPosts(postsWithAuthorInfo);
      } catch (error) {
        console.error('게시물 조회 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [targetUserId]);

  if (loading) {
    return <Loading />;
  }

  if (!targetUserId) {
    return (
      <div className="py-12 text-center text-gray-500">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        작성한 게시물이 없습니다.
      </div>
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
