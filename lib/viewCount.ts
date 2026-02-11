/**
 * 조회수 로직 공통 유틸 (공지, 카드뉴스 등)
 * Firestore 구조: {collection}/{documentId}/view/{viewerId}
 */

/** IP를 SHA-256 해시한 뒤 앞 32자리 hex 문자열로 반환 (view 문서 ID용, 중복 조회 방지) */
export async function hashIpForViewId(ip: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(ip);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

export const VIEW_SUBCOLLECTION = 'view' as const;
export const VIEW_COUNT_DELAY_MS = 5000;
