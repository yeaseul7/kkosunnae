import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

const USERS_COLLECTION = 'users';
const CARDNEWS_SUBCOLLECTION = 'cardnews';

/**
 * 카드뉴스 스크랩 추가: users/{userId}/cardnews/{cardNewsId} 문서 생성
 */
export async function scrapCardNews(userId: string, cardNewsId: string): Promise<void> {
    const ref = doc(firestore, USERS_COLLECTION, userId, CARDNEWS_SUBCOLLECTION, cardNewsId);
    await setDoc(ref, {
        cardNewsId,
        scrapedAt: serverTimestamp(),
    });
}

/**
 * 카드뉴스 스크랩 해제: users/{userId}/cardnews/{cardNewsId} 문서 삭제
 */
export async function unscrapCardNews(userId: string, cardNewsId: string): Promise<void> {
    const ref = doc(firestore, USERS_COLLECTION, userId, CARDNEWS_SUBCOLLECTION, cardNewsId);
    await deleteDoc(ref);
}

/**
 * 해당 카드뉴스를 현재 사용자가 스크랩했는지 여부
 */
export async function isCardNewsScraped(
    userId: string,
    cardNewsId: string
): Promise<boolean> {
    const ref = doc(firestore, USERS_COLLECTION, userId, CARDNEWS_SUBCOLLECTION, cardNewsId);
    const snap = await getDoc(ref);
    return snap.exists();
}
