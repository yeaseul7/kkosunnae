'use client';

import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase/firebase';
import type { NoticeListItem } from '@/packages/type/noticeType';

const NOTICE_COLLECTION = 'notice';
const VIEW_SUBCOLLECTION = 'view';
const DEFAULT_PAGE_SIZE = 10;
const MAX_FETCH = 200;

function toListItem(
  id: string,
  data: {
    title?: string;
    createdAt?: Timestamp;
    category?: string;
    authorName?: string;
    authorId?: string;
  }
): NoticeListItem {
  const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now();
  return {
    id,
    title: data.title ?? '',
    createdAt,
    category: data.category ?? '공지',
    authorName: data.authorName ?? '운영진',
  };
}

export function useNoticeList(options?: {
  searchQuery?: string;
  pageSize?: number;
}) {
  const searchQuery = (options?.searchQuery ?? '').trim().toLowerCase();
  const pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE;

  const [list, setList] = useState<NoticeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(
        collection(firestore, NOTICE_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(MAX_FETCH)
      );
      const snapshot = await getDocs(q);
      const baseItems = snapshot.docs.map((d) =>
        toListItem(d.id, d.data())
      );
      const counts = await Promise.all(
        snapshot.docs.map((d) =>
          getCountFromServer(
            collection(firestore, NOTICE_COLLECTION, d.id, VIEW_SUBCOLLECTION)
          )
        )
      );
      const items: NoticeListItem[] = baseItems.map((item, i) => ({
        ...item,
        viewCount: counts[i].data().count,
      }));
      setList(items);
    } catch (e) {
      console.error('공지 목록 조회 실패:', e);
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const filtered = searchQuery
    ? list.filter((item) => item.title.toLowerCase().includes(searchQuery))
    : list;
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const notices = filtered.slice(start, start + pageSize);
  const listNumberStart = totalCount - start;

  const goToPage = useCallback((p: number) => {
    setPage((prev) => Math.max(1, p));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return {
    notices,
    loading,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    listNumberStart,
    goToPage,
    refetch: fetchNotices,
  };
}
