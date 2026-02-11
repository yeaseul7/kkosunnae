'use client';

import Image from 'next/image';
import {
    HiEye,
    HiHeart,
    HiShare,
    HiBookmark,
} from 'react-icons/hi';
import type { CardNewsData, SerializedCardNewsData } from '@/packages/type/cardNewsType';
import { CARD_NEWS_CATEGORY_LABELS } from '@/packages/ui/components/cardNews/CardNewsCard';

export type CarNewsInfoProps = {
    /** 카드뉴스 데이터 (서버 직렬화 시 createdAt/updatedAt은 ms) */
    data: CardNewsData | SerializedCardNewsData;
    /** 조회수 (선택, 기본 0) */
    viewCount?: number;
    /** 작성자 표시명 (선택, 기본 '운영자') */
    authorName?: string;
    /** 작성자 프로필 이미지 URL (선택) */
    authorPhotoURL?: string | null;
    /** 도움이 되었어요 클릭 시 (토글: 좋아요 추가/해제) */
    onHelpful?: () => void;
    /** 현재 좋아요 여부 */
    isLiked?: boolean;
    /** 좋아요 처리 중 로딩 */
    isHelpfulLoading?: boolean;
    /** 스크랩 클릭 시 (토글: 스크랩 추가/해제) */
    onScrap?: () => void;
    /** 현재 스크랩 여부 (스크랩한 경우 버튼 문구 변경) */
    isScraped?: boolean;
    /** 스크랩 처리 중 로딩 */
    isScrapLoading?: boolean;
    /** 공유 클릭 시 */
    onShare?: () => void;
    /** 로그인 여부 (비로그인 시 좋아요/스크랩 버튼에 '로그인 후 이용 가능' 안내) */
    isLoggedIn?: boolean;
};

function formatDate(createdAt: CardNewsData['createdAt'] | number | null): string {
    if (createdAt == null) return '';
    const date =
        typeof createdAt === 'number'
            ? new Date(createdAt)
            : createdAt.toDate?.() ?? new Date(0);
    return date
        .toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
        .replace(/\. /g, '.')
        .replace(/\.$/, '');
}

export default function CarNewsInfo({
    data,
    viewCount = 0,
    authorName = '운영자',
    authorPhotoURL,
    onHelpful,
    isLiked = false,
    isHelpfulLoading = false,
    onScrap,
    isScraped = false,
    isScrapLoading = false,
    onShare,
    isLoggedIn = true,
}: CarNewsInfoProps) {
    const categoryLabel = CARD_NEWS_CATEGORY_LABELS[data.category] ?? data.category;
    const dateStr = formatDate(data.createdAt);
    const likeCount = data.likeCount ?? 0;

    return (
        <aside className="w-full rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            {/* 상단: 카테고리 + 조회수 */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    #{categoryLabel}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <HiEye className="h-4 w-4 shrink-0 text-gray-400" />
                    <span>{viewCount.toLocaleString()}</span>
                </span>
            </div>

            {/* 제목 */}
            <h2 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                {data.title || '제목 없음'}
            </h2>

            {/* 요약 */}
            {data.summary && (
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {data.summary}
                </p>
            )}

            {/* 작성자 + 날짜 + 공유 */}
            <div className="mt-5 flex items-start gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-amber-100">
                    {authorPhotoURL ? (
                        <Image
                            src={authorPhotoURL}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    ) : null}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{authorName}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{dateStr}</p>
                </div>
                <button
                    type="button"
                    onClick={onShare}
                    className="shrink-0 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary1"
                    aria-label="공유하기"
                >
                    <HiShare className="h-5 w-5" />
                </button>
            </div>

            {/* 도움이 되었어요 (로그인 필요, 채워진 하트 = 눌린 상태) */}
            <button
                type="button"
                onClick={onHelpful}
                disabled={isHelpfulLoading}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary1 focus:ring-offset-2 disabled:opacity-50 ${isLiked
                    ? 'bg-primary2 text-white hover:bg-primary1'
                    : 'bg-primary1 text-white hover:bg-primary2'
                    }`}
            >
                <HiHeart
                    className={`h-5 w-5 shrink-0 ${isLiked ? 'fill-white' : ''}`}
                />
                <span>
                    {isHelpfulLoading
                        ? '처리 중…'
                        : !isLoggedIn
                            ? `로그인 후 도움이 되었어요 ${likeCount.toLocaleString()}`
                            : `도움이 되었어요 ${likeCount.toLocaleString()}`}
                </span>
            </button>

            {/* 스크랩 (로그인 필요, 채워진 북마크 + 테두리 = 눌린 상태) */}
            <button
                type="button"
                onClick={onScrap}
                disabled={isScrapLoading}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary1 focus:ring-offset-2 disabled:opacity-50 ${isScraped
                    ? 'border-2 border-primary1 bg-primary1/10 text-primary1 hover:bg-primary1/20'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
            >
                <HiBookmark
                    className={`h-5 w-5 shrink-0 ${isScraped ? 'fill-primary1 text-primary1' : ''}`}
                />
                <span>
                    {isScrapLoading
                        ? '처리 중…'
                        : !isLoggedIn
                            ? '로그인 후 스크랩하기'
                            : isScraped
                                ? '스크랩함'
                                : '스크랩하기'}
                </span>
            </button>
        </aside>
    );
}
