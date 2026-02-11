import type { Metadata } from 'next';
import { getCardNews } from '@/lib/api/cardNews';
import type { SerializedCardNewsData } from '@/packages/type/cardNewsType';
import { getBaseUrl, generateMetadata as generateMetadataUtil, generateDefaultMetadata } from '@/packages/utils/metadata';
import CardNewsDetailClient from './CardNewsDetailClient';

/** Firestore Timestamp를 클라이언트 전달용으로 직렬화 (toJSON 불가 객체 제거) */
function serializeCardNewsData(
    data: Awaited<ReturnType<typeof getCardNews>>
): SerializedCardNewsData | null {
    if (!data) return null;
    return {
        ...data,
        createdAt: data.createdAt?.toMillis?.() ?? null,
        updatedAt: data.updatedAt?.toMillis?.() ?? null,
    };
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/card_news/${id}`;

    try {
        const data = await getCardNews(id);
        if (data) {
            const title = data.title || '카드뉴스';
            const description = data.summary || '꼬순내 카드뉴스';
            const imageUrl = data.images?.[0] ?? null;

            return generateMetadataUtil({
                title,
                description,
                imageUrl,
                url,
                type: 'article',
                imageAlt: title,
            });
        }
    } catch (error) {
        console.error('카드뉴스 메타데이터 생성 중 오류:', error);
    }

    return generateDefaultMetadata('카드뉴스 | 꼬순내', '꼬순내 카드뉴스', url, {
        type: 'article',
    });
}

export default async function CardNewsDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const raw = await getCardNews(id);
    const initialData = serializeCardNewsData(raw);

    return <CardNewsDetailClient initialData={initialData} />;
}
