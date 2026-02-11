import {
    collection,
    doc,
    addDoc,
    getDoc,
    updateDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import type { CardInfoType, CardNewsData, CardNewsCommentData } from '@/packages/type/cardNewsType';

const CARD_NEWS_COLLECTION = 'cardNews';

/** 저장용 페이로드 (이미지는 URL 배열, 작성자/좋아요/댓글은 서버에서 다룸) */
export type CreateCardNewsPayload = CardInfoType & {
    authorId: string;
    status: 'draft' | 'published';
};

export type UpdateCardNewsPayload = Partial<CardInfoType> & {
    status?: 'draft' | 'published';
    updatedAt?: ReturnType<typeof serverTimestamp>;
};

function toCardNewsData(id: string, data: Record<string, unknown>): CardNewsData {
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : null;
    const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt : null;
    const likeIds = Array.isArray(data.likeIds) ? (data.likeIds as string[]) : [];
    return {
        id,
        title: (data.title as string) ?? '',
        category: (data.category as string) ?? '',
        summary: (data.summary as string) ?? '',
        images: Array.isArray(data.images) ? (data.images as string[]) : [],
        authorId: (data.authorId as string) ?? '',
        likeIds,
        likeCount: typeof data.likeCount === 'number' ? data.likeCount : likeIds.length,
        commentCount: typeof data.commentCount === 'number' ? data.commentCount : 0,
        createdAt,
        updatedAt,
        status: data.status === 'published' ? 'published' : 'draft',
    };
}

/**
 * 카드뉴스 문서 생성. 이미지는 빈 배열로 생성 후, 이미지 업로드 완료 시 updateCardNews로 images 반영.
 * @returns 생성된 문서 id (Cloudinary 폴더명 kkosunnae_cardNews/{id} 에 사용)
 */
export async function createCardNews(payload: CreateCardNewsPayload): Promise<string> {
    const col = collection(firestore, CARD_NEWS_COLLECTION);
    const ref = await addDoc(col, {
        title: payload.title,
        category: payload.category,
        summary: payload.summary,
        images: payload.images ?? [],
        authorId: payload.authorId,
        likeIds: [],
        likeCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: payload.status ?? 'draft',
    });
    return ref.id;
}

/**
 * 카드뉴스 문서 수정 (이미지 URL 반영, 제목/요약/상태 등)
 */
export async function updateCardNews(
    id: string,
    payload: UpdateCardNewsPayload
): Promise<void> {
    const ref = doc(firestore, CARD_NEWS_COLLECTION, id);
    const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (payload.title !== undefined) updates.title = payload.title;
    if (payload.category !== undefined) updates.category = payload.category;
    if (payload.summary !== undefined) updates.summary = payload.summary;
    if (payload.images !== undefined) updates.images = payload.images;
    if (payload.status !== undefined) updates.status = payload.status;
    await updateDoc(ref, updates);
}

/**
 * 카드뉴스 단건 조회
 */
export async function getCardNews(id: string): Promise<CardNewsData | null> {
    const ref = doc(firestore, CARD_NEWS_COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return toCardNewsData(snap.id, snap.data() as Record<string, unknown>);
}

/** 카테고리별 조회 옵션 */
export type GetCardNewsByCategoryOptions = {
    /** 최대 개수 (기본 10) */
    limitCount?: number;
};

/** 최근 카드뉴스 조회 옵션 */
export type GetRecentCardNewsOptions = {
    /** 최대 개수 (기본 4) */
    limitCount?: number;
};

/**
 * 최근 발행 카드뉴스 목록 조회 (전체 카테고리, 최신순).
 * Firestore 복합 인덱스: cardNews (status, createdAt desc)
 */
export async function getRecentCardNews(
    options?: GetRecentCardNewsOptions
): Promise<CardNewsData[]> {
    const limitCount = options?.limitCount ?? 4;
    const col = collection(firestore, CARD_NEWS_COLLECTION);
    const q = query(
        col,
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) =>
        toCardNewsData(d.id, d.data() as Record<string, unknown>)
    );
}

/**
 * 카테고리별 카드뉴스 목록 조회 (발행된 것만, 최신순).
 * Firestore 복합 인덱스: cardNews 컬렉션 (category, status, createdAt desc)
 */
export async function getCardNewsByCategory(
    category: string,
    options?: GetCardNewsByCategoryOptions
): Promise<CardNewsData[]> {
    const limitCount = options?.limitCount ?? 10;
    const col = collection(firestore, CARD_NEWS_COLLECTION);
    const q = query(
        col,
        where('category', '==', category),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) =>
        toCardNewsData(d.id, d.data() as Record<string, unknown>)
    );
}

/**
 * 작성자별 카드뉴스 목록 조회 (발행된 것만, 최신순).
 * Firestore 복합 인덱스: cardNews (authorId, status, createdAt desc)
 */
export async function getCardNewsByAuthorId(
    authorId: string,
    options?: { limitCount?: number }
): Promise<CardNewsData[]> {
    const limitCount = options?.limitCount ?? 20;
    const col = collection(firestore, CARD_NEWS_COLLECTION);
    const q = query(
        col,
        where('authorId', '==', authorId),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) =>
        toCardNewsData(d.id, d.data() as Record<string, unknown>)
    );
}

/**
 * 카드뉴스 댓글 목록 조회 (서브컬렉션 cardNews/{id}/comments)
 */
export async function getCardNewsComments(cardNewsId: string): Promise<CardNewsCommentData[]> {
    const col = collection(firestore, CARD_NEWS_COLLECTION, cardNewsId, 'comments');
    const snapshot = await getDocs(col);
    return snapshot.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : null;
        return {
            id: d.id,
            authorId: (data.authorId as string) ?? '',
            authorName: (data.authorName as string) ?? '',
            authorPhotoURL: (data.authorPhotoURL as string) ?? '',
            content: (data.content as string) ?? '',
            createdAt,
            likes: typeof data.likes === 'number' ? data.likes : 0,
        };
    });
}
