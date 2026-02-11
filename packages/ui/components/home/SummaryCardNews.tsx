'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRecentCardNews } from '@/packages/utils/cardNews';
import type { CardNewsData } from '@/packages/type/cardNewsType';
import CardNewsCard from '@/packages/ui/components/cardNews/CardNewsCard';

const SECTION_TITLE = '카드뉴스';
const LIST_LIMIT = 4;

export default function SummaryCardNews() {
    const [list, setList] = useState<CardNewsData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getRecentCardNews({ limitCount: LIST_LIMIT })
            .then((data) => {
                if (!cancelled) setList(data);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    return (
        <section className="w-full">
            <div className="flex items-end justify-between gap-2">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <span className="h-5 w-0.5 shrink-0 rounded-full bg-primary1" aria-hidden />
                    {SECTION_TITLE}
                </h2>
                <Link
                    href="/card_news"
                    className="shrink-0 text-sm font-medium text-primary1 hover:underline"
                >
                    전체보기 &gt;
                </Link>
            </div>
            {loading ? (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
                    {Array.from({ length: LIST_LIMIT }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-[3/4] animate-pulse rounded-xl bg-gray-200"
                        />
                    ))}
                </div>
            ) : list.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500">등록된 카드뉴스가 없습니다.</p>
            ) : (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
                    {list.map((item) => (
                        <CardNewsCard key={item.id} data={item} />
                    ))}
                </div>
            )}
        </section>
    );
}
