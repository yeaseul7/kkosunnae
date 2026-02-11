'use client';

import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';
import { useState } from 'react';
import { useFullAdmin } from '@/hooks/useFullAdmin';

const SORT_OPTIONS = [
    { id: 'latest', label: '최신순' },
    { id: 'popular', label: '인기순' },
    { id: 'views', label: '조회순' },
] as const;

const FILTER_OPTIONS = [
    { id: 'all', label: '전체' },
    { id: 'adoption', label: '#입양·봉사' },
    { id: 'training', label: '#훈련·교육' },
    { id: 'health', label: '#건강·일상' },
] as const;

const SORT_IDS = ['latest', 'popular', 'views'] as const;

export default function CardNewsHeader() {
    const { fullAdmin } = useFullAdmin();
    const [sortOrder, setSortOrder] = useState<string>('latest');
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const sortIndex = SORT_IDS.indexOf(sortOrder as (typeof SORT_IDS)[number]);

    return (
        <header className="w-full pt-0 pb-1">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-3xl tracking-tight">
                    카드뉴스 라이브러리
                </h1>
                <div className="mt-1.5 flex flex-col gap-2 sm:mt-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3 md:mt-3">
                    <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                        <p className="text-xs text-gray-600 sm:text-sm md:text-base">
                            우리 아이들과 더 행복해지는 법, 쉽고 재미있게 배워보세요.
                        </p>
                    </div>
                    {fullAdmin && (
                        <Link
                            href="/card_news/write"
                            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary1 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary2 transition-colors"
                        >
                            <HiPlus className="w-4 h-4 shrink-0" />
                            카드뉴스 등록하기
                        </Link>
                    )}
                </div>

                {/* 정렬 / 필터 바 */}
                <div className="mt-3 rounded-2xl border border-gray-200 bg-white px-3 py-2.5 sm:px-4 sm:py-2.5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative inline-flex w-full max-w-[240px] rounded-full bg-gray-100 p-1">
                            {/* 슬라이딩 흰색 pill 배경 */}
                            <div
                                className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm transition-[transform] duration-200 ease-out"
                                style={{
                                    left: 4,
                                    width: 'calc((100% - 8px) / 3)',
                                    transform: `translateX(calc(100% * ${sortIndex >= 0 ? sortIndex : 0}))`,
                                }}
                                aria-hidden
                            />
                            {SORT_OPTIONS.map(({ id, label }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setSortOrder(id)}
                                    className={`relative z-10 flex-1 min-w-0 rounded-full py-1.5 text-sm font-medium transition-colors ${sortOrder === id
                                        ? 'text-primary1'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {FILTER_OPTIONS.map(({ id, label }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setSelectedFilter(id)}
                                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${selectedFilter === id
                                        ? 'border-2 border-primary1 text-primary1'
                                        : 'border border-gray-200 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}