'use client';
import { useRef, useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/firebase/auth';
import { VscSend } from 'react-icons/vsc';
import { createHistory } from '@/lib/api/hisotry';

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
      // 게시물 정보 가져오기
      const postRef = doc(firestore, 'boards', postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        alert('게시물을 찾을 수 없습니다.');
        return;
      }

      const commentsCollection = collection(
        firestore,
        'boards',
        postId,
        'comments',
      );
      const commentDocRef = await addDoc(commentsCollection, {
        content: comment.trim(),
        authorId: user.uid,
        createdAt: serverTimestamp(),
        likes: 0,
      });

      // 게시물 작성자에게 댓글 알림 생성
      const postData = postDoc.data();
      if (postData?.authorId) {
        await createHistory(
          postData.authorId,
          user.uid,
          'comment',
          'comment',
          commentDocRef.id,
          postId,
          commentDocRef.id,
        );
      }

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

  const commentLength = comment.length;
  const maxLength = 500;

  return (
    <div className="flex flex-col p-4 px-10 w-full">
      <div className="flex flex-col gap-2 p-4 w-full rounded-md border border-gray-200">
        <textarea
          ref={textareaRef}
          placeholder="댓글을 입력하세요 (Cmd/Ctrl + Enter로 전송)"
          value={comment}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              setComment(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          className="overflow-y-auto w-full text-sm leading-6 outline-none resize-none"
          rows={3}
          disabled={isSubmitting}
          maxLength={maxLength}
        />
        <div className="flex justify-between items-center">
          <span
            className={`text-xs ${
              commentLength >= maxLength
                ? 'text-red-500'
                : commentLength >= maxLength * 0.9
                ? 'text-orange-500'
                : 'text-gray-500'
            }`}
          >
            {commentLength}/{maxLength}
          </span>
          <button
            onClick={handleSubmit}
            disabled={
              !comment.trim() || isSubmitting || commentLength > maxLength
            }
            className="flex justify-center items-center p-2 text-white rounded-full transition-colors bg-primary1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary2"
            aria-label="댓글 전송"
          >
            {isSubmitting ? (
              <span className="text-sm">전송 중...</span>
            ) : (
              <VscSend className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
