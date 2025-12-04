'use client';
import { useRef, useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/firebase/auth';

export default function WriteComment({ postId }: { postId: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const lineHeight = 24;
      const fixedHeight = lineHeight * 3;

      textarea.style.height = `${fixedHeight}px`;
      textarea.style.overflowY = 'auto';
    }
  }, []);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    if (!user) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const commentsCollection = collection(
        firestore,
        'boards',
        postId,
        'comments',
      );
      await addDoc(commentsCollection, {
        content: comment.trim(),
        authorId: user.uid,
        authorName: user.displayName || user.email || '익명',
        authorPhotoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        likes: 0,
      });

      setComment('');
      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
    } catch (error) {
      console.error('댓글 작성 중 오류 발생:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col p-4 px-10 w-full">
      <div className="flex flex-col gap-2 p-4 w-full rounded-md border border-gray-200">
        <textarea
          ref={textareaRef}
          placeholder="댓글을 입력하세요 (Cmd/Ctrl + Enter로 전송)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          className="overflow-y-auto w-full text-sm leading-6 outline-none resize-none"
          rows={3}
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!comment.trim() || isSubmitting}
            className="px-4 py-2 text-sm text-white rounded bg-primary1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary2"
          >
            {isSubmitting ? '전송 중...' : '댓글 작성'}
          </button>
        </div>
      </div>
    </div>
  );
}
