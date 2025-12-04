'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  deleteDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/firebase/auth';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';
import { BsShare } from 'react-icons/bs';

export default function Liked() {
  const params = useParams();
  const postId = params.id as string;
  const { user } = useAuth();
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      if (!postId) {
        setLoading(false);
        return;
      }

      try {
        const postDoc = await getDoc(doc(firestore, 'boards', postId));
        if (postDoc.exists()) {
          const data = postDoc.data();
          const likesCount = data.likes || 0;
          setLikes(likesCount);
        }

        if (user) {
          const likeListCollection = collection(
            firestore,
            'boards',
            postId,
            'likeList',
          );
          const userLikeDoc = doc(likeListCollection, user.uid);
          const userLikeSnapshot = await getDoc(userLikeDoc);
          setIsLiked(userLikeSnapshot.exists());
        } else {
          setIsLiked(false);
        }
      } catch (error) {
        console.error('좋아요 정보 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [postId, user]);

  const handleLike = async () => {
    if (!user) {
      alert('좋아요를 누르려면 로그인이 필요합니다.');
      return;
    }

    if (!postId || isUpdating) return;

    setIsUpdating(true);

    try {
      const postRef = doc(firestore, 'boards', postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        alert('게시물을 찾을 수 없습니다.');
        return;
      }

      const likeListCollection = collection(
        firestore,
        'boards',
        postId,
        'likeList',
      );
      const userLikeDoc = doc(likeListCollection, user.uid);

      if (isLiked) {
        await deleteDoc(userLikeDoc);
        await updateDoc(postRef, {
          likes: increment(-1),
        });
        setLikes((prev) => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        await setDoc(userLikeDoc, {
          uid: user.uid,
          isLiked: true,
          createdAt: serverTimestamp(),
        });
        await updateDoc(postRef, {
          likes: increment(1),
        });
        setLikes((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('좋아요 업데이트 실패:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="fixed left-48 top-60 z-50">
      <div className="flex flex-col items-center justify-center gap-3 p-2 rounded-4xl shadow-lg transition-all duration-200 bg-gray-1">
        <button
          onClick={handleLike}
          disabled={isUpdating}
          className={`rounded-full p-3 ${
            isLiked
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-label="좋아요"
        >
          {isLiked ? (
            <HiHeart className="w-5 h-5" />
          ) : (
            <HiOutlineHeart className="w-5 h-5" />
          )}
        </button>
        <span className="text-xs font-semibold">{likes}</span>
        <button
          onClick={handleLike}
          disabled={isUpdating}
          className={`rounded-full p-3 ${'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'} ${'cursor-pointer'}`}
          aria-label="공유"
        >
          <BsShare className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
