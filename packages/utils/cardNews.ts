/**
 * 카드뉴스 조회 유틸.
 * 실제 쿼리는 lib/api/cardNews에서 수행합니다.
 */
export {
    getCardNewsByCategory,
    getRecentCardNews,
    type GetCardNewsByCategoryOptions,
    type GetRecentCardNewsOptions,
} from '@/lib/api/cardNews';
