'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';
import { useState, useEffect, useMemo } from 'react';
import { HiHeart } from 'react-icons/hi2';
import { HiChatBubbleLeft } from 'react-icons/hi2';
import { PostData } from '@/packages/type/postType';
import { formatDate } from '@/packages/utils/dateFormatting';
import getOptimizedCloudinaryUrl from '@/packages/utils/optimization';
import UserProfile from '../common/UserProfile';

export default function PostCard({ post }: { post: PostData }) {
  const router = useRouter();
  const [commentCount, setCommentCount] = useState<number>(0);

  const extractText = (html: string): string => {
    if (!html) return '';
    const text = html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  const extractFirstImage = (html: string | undefined): string | null => {
    if (!html || typeof html !== 'string') {
      return null;
    }

    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
    const match = html.match(imgRegex);

    if (match && match[1]) {
      return match[1];
    }

    return null;
  };

  const rawThumbnailImage = extractFirstImage(post.content);

  const thumbnailImage = useMemo(() => {
    if (!rawThumbnailImage) return null;
    return getOptimizedCloudinaryUrl(rawThumbnailImage, 300, 300);
  }, [rawThumbnailImage]);

  const defaultImage = useMemo(() => {
    if (!post.tags || post.tags.length === 0) {
      return '/static/images/defaultDogImg.png';
    }
    const catTags = ['고양이', '냥냥이', '냥이', '냥', '냐옹', '츄르', '야옹'];
    if (catTags.some((tag) => post.tags.includes(tag))) {
      return '/static/images/defaultCatImg.png';
    }
    return '/static/images/defaultDogImg.png';
  }, [post.tags]);

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
        const commentCount = commentsSnapshot.size;

        // 각 댓글의 repliesCount 합산
        let totalRepliesCount = 0;
        commentsSnapshot.forEach((commentDoc) => {
          const commentData = commentDoc.data();
          totalRepliesCount += commentData.repliesCount || 0;
        });

        const totalCommentCount = commentCount + totalRepliesCount;
        setCommentCount(totalCommentCount);
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
      className="flex overflow-hidden flex-col bg-white rounded-2xl shadow-sm transition-all duration-200 cursor-pointer hover:shadow-lg hover:translate-y-1 active:translate-y-0 active:shadow-sm"
    >
      <div className="relative w-full bg-gray-200 aspect-square">
        <Image
          src={thumbnailImage || defaultImage}
          alt={post.title || '게시물 이미지'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={true}
        />
      </div>
      <div className="flex flex-col flex-1 p-2">
        <h2 className="mb-1.5 text-base font-semibold text-gray-900 line-clamp-2">
          {post.title}
        </h2>
        <p className="mb-2 text-xs text-gray-600 line-clamp-2">
          {extractText(post.content)}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex gap-2 items-center text-xs text-gray-500">
            <span>{formatDate(post.createdAt)}</span>
            <span>·</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <UserProfile
            profileUrl={post.authorPhotoURL || ''}
            profileName={post.authorName || ''}
            imgSize={20}
            sizeClass="w-5 h-5"
            existName={true}
            iconSize="text-xs"
          />

          <div className="flex gap-2 items-center">
            <div className="flex gap-1 items-center text-[#FFB6C1]">
              <HiHeart className="w-3.5 h-3.5" />
              <span className="text-xs">{post.likes || 0}</span>
            </div>
            <div className="flex gap-1 items-center text-[#87CEEB]">
              <HiChatBubbleLeft className="w-3.5 h-3.5" />
              <span className="text-xs">{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
