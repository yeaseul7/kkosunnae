import { collection, getDocs, orderBy, query, doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

const USERS_COLLECTION = 'users';
const CARDNEWS_SUBCOLLECTION = 'cardnews';

export type ScrapedCardNewsItem = {
    cardNewsId: string;
    scrapedAt: ReturnType<typeof serverTimestamp> | null;
};

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
 * 사용자가 스크랩한 카드뉴스 ID 목록 조회 (users/{userId}/cardnews, scrapedAt 최신순)
 */
export async function getScrapedCardNewsIds(userId: string): Promise<ScrapedCardNewsItem[]> {
    const col = collection(firestore, USERS_COLLECTION, userId, CARDNEWS_SUBCOLLECTION);
    const q = query(col, orderBy('scrapedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
        const data = d.data();
        return {
            cardNewsId: (data.cardNewsId as string) ?? d.id,
            scrapedAt: data.scrapedAt ?? null,
        };
    });
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
