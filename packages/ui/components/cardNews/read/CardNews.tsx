'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import getOptimizedCloudinaryUrl from '@/packages/utils/optimization';

export type CardNewsProps = {
    /** 저장된 카드뉴스 이미지 URL 목록 (Cloudinary 등) */
    images: string[];
    /** (선택) 카드뉴스 제목 - 첫 카드 위에 표시 */
    title?: string;
    /** (선택) 카드뉴스 요약 - 제목 아래에 표시 */
    summary?: string;
};

/** 이미지 없을 때 배경 */
const IMAGE_PLACEHOLDER_BG = 'bg-[#e8ead9]';

/** 메인 이미지용 최적화 크기 (3:4 비율) */
const MAIN_WIDTH = 800;
const MAIN_HEIGHT = 1067;

/** 썸네일용 최적화 크기 */
const THUMB_WIDTH = 120;
const THUMB_HEIGHT = 160;

export default function CardNews({ images, title, summary }: CardNewsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const thumbScrollRef = useRef<HTMLDivElement>(null);

    const total = images?.length ?? 0;
    const hasMultiple = total > 1;

    const goPrev = useCallback(() => {
        setCurrentIndex((i) => (i <= 0 ? total - 1 : i - 1));
    }, [total]);

    const goNext = useCallback(() => {
        setCurrentIndex((i) => (i >= total - 1 ? 0 : i + 1));
    }, [total]);

    const scrollThumbToIndex = useCallback((index: number) => {
        const el = thumbScrollRef.current;
        if (!el) return;
        const thumb = el.querySelector(`[data-thumb-index="${index}"]`);
        thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, []);

    const handleThumbClick = useCallback(
        (index: number) => {
            setCurrentIndex(index);
            scrollThumbToIndex(index);
        },
        [scrollThumbToIndex]
    );

    const handlePrev = useCallback(() => {
        goPrev();
        scrollThumbToIndex(currentIndex <= 0 ? total - 1 : currentIndex - 1);
    }, [goPrev, currentIndex, total, scrollThumbToIndex]);

    const handleNext = useCallback(() => {
        goNext();
        scrollThumbToIndex(currentIndex >= total - 1 ? 0 : currentIndex + 1);
    }, [goNext, currentIndex, total, scrollThumbToIndex]);

    if (!images?.length) {
        return (
            <div
                className={`w-full overflow-hidden rounded-2xl ${IMAGE_PLACEHOLDER_BG} aspect-[3/4] flex items-center justify-center text-gray-500 text-sm`}
            >
                이미지 없음
            </div>
        );
    }

    const currentUrl = images[currentIndex];
    const mainOptimized =
        currentUrl && currentUrl.includes('res.cloudinary.com')
            ? getOptimizedCloudinaryUrl(currentUrl, MAIN_WIDTH, MAIN_HEIGHT)
            : currentUrl;

    const nextIndex = total > 1 ? (currentIndex + 1) % total : -1;
    const prevIndex = total > 1 ? (currentIndex - 1 + total) % total : -1;
    const nextUrl =
        nextIndex >= 0 && images[nextIndex]?.includes('res.cloudinary.com')
            ? getOptimizedCloudinaryUrl(images[nextIndex], MAIN_WIDTH, MAIN_HEIGHT)
            : nextIndex >= 0 ? images[nextIndex] : null;
    const prevUrl =
        prevIndex >= 0 && images[prevIndex]?.includes('res.cloudinary.com')
            ? getOptimizedCloudinaryUrl(images[prevIndex], MAIN_WIDTH, MAIN_HEIGHT)
            : prevIndex >= 0 ? images[prevIndex] : null;

    return (
        <div className="relative space-y-4">
            {/* 다음/이전 이미지 미리 로드 → 넘길 때 즉시 표시 */}
            {nextUrl && (
                <div
                    className="pointer-events-none absolute overflow-hidden opacity-0"
                    style={{ left: -9999, width: MAIN_WIDTH, height: MAIN_HEIGHT }}
                    aria-hidden
                >
                    <Image src={nextUrl} alt="" fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" />
                </div>
            )}
            {prevUrl && prevUrl !== nextUrl && (
                <div
                    className="pointer-events-none absolute overflow-hidden opacity-0"
                    style={{ left: -9999, width: MAIN_WIDTH, height: MAIN_HEIGHT, top: 0 }}
                    aria-hidden
                >
                    <Image src={prevUrl} alt="" fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" />
                </div>
            )}

            {(title || summary) && (
                <div className="space-y-1">
                    {title && (
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            {title}
                        </h2>
                    )}
                    {summary && (
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{summary}</p>
                    )}
                </div>
            )}

            {/* 메인 이미지: 세로 3:4 비율 */}
            <div className="relative">
                <article className="relative w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm aspect-[3/4]">
                    {mainOptimized ? (
                        <Image
                            src={mainOptimized}
                            alt={title ? `${title} - ${currentIndex + 1}` : `카드 ${currentIndex + 1}`}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, 672px"
                            priority={currentIndex === 0}
                        />
                    ) : (
                        <div
                            className={`absolute inset-0 flex items-center justify-center text-sm text-gray-500 ${IMAGE_PLACEHOLDER_BG}`}
                        >
                            이미지 없음
                        </div>
                    )}
                </article>

                {/* 좌우 이동 버튼 */}
                {hasMultiple && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary1"
                            aria-label="이전 이미지"
                        >
                            <HiChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary1"
                            aria-label="다음 이미지"
                        >
                            <HiChevronRight className="h-6 w-6" />
                        </button>
                    </>
                )}
            </div>

            {/* 하단: 전체 이미지 리스트 미리보기 (좌우 스크롤) */}
            {hasMultiple && (
                <div className="flex flex-col gap-2">
                    <div
                        ref={thumbScrollRef}
                        className="flex gap-2 overflow-x-auto overflow-y-hidden pb-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {images.map((url, index) => {
                            const thumbUrl =
                                url && url.includes('res.cloudinary.com')
                                    ? getOptimizedCloudinaryUrl(url, THUMB_WIDTH, THUMB_HEIGHT)
                                    : url;
                            const isActive = index === currentIndex;
                            return (
                                <button
                                    key={`thumb-${index}`}
                                    type="button"
                                    data-thumb-index={index}
                                    onClick={() => handleThumbClick(index)}
                                    className={`relative h-16 w-12 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-primary1 ${isActive ? 'border-primary1' : 'border-transparent'}`}
                                    style={{ scrollSnapAlign: 'start' }}
                                    aria-label={`${index + 1}번째 이미지로 이동`}
                                    aria-pressed={isActive}
                                >
                                    {thumbUrl ? (
                                        <Image
                                            src={thumbUrl}
                                            alt=""
                                            fill
                                            className="object-cover object-center"
                                            sizes="48px"
                                        />
                                    ) : (
                                        <div
                                            className={`absolute inset-0 ${IMAGE_PLACEHOLDER_BG}`}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {/* 진행 상태: 현재 번호(파란색) + 진행 바 + 전체 번호(회색) */}
                    <div className="flex items-center gap-3">
                        <span className="shrink-0 text-sm font-semibold text-primary1">
                            {currentIndex + 1}
                        </span>
                        <div className="min-w-0 flex-1 rounded-full bg-gray-200">
                            <div
                                className="h-1.5 rounded-full bg-primary1 transition-[width] duration-200"
                                style={{
                                    width: total > 0 ? `${((currentIndex + 1) / total) * 100}%` : '0%',
                                }}
                            />
                        </div>
                        <span className="shrink-0 text-sm text-gray-500">
                            {total}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
