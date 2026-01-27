'use client';
import { getTrendingBoardsData } from '@/lib/api/post';
import { useEffect, useState } from 'react';
import PostCard from '../../base/PostCard';
import PostCardSkeleton from '../../base/PostCardSkeleton';
import { PostData } from '@/packages/type/postType';

export default function TrendingPosts() {
  const [allPosts, setAllPosts] = useState<PostData[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getTrendingBoardsData();
        setAllPosts(postsData);
        setDisplayedPosts(postsData.slice(0, 12));
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

    setTimeout(() => {
      const nextCount = displayCount + 12;
      setDisplayedPosts(allPosts.slice(0, nextCount));
      setDisplayCount(nextCount);
      setLoadingMore(false);
    }, 300);
  };

  const hasMore = displayedPosts.length < allPosts.length;

  if (allPosts.length === 0 && !loading) {
    return (
      <div className="py-12 text-center text-gray-500">게시물이 없습니다.</div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 px-4 pt-8 w-full sm:px-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <PostCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : (
          <>
            {displayedPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                highPriority={index < 12}
                highQuality={index < 12}
              />
            ))}
            {loadingMore && (
              Array.from({ length: 12 }).map((_, index) => (
                <PostCardSkeleton key={`skeleton-more-${index}`} />
              ))
            )}
          </>
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8 mb-4 px-4 sm:px-0">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="text-primary1 hover:text-primary2 font-semibold 
                       transition-colors duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                로딩중...
              </span>
            ) : (
              `더보기`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
