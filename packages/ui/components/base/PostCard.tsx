'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Timestamp } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';
import { useState, useEffect } from 'react';
import { HiHeart } from 'react-icons/hi2';
import { PiDogFill } from 'react-icons/pi';
import { HiChatBubbleLeft } from 'react-icons/hi2';
import { PostData } from '@/packages/type/postType';

export default function PostCard({ post }: { post: PostData }) {
  const router = useRouter();
  const [commentCount, setCommentCount] = useState<number>(0);
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

  // 콘텐츠에서 텍스트만 추출 (HTML 태그 제거)
  const extractText = (html: string): string => {
    if (!html) return '';
    const text = html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  // 콘텐츠에서 첫 번째 이미지 URL 추출
  const extractFirstImage = (html: string | undefined): string | null => {
    if (!html || typeof html !== 'string') {
      return null;
    }

    // <img> 태그에서 src 속성 추출
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
    const match = html.match(imgRegex);

    if (match && match[1]) {
      return match[1];
    }

    return null;
  };

  const thumbnailImage = extractFirstImage(post.content);

  // 댓글 개수 가져오기
  useEffect(() => {
    const fetchCommentCount = async () => {
      if (!post.id) return;
      try {
        const commentsCollection = collection(
          firestore,
          'boards',
          post.id,
          'comments',
        );
        const commentsSnapshot = await getDocs(commentsCollection);
        setCommentCount(commentsSnapshot.size);
      } catch (error) {
        console.error('댓글 개수 가져오기 실패:', error);
      }
    };

    fetchCommentCount();
  }, [post.id]);

  return (
    <article
      key={post.id}
      onClick={() => router.push(`/read/${post.id}`)}
      className="flex overflow-hidden flex-col bg-white rounded-md shadow-sm transition-all duration-200 cursor-pointer hover:shadow-lg hover:translate-y-1 active:translate-y-0 active:shadow-sm"
    >
      <div className="relative w-full bg-gray-200 aspect-video">
        <Image
          src={thumbnailImage || '/static/images/DefaultImage.png'}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">
          {post.title}
        </h2>

        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {extractText(post.content)}
        </p>

        {/* 하단 메타 정보 */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex gap-2 items-center text-xs text-gray-500">
            <span>{formatDate(post.createdAt)}</span>
            <span>·</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
          <div className="flex gap-2 items-center">
            {post.authorPhotoURL ? (
              <Image
                src={post.authorPhotoURL}
                alt={post.authorName}
                width={24}
                height={24}
                className="object-cover w-6 h-6 rounded-full"
              />
            ) : (
              <div className="flex justify-center items-center w-6 h-6 bg-gray-200 rounded-full">
                <PiDogFill className="text-xs text-gray-500" />
              </div>
            )}
            <span className="text-sm text-gray-700">
              by {post.authorName || '탈퇴한 사용자'}
            </span>
          </div>
          <div className="flex gap-3 items-center text-gray-500">
            <div className="flex gap-1 items-center">
              <HiHeart className="w-4 h-4" />
              <span className="text-sm">{post.likes || 0}</span>
            </div>
            <div className="flex gap-1 items-center">
              <HiChatBubbleLeft className="w-4 h-4" />
              <span className="text-sm">{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
