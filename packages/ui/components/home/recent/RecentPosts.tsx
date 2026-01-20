'use client';
import { getRecentBoardsData } from '@/lib/api/post';
import { useEffect, useState } from 'react';

import PostCard from '../../base/PostCard';
import Loading from '../../base/Loading';
import { PostData } from '@/packages/type/postType';

export default function RecentPosts() {
  const [allPosts, setAllPosts] = useState<PostData[]>([]); // 전체 게시물
  const [displayedPosts, setDisplayedPosts] = useState<PostData[]>([]); // 표시되는 게시물
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [displayCount, setDisplayCount] = useState(8); // 처음 8개 표시

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getRecentBoardsData();
        setAllPosts(postsData as PostData[]);
        setDisplayedPosts((postsData as PostData[]).slice(0, 8)); // 처음 8개만 표시
      } catch (e) {
        console.error('게시물 조회 중 오류 발생:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    setLoadingMore(true);
    
    // 다음 12개 추가
    setTimeout(() => {
      const nextCount = displayCount + 12;
      setDisplayedPosts(allPosts.slice(0, nextCount));
      setDisplayCount(nextCount);
      setLoadingMore(false);
    }, 300); // 부드러운 로딩 효과
  };

  const hasMore = displayedPosts.length < allPosts.length;

  if (loading) {
    return <Loading />;
  }

  if (allPosts.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">게시물이 없습니다.</div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 px-4 pt-8 w-full sm:px-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="flex justify-center mt-8 mb-4 px-4 sm:px-0">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="text-blue-600 hover:text-blue-800 font-semibold 
                       transition-colors duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                로딩중...
              </span>
            ) : (
              `더보기 (${allPosts.length - displayedPosts.length}개 더 있음)`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
