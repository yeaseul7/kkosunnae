import { useAuth } from '@/lib/firebase/auth';
import { CommentData } from '@/packages/type/commentType';
import { Timestamp } from 'firebase/firestore';
import { useMemo } from 'react';

export default function CommentHeader({
  commentData,
}: {
  commentData: CommentData;
}) {
  const { authorName, createdAt } = commentData;
  const { user } = useAuth();

  // 파생 상태는 직접 계산 (useEffect 불필요)
  const isMine = useMemo(
    () => user?.uid === commentData.authorId,
    [user, commentData.authorId],
  );

  const formatDate = (timestamp: Timestamp | null): string => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 0 ? '방금 전' : `${minutes}분 전`;
      }
      return `약 ${hours}시간 전`;
    } else if (days === 1) {
      return '어제';
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };
  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-2 items-center">
        <span className="text-sm font-semibold text-gray-900">
          {authorName}
        </span>
        <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
      </div>
      <div className="flex gap-2 items-center">
        {isMine && (
          <>
            <button className="text-xs text-gray-500">수정</button>
            <button className="text-xs text-gray-500">삭제</button>
          </>
        )}
      </div>
    </div>
  );
}
