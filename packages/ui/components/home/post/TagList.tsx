'use client';
import { useAuth } from '@/lib/firebase/auth';
import { firestore } from '@/lib/firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { PostData } from '@/packages/type/postType';

interface TagCount {
  tag: string;
  count: number;
}

export default function TagList({ userId }: { userId?: string }) {
  const { user } = useAuth();
  const [tags, setTags] = useState<TagCount[]>([]);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || user?.uid;

  useEffect(() => {
    const fetchUserTags = async () => {
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

        const tagCountMap = new Map<string, number>();

        postsList.forEach((post) => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag) => {
              if (tag && tag.trim()) {
                const trimmedTag = tag.trim();
                tagCountMap.set(
                  trimmedTag,
                  (tagCountMap.get(trimmedTag) || 0) + 1,
                );
              }
            });
          }
        });

        const tagsArray: TagCount[] = Array.from(tagCountMap.entries()).map(
          ([tag, count]) => ({
            tag,
            count,
          }),
        );

        tagsArray.sort((a, b) => b.count - a.count);

        setTags(tagsArray);
      } catch (error) {
        console.error('태그 조회 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTags();
  }, [targetUserId]);

  if (loading) {
    return (
      <div className="py-4 text-center text-gray-500">
        태그를 불러오는 중...
      </div>
    );
  }

  if (!targetUserId) {
    return (
      <div className="py-4 text-center text-gray-500">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        사용된 태그가 없습니다.
      </div>
    );
  }

  const displayTags = tags.slice(0, 10);
  const hasMoreTags = tags.length > 10;

  return (
    <div>
      <div className="mb-3 sm:mb-4">
        {/* <label className="text-base sm:text-lg font-semibold">태그 목록</label> */}
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {displayTags.map((tagCount) => (
          <div
            key={tagCount.tag}
            className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-xs sm:text-sm md:text-base rounded-full bg-element2 text-text1 whitespace-nowrap"
          >
            {tagCount.tag} ({tagCount.count})
          </div>
        ))}
        {hasMoreTags && (
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-xs sm:text-sm md:text-base rounded-full bg-element2 text-text1 whitespace-nowrap">
            ...
          </div>
        )}
      </div>
    </div>
  );
}
