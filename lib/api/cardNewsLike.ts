import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc,
    serverTimestamp,
    increment,
} from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

const CARD_NEWS_COLLECTION = 'cardNews';
const LIKED_SUBCOLLECTION = 'liked';

/**
 * 좋아요 추가: cardNews/{cardNewsId}/liked/{userId} 문서 생성 + likeCount +1
 */
export async function likeCardNews(cardNewsId: string, userId: string): Promise<void> {
    const likedRef = doc(firestore, CARD_NEWS_COLLECTION, cardNewsId, LIKED_SUBCOLLECTION, userId);
    const cardNewsRef = doc(firestore, CARD_NEWS_COLLECTION, cardNewsId);

    await setDoc(likedRef, {
        userId,
        likedAt: serverTimestamp(),
    });
    await updateDoc(cardNewsRef, {
        likeCount: increment(1),
    });
}

/**
 * 좋아요 취소: cardNews/{cardNewsId}/liked/{userId} 문서 삭제 + likeCount -1
 */
export async function unlikeCardNews(cardNewsId: string, userId: string): Promise<void> {
    const likedRef = doc(firestore, CARD_NEWS_COLLECTION, cardNewsId, LIKED_SUBCOLLECTION, userId);
    const cardNewsRef = doc(firestore, CARD_NEWS_COLLECTION, cardNewsId);

    await deleteDoc(likedRef);
    await updateDoc(cardNewsRef, {
        likeCount: increment(-1),
    });
}

/**
 * 해당 카드뉴스에 현재 사용자가 좋아요 눌렀는지 여부
 */
export async function isCardNewsLiked(
    cardNewsId: string,
    userId: string
): Promise<boolean> {
    const likedRef = doc(firestore, CARD_NEWS_COLLECTION, cardNewsId, LIKED_SUBCOLLECTION, userId);
    const snap = await getDoc(likedRef);
    return snap.exists();
}
