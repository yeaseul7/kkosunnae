import type { Timestamp } from 'firebase/firestore';

export type CardInfoType = {
    title: string;
    category: string;
    summary: string;
    images: string[];
};

/** 카드뉴스 작성 시 미리보기용 (url: blob, file: 업로드용) */
export type DraftCardImage = {
    id: string;
    url: string;
    file?: File;
};

/** Firestore cardNews 문서 + 작성자/좋아요/댓글 수 */
export type CardNewsData = CardInfoType & {
    id: string;
    /** 작성자 uid */
    authorId: string;
    /** 좋아요 누른 사용자 uid 목록 */
    likeIds: string[];
    /** 좋아요 개수 (likeIds.length와 동기화) */
    likeCount: number;
    /** 댓글 개수 (서브컬렉션 comments 기준) */
    commentCount: number;
    createdAt: Timestamp | null;
    updatedAt: Timestamp | null;
    /** draft: 임시저장, published: 발행됨 */
    status: 'draft' | 'published';
};

/** 서버 → 클라이언트 전달용 (Timestamp를 ms로 직렬화) */
export type SerializedCardNewsData = Omit<CardNewsData, 'createdAt' | 'updatedAt'> & {
    createdAt: number | null;
    updatedAt: number | null;
};

/** 카드뉴스 댓글 (서브컬렉션 cardNews/{id}/comments) */
export type CardNewsCommentData = {
    id: string;
    authorId: string;
    authorName: string;
    authorPhotoURL: string;
    content: string;
    createdAt: Timestamp | null;
    likes?: number;
};