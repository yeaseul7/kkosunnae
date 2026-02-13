'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import BannerImage from './BannerImage';

const AUTO_SCROLL_INTERVAL_MS = 5000;
const SCROLL_SYNC_THROTTLE_MS = 120;

export default function Banner() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const programmaticScrollRef = useRef(false);
    const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const intervalId = setInterval(() => {
            programmaticScrollRef.current = true;
            setCurrentIndex((prev) => {
                const next = prev + 1 >= 3 ? 0 : prev + 1;
                const container = scrollRef.current;
                if (container) {
                    const width = container.clientWidth;
                    container.scrollTo({ left: width * next, behavior: 'smooth' });
                }
                return next;
            });
            setTimeout(() => {
                programmaticScrollRef.current = false;
            }, 600);
        }, AUTO_SCROLL_INTERVAL_MS);

        return () => {
            clearInterval(intervalId);
            if (throttleRef.current) clearTimeout(throttleRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const syncIndexFromScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el || programmaticScrollRef.current) return;
        const width = el.clientWidth;
        const index = Math.round(el.scrollLeft / width);
        setCurrentIndex(Math.min(index, 2));
    }, []);

    const handleScroll = useCallback(() => {
        if (programmaticScrollRef.current) return;
        if (throttleRef.current) return;
        throttleRef.current = setTimeout(() => {
            throttleRef.current = null;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                syncIndexFromScroll();
            });
        }, SCROLL_SYNC_THROTTLE_MS);
    }, [syncIndexFromScroll]);

    const goToSlide = useCallback((index: number) => {
        const el = scrollRef.current;
        if (!el) return;
        programmaticScrollRef.current = true;
        const width = el.clientWidth;
        el.scrollTo({ left: width * index, behavior: 'smooth' });
        setCurrentIndex(index);
        setTimeout(() => {
            programmaticScrollRef.current = false;
        }, 500);
    }, []);

    const goPrev = () => {
        const prev = currentIndex <= 0 ? 2 : currentIndex - 1;
        goToSlide(prev);
    };

    const goNext = () => {
        const next = currentIndex >= 2 ? 0 : currentIndex + 1;
        goToSlide(next);
    };

    const TOTAL_SLIDES = 3;

    return (
        <div className="mt-4 w-full max-w-7xl px-4 sm:px-6" aria-label="배너 캐러셀">
            <div className="relative w-full overflow-hidden rounded-2xl">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-2xl scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    <div className="min-w-full w-full shrink-0 snap-center snap-always flex-[0_0_100%]">
                        <BannerImage imageUrl={'/static/images/banner1.png'} link={'/animalShelter'} title={'보호소 정보 확인하기'} priority={true} />
                    </div>
                    <div className="min-w-full w-full shrink-0 snap-center snap-always flex-[0_0_100%]">
                        <BannerImage imageUrl={'/static/images/banner2.png'} link={'/notice'} title={'공지사항 보기'} />
                    </div>
                    <div className="min-w-full w-full shrink-0 snap-center snap-always flex-[0_0_100%]">
                        <BannerImage imageUrl={'/static/images/banner3.jpeg'} link={'/search-animal'} title={'기능 사용해보기'} />
                    </div>
                </div>

                {/* 좌우 화살표 - 콘텐츠와 겹치지 않도록 여백 확보 */}
                <button
                    type="button"
                    onClick={goPrev}
                    aria-label="이전 배너"
                    className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md transition-all duration-200 hover:scale-110 hover:bg-primary1 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary1/50 sm:left-4 sm:h-10 sm:w-10 md:left-5 md:h-11 md:w-11"
                >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={goNext}
                    aria-label="다음 배너"
                    className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md transition-all duration-200 hover:scale-110 hover:bg-primary1 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary1/50 sm:right-4 sm:h-10 sm:w-10 md:right-5 md:h-11 md:w-11"
                >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            {/* 인디케이터 */}
            <div className="mt-3 flex justify-center gap-2" role="tablist" aria-label="배너 슬라이드">
                {Array.from({ length: TOTAL_SLIDES }, (_, index) => (
                    <button
                        key={index}
                        type="button"
                        role="tab"
                        aria-selected={currentIndex === index}
                        aria-label={`배너 ${index + 1}로 이동`}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${currentIndex === index
                            ? 'w-6 bg-primary1'
                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
