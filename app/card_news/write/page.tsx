'use client';

import ContentsInfo from '@/packages/ui/components/cardNews/write/ContentsInfo';
import ContentImg from '@/packages/ui/components/cardNews/write/ContentImg';
import WriteHeader from '@/packages/ui/components/cardNews/write/WriteHeader';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CardInfoType, DraftCardImage } from '@/packages/type/cardNewsType';
import { uploadCardImages } from '@/packages/utils/cloudinary';
import { createCardNews, updateCardNews } from '@/lib/api/cardNews';
import { useAuth } from '@/lib/firebase/auth';
import { useFullAdmin } from '@/hooks/useFullAdmin';

const PageTemplate = dynamic(
    () => import('@/packages/ui/components/base/PageTemplate'),
    { ssr: true }
);

const PageFooter = dynamic(
    () => import('@/packages/ui/components/base/PageFooter'),
    { ssr: true }
);

export default function CardNewsWritePage() {
    const { user } = useAuth();
    const router = useRouter();
    const { fullAdmin: isFullAdmin, loading: fullAdminLoading } = useFullAdmin();

    useEffect(() => {
        if (fullAdminLoading) return;
        if (!user || !isFullAdmin) router.replace('/card_news');
    }, [fullAdminLoading, isFullAdmin, user, router]);
    const [cardInfo, setCardInfo] = useState<CardInfoType>({
        title: '',
        category: '',
        summary: '',
        images: [],
    });
    const [draftImages, setDraftImages] = useState<DraftCardImage[]>([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [cardNewsId, setCardNewsId] = useState<string | null>(null);

    const handlePublish = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }
        const files = draftImages.map((img) => img.file).filter((f): f is File => !!f);
        if (!files.length) {
            alert('이미지를 1장 이상 추가해 주세요.');
            return;
        }
        setIsPublishing(true);
        try {
            let id = cardNewsId;
            if (!id) {
                id = await createCardNews({
                    ...cardInfo,
                    images: [],
                    authorId: user.uid,
                    status: 'draft',
                });
                setCardNewsId(id);
            }
            const folder = `kkosunnae_cardNews/${id}`;
            const urls = await uploadCardImages(files, folder);
            setCardInfo((prev) => ({ ...prev, images: urls }));
            await updateCardNews(id, {
                title: cardInfo.title,
                category: cardInfo.category,
                summary: cardInfo.summary,
                images: urls,
                status: 'published',
            });
            router.push(`/card_news/${id}`);
        } catch (e) {
            console.error('발행 실패:', e);
            alert(e instanceof Error ? e.message : '발행에 실패했습니다.');
        } finally {
            setIsPublishing(false);
        }
    };

    if (fullAdminLoading || !user || !isFullAdmin) {
        return (
            <main className="page-container-full flex min-h-screen items-center justify-center">
                <p className="text-sm text-gray-500">권한을 확인하고 있습니다...</p>
            </main>
        );
    }

    return (
        <main className="page-container-full">
            {isPublishing && (
                <div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/40"
                    aria-live="polite"
                    aria-busy="true"
                >
                    <div
                        className="h-12 w-12 rounded-full border-4 border-white border-t-transparent animate-spin"
                        aria-hidden
                    />
                    <p className="text-sm font-medium text-white">발행 중입니다…</p>
                </div>
            )}
            <PageTemplate visibleHomeTab={false}>
                <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-6">
                    <WriteHeader />
                    <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
                        <div className="w-full shrink-0 lg:w-[40%]">
                            <ContentsInfo cardInfo={cardInfo} setCardInfo={setCardInfo} />
                            <div className="hidden pt-2 sm:pt-3 lg:block">
                                <button
                                    type="button"
                                    onClick={handlePublish}
                                    disabled={isPublishing}
                                    className="w-full rounded-xl bg-primary1 py-3 text-sm font-medium text-white transition-colors hover:bg-primary2 disabled:opacity-50"
                                >
                                    발행하기
                                </button>
                            </div>
                        </div>

                        <div className="min-w-0 flex-1">
                            <ContentImg images={draftImages} onChange={setDraftImages} />
                        </div>
                    </div>
                    <div className="mt-6 lg:hidden">
                        <button
                            type="button"
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="w-full rounded-xl bg-primary1 py-3 text-sm font-medium text-white transition-colors hover:bg-primary2 disabled:opacity-50"
                        >
                            발행하기
                        </button>
                    </div>
                </div>
            </PageTemplate>
            <PageFooter />
        </main>
    );
}
