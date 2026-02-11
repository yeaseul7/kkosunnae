'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';
import dynamic from 'next/dynamic';
import { getCardNews } from '@/lib/api/cardNews';
import {
    scrapCardNews,
    unscrapCardNews,
    isCardNewsScraped,
} from '@/lib/api/cardNewsScrap';
import {
    likeCardNews,
    unlikeCardNews,
    isCardNewsLiked,
} from '@/lib/api/cardNewsLike';
import { useAuth } from '@/lib/firebase/auth';
import { useViewCount } from '@/hooks/useViewCount';
import type { CardNewsData, SerializedCardNewsData } from '@/packages/type/cardNewsType';
import CardNews from '@/packages/ui/components/cardNews/read/CardNews';
import CarNewsInfo from '@/packages/ui/components/cardNews/read/CarNewsInfo';

const CARD_NEWS_COLLECTION = 'cardNews';

const PageTemplate = dynamic(
    () => import('@/packages/ui/components/base/PageTemplate'),
    { ssr: true }
);

const PageFooter = dynamic(
    () => import('@/packages/ui/components/base/PageFooter'),
    { ssr: true }
);

type CardNewsDetailClientProps = {
    /** 서버에서 미리 조회한 데이터 (Timestamp는 ms로 직렬화됨) */
    initialData?: SerializedCardNewsData | null;
};

