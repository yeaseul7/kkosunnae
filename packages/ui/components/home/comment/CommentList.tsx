'use client';
import { firestore } from '@/lib/firebase/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PiDogFill } from 'react-icons/pi';
import CommentContainer from './CommentContainer';
import { CommentData } from '@/packages/type/commentType';

export default function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      try {
        const commentCollection = collection(
          firestore,
          'boards',
          postId,
          'comments',
        );
        const q = query(commentCollection, orderBy('createdAt', 'desc'));
        const commentSnapshot = await getDocs(q);

        const commentsList = commentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as CommentData[];
        console.log(commentsList);
        setComments(commentsList);
      } catch (error) {
        console.error('댓글 조회 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 text-gray-500">
        댓글을 불러오는 중...
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex justify-center items-center py-8 text-gray-500">
        아직 댓글이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 px-10 w-full">
      {comments.map((comment, index) => (
        <div
          key={comment.id}
          className={`flex gap-3 p-4 w-full ${
            index !== comments.length - 1 ? 'border-b border-gray-200' : ''
          }`}
        >
          <div className="shrink-0">
            {comment.authorPhotoURL ? (
              <Image
                src={comment.authorPhotoURL}
                alt={comment.authorName}
                width={40}
                height={40}
                className="object-cover w-10 h-10 rounded-full"
              />
            ) : (
              <div className="flex justify-center items-center w-10 h-10 bg-gray-200 rounded-full">
                <PiDogFill className="text-lg text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <CommentContainer commentData={comment as CommentData} />
          </div>
        </div>
      ))}
    </div>
  );
}
