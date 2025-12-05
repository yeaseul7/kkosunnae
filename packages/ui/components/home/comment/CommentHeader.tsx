import { useAuth } from '@/lib/firebase/auth';
import { CommentData } from '@/packages/type/commentType';
import { Timestamp } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';

export default function CommentHeader({
  commentData,
  postId,
}: {
  commentData: CommentData;
  postId: string;
}) {
  const { authorName, createdAt } = commentData;
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // 파생 상태는 직접 계산 (useEffect 불필요)
  const isMine = useMemo(
    () => user?.uid === commentData.authorId,
    [user, commentData.authorId],
  );

  const handleDelete = async () => {
    if (!user) {
      alert('댓글을 삭제하려면 로그인이 필요합니다.');
      return;
    }

    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    if (!postId || !commentData.id || isDeleting) return;

    setIsDeleting(true);
    try {
      const commentRef = doc(
        firestore,
        'boards',
        postId,
        'comments',
        commentData.id,
      );
      await deleteDoc(commentRef);
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

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
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-700"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
