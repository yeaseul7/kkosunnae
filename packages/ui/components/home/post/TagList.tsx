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

  // 파스텔 색상 팔레트
  const pastelColors = [
    { bg: '#FFE5E5', text: '#8B4A4A' }, // 연한 핑크
    { bg: '#FFF5E1', text: '#8B6F3C' }, // 연한 노랑
    { bg: '#E5F5E5', text: '#4A8B5A' }, // 연한 초록
    { bg: '#E5F0FF', text: '#4A6A8B' }, // 연한 파랑
    { bg: '#F0E5FF', text: '#6A4A8B' }, // 연한 보라
    { bg: '#FFE8D5', text: '#8B5A4A' }, // 연한 오렌지
    { bg: '#E5FFF5', text: '#4A8B7A' }, // 연한 민트
    { bg: '#FFE5F0', text: '#8B4A6A' }, // 연한 살구
    { bg: '#E5F0F5', text: '#4A6A7A' }, // 연한 하늘색
    { bg: '#FFF0E5', text: '#8B6A4A' }, // 연한 베이지
  ];

  // 태그 이름을 기반으로 색상 인덱스 결정 (일관성 유지)
  const getTagColor = (tag: string) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % pastelColors.length;
    return pastelColors[index];
  };

  return (
    <div>
      <div className="mb-3 sm:mb-4">
        {/* <label className="text-base sm:text-lg font-semibold">태그 목록</label> */}
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {displayTags.map((tagCount) => {
          const color = getTagColor(tagCount.tag);
          return (
            <div
              key={tagCount.tag}
              className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-xs sm:text-sm md:text-base rounded-full whitespace-nowrap font-bmjua"
              style={{
                backgroundColor: color.bg,
                color: color.text,
              }}
            >
              {tagCount.tag} ({tagCount.count})
            </div>
          );
        })}
        {hasMoreTags && (
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-xs sm:text-sm md:text-base rounded-full bg-element2 text-text1 whitespace-nowrap font-bmjua">
            ...
          </div>
        )}
      </div>
    </div>
  );
}