export default function CardNewsDetailClient({
    initialData,
}: CardNewsDetailClientProps) {
    const { user } = useAuth();
    const params = useParams();
    const id = typeof params?.id === 'string' ? params.id : undefined;
    const [data, setData] = useState<CardNewsData | SerializedCardNewsData | null>(
        initialData ?? null
    );
    const [loading, setLoading] = useState(!initialData && !!id);
    const [notFound, setNotFound] = useState(!initialData && !!id ? false : !initialData);
    const [isLiked, setIsLiked] = useState(false);
    const [isHelpfulLoading, setIsHelpfulLoading] = useState(false);
    const [isScraped, setIsScraped] = useState(false);
    const [isScrapLoading, setIsScrapLoading] = useState(false);
    const { viewCount } = useViewCount(CARD_NEWS_COLLECTION, id, { enabled: !!data });

    useEffect(() => {
        if (!id) {
            const t = setTimeout(() => {
                setLoading(false);
                setNotFound(true);
            }, 0);
            return () => clearTimeout(t);
        }
        if (initialData && initialData.id === id) {
            setLoading(false);
            setNotFound(false);
            return;
        }
        let cancelled = false;
        queueMicrotask(() => {
            if (!cancelled) {
                setLoading(true);
                setNotFound(false);
            }
        });
        getCardNews(id)
            .then((docSnap) => {
                if (cancelled) return;
                if (docSnap) {
                    setData(docSnap);
                    setNotFound(false);
                } else {
                    setData(null);
                    setNotFound(true);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setData(null);
                    setNotFound(true);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [id, initialData]);

    // 로그인한 사용자의 스크랩 여부 조회
    useEffect(() => {
        if (!user?.uid || !id) {
            setIsScraped(false);
            return;
        }
        let cancelled = false;
        isCardNewsScraped(user.uid, id)
            .then((scraped) => {
                if (!cancelled) setIsScraped(scraped);
            })
            .catch(() => {
                if (!cancelled) setIsScraped(false);
            });
        return () => { cancelled = true; };
    }, [user?.uid, id]);

    // 로그인한 사용자의 좋아요 여부 조회
    useEffect(() => {
        if (!user?.uid || !id) {
            setIsLiked(false);
            return;
        }
        let cancelled = false;
        isCardNewsLiked(id, user.uid)
            .then((liked) => {
                if (!cancelled) setIsLiked(liked);
            })
            .catch(() => {
                if (!cancelled) setIsLiked(false);
            });
        return () => { cancelled = true; };
    }, [user?.uid, id]);

    const handleHelpful = useCallback(async () => {
        if (!user?.uid || !id) {
            alert('로그인 후 좋아요를 누를 수 있습니다.');
            return;
        }
        const willLike = !isLiked;
        setIsHelpfulLoading(true);
        try {
            if (willLike) {
                await likeCardNews(id, user.uid);
                setIsLiked(true);
                setData((prev) =>
                    prev
                        ? { ...prev, likeCount: Math.max(0, (prev.likeCount ?? 0) + 1) }
                        : null
                );
            } else {
                await unlikeCardNews(id, user.uid);
                setIsLiked(false);
                setData((prev) =>
                    prev
                        ? { ...prev, likeCount: Math.max(0, (prev.likeCount ?? 0) - 1) }
                        : null
                );
            }
        } catch (e) {
            console.error('좋아요 처리 실패:', e);
            alert(e instanceof Error ? e.message : '처리에 실패했습니다.');
        } finally {
            setIsHelpfulLoading(false);
        }
    }, [user?.uid, id, isLiked]);

    const handleScrap = useCallback(async () => {
        if (!user?.uid || !id) {
            alert('로그인 후 스크랩할 수 있습니다.');
            return;
        }
        setIsScrapLoading(true);
        try {
            if (isScraped) {
                await unscrapCardNews(user.uid, id);
                setIsScraped(false);
            } else {
                await scrapCardNews(user.uid, id);
                setIsScraped(true);
            }
        } catch (e) {
            console.error('스크랩 처리 실패:', e);
            alert(e instanceof Error ? e.message : '스크랩 처리에 실패했습니다.');
        } finally {
            setIsScrapLoading(false);
        }
    }, [user?.uid, id, isScraped]);

    if (loading) {
        return (
            <main className="page-container-full">
                <PageTemplate visibleHomeTab={false}>
                    <div className="mx-auto w-full max-w-2xl px-4 py-8">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 w-48 rounded bg-gray-200" />
                            <div className="h-4 w-full rounded bg-gray-100" />
                            <div className="aspect-[3/4] w-full rounded-xl bg-gray-100" />
                        </div>
                    </div>
                </PageTemplate>
                <PageFooter />
            </main>
        );
    }

    if (notFound || !data) {
        return (
            <main className="page-container-full">
                <PageTemplate visibleHomeTab={false}>
                    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
                        <p className="text-gray-600">카드뉴스를 찾을 수 없습니다.</p>
                        <Link
                            href="/card_news"
                            className="mt-4 text-sm font-medium text-primary1 hover:underline"
                        >
                            목록으로
                        </Link>
                    </div>
                </PageTemplate>
                <PageFooter />
            </main>
        );
    }

    return (
        <main className="page-container-full">
            <PageTemplate visibleHomeTab={false}>
                <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-8">
                    <Link
                        href="/card_news"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        <HiArrowLeft className="h-4 w-4" />
                        목록으로
                    </Link>

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                        <div className="min-w-0 flex-1 lg:max-w-xl">
                            {data.images && data.images.length > 0 ? (
                                <CardNews images={data.images} />
                            ) : (
                                <div className="aspect-[3/4] w-full rounded-2xl bg-[#e8ead9] flex items-center justify-center text-gray-500 text-sm">
                                    이미지 없음
                                </div>
                            )}
                        </div>

                        <div className="w-full shrink-0 lg:w-80">
                            <CarNewsInfo
                                data={data}
                                viewCount={viewCount}
                                onHelpful={handleHelpful}
                                isLiked={isLiked}
                                isHelpfulLoading={isHelpfulLoading}
                                onScrap={handleScrap}
                                isScraped={isScraped}
                                isScrapLoading={isScrapLoading}
                                onShare={() => { }}
                                isLoggedIn={!!user}
                            />
                        </div>
                    </div>
                </div>
            </PageTemplate>
            <PageFooter />
        </main>
    );
}
