'use client';

import Link from 'next/link';
import Image from 'next/image';
import { HiHeart, HiCalendar } from 'react-icons/hi';
import getOptimizedCloudinaryUrl from '@/packages/utils/optimization';
import type { CardNewsData } from '@/packages/type/cardNewsType';

/** 카테고리 id → 카드에 표시할 라벨 */
export const CARD_NEWS_CATEGORY_LABELS: Record<string, string> = {
    adoption: '입양·봉사',
    training: '훈련·교육',
    health: '건강·일상',
};

function formatDate(timestamp: CardNewsData['createdAt']): string {
    if (!timestamp) return '';
    const date = timestamp.toDate?.() ?? new Date(0);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).replace(/\. /g, '.').replace(/\.$/, '');
}

export type CardNewsCardProps = {
    /** 카드뉴스 데이터 (한 건) */
    data: CardNewsData;
    /** 이미지 비율 (기본 3/4) */
    aspectRatio?: '3/4' | '1/1' | '16/9';
};

const ASPECT_CLASS: Record<NonNullable<CardNewsCardProps['aspectRatio']>, string> = {
    '3/4': 'aspect-[3/4]',
    '1/1': 'aspect-square',
    '16/9': 'aspect-video',
};

/** 이미지 없을 때 배경 (올리브 그린 톤) */
const IMAGE_PLACEHOLDER_BG = 'bg-[#e8ead9]';

export default function CardNewsCard({ data, aspectRatio = '3/4' }: CardNewsCardProps) {
    const imageUrl = data.images?.[0] ?? '';
    const optimizedUrl = imageUrl && imageUrl.includes('res.cloudinary.com')
        ? getOptimizedCloudinaryUrl(imageUrl, 400, 533)
        : imageUrl;
    const dateStr = formatDate(data.createdAt);

    return (
        <Link
            href={`/card_news/${data.id}`}
            className="group flex flex-col"
        >
            {/* 이미지만 둥근 프레임 + 그림자 (박스 아님) */}
            <div
                className={`relative w-full overflow-hidden rounded-2xl shadow-sm transition-shadow group-hover:shadow-md ${optimizedUrl ? 'bg-gray-100' : IMAGE_PLACEHOLDER_BG} ${ASPECT_CLASS[aspectRatio]}`}
            >
                {optimizedUrl ? (
                    <Image
                        src={optimizedUrl}
                        alt=""
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                        이미지 없음
                    </div>
                )}
            </div>
            {/* 제목·날짜·좋아요는 박스 없이 아래에만 */}
            <div className="mt-3 flex flex-col">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 group-hover:text-primary1">
                    {data.title || '제목 없음'}
                </h3>
                <div className="mt-1.5 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <HiCalendar className="h-4 w-4 shrink-0 text-gray-400" />
                        {dateStr}
                    </span>
                    <span className="flex items-center gap-1">
                        <HiHeart className="h-4 w-4 shrink-0 text-red-400" />
                        {data.likeCount ?? 0}
                    </span>
                </div>
            </div>
        </Link>
    );
}
