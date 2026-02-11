'use client';

import { getCardNews } from '@/lib/api/cardNews';
import { getScrapedCardNewsIds } from '@/lib/api/cardNewsScrap';
import { useEffect, useState } from 'react';
import type { CardNewsData } from '@/packages/type/cardNewsType';
import CardNewsCard from '../../cardNews/CardNewsCard';
import Loading from '../../base/Loading';

export default function UserCardNewsList({ userId }: { userId: string }) {
  const [list, setList] = useState<CardNewsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScrapedCardNews = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const scrapedItems = await getScrapedCardNewsIds(userId);
        const cards = await Promise.all(
          scrapedItems.map((item) => getCardNews(item.cardNewsId))
        );
        const validCards = cards.filter(
          (c): c is CardNewsData => c != null && c.status === 'published'
        );
        setList(validCards);
      } catch (error) {
        console.error('스크랩한 카드뉴스 조회 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScrapedCardNews();
  }, [userId]);

  if (loading) return <Loading />;

  if (list.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        스크랩한 카드뉴스가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 pt-6 w-full sm:grid-cols-2 md:grid-cols-3">
      {list.map((data) => (
        <CardNewsCard key={data.id} data={data} />
      ))}
    </div>
  );
}
