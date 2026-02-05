'use client';

import { useEffect, useRef, useState } from 'react';
import BannerImage from './BannerImage';

const AUTO_SCROLL_INTERVAL_MS = 5000;

export default function Banner() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const intervalId = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = prev + 1 >= 2 ? 0 : prev + 1;
                const container = scrollRef.current;
                if (container) {
                    const width = container.clientWidth;
                    container.scrollTo({ left: width * next, behavior: 'smooth' });
                }
                return next;
            });
        }, AUTO_SCROLL_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, []);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const width = el.clientWidth;
        const index = Math.round(el.scrollLeft / width);
        setCurrentIndex(Math.min(index, 1));
    };

    const goToSlide = (index: number) => {
        const el = scrollRef.current;
        if (!el) return;
        const width = el.clientWidth;
        el.scrollTo({ left: width * index, behavior: 'smooth' });
        setCurrentIndex(index);
    };

    const goPrev = () => {
        const prev = currentIndex <= 0 ? 1 : currentIndex - 1;
        goToSlide(prev);
    };

    const goNext = () => {
        const next = currentIndex >= 1 ? 0 : currentIndex + 1;
        goToSlide(next);
    };

    const TOTAL_SLIDES = 2;

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
                        <BannerImage imageUrl={'/static/images/banner1.jpg'} link={'/animalShelter'} title={'보호소 정보 확인하기'} />
                    </div>
                    <div className="min-w-full w-full shrink-0 snap-center snap-always flex-[0_0_100%]">
                        <BannerImage imageUrl={'/static/images/banner2.jpeg'} link={'/notice'} title={'공지사항 보기'} />
                    </div>
                </div>

                {/* 좌우 화살표 - 콘텐츠와 겹치지 않도록 여백 확보 */}
                <button
                    type="button"
                    onClick={goPrev}
                    aria-label="이전 배너"
                    className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md transition-colors hover:bg-white hover:text-primary1 focus:outline-none focus:ring-2 focus:ring-primary1/50 sm:left-4 sm:h-10 sm:w-10 md:left-5 md:h-11 md:w-11"
                >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={goNext}
                    aria-label="다음 배너"
                    className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md transition-colors hover:bg-white hover:text-primary1 focus:outline-none focus:ring-2 focus:ring-primary1/50 sm:right-4 sm:h-10 sm:w-10 md:right-5 md:h-11 md:w-11"
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
