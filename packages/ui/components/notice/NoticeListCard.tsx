'use client';

import Link from 'next/link';
import type { NoticeListItem } from '@/packages/type/noticeType';
import { formatDate } from '@/packages/utils/dateFormatting';
import { IoIosEye } from 'react-icons/io';

interface NoticeListCardProps {
  item: NoticeListItem;
  listNumber: number;
}

export default function NoticeListCard({ item, listNumber }: NoticeListCardProps) {
  const categoryLabel = item.category ? `[${item.category}]` : '[공지]';
  const dateStr = formatDate(item.createdAt);
  const viewCountStr = (item.viewCount ?? 0).toLocaleString('ko-KR');

  return (
    <Link
      href={`/notice/read/${item.id}`}
      className="flex items-center gap-2 rounded-3xl border border-gray-200 bg-white p-3 shadow-xs transition-shadow hover:shadow-md sm:gap-4 sm:p-4"
      aria-label={`${item.title} 공지 보기`}
    >
      <span className="text-xs font-medium text-gray-400 sm:text-sm md:text-base" aria-hidden>
        {listNumber}
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex flex-wrap items-center gap-1.5 sm:mb-1 sm:gap-2">
          <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-primary1 sm:text-xs md:text-sm">
            {categoryLabel}
          </span>
          <h2 className="truncate text-sm font-bold text-gray-900 sm:text-base md:text-lg">
            {item.title || '제목 없음'}
          </h2>
        </div>
        <p className="flex items-center gap-1 text-[10px] text-gray-500 sm:gap-1.5 sm:text-xs md:text-sm">
          <span>운영진</span>
          <span className="text-gray-400" aria-hidden>·</span>
          <time dateTime={item.createdAt.toDate().toISOString()}>{dateStr}</time>
          <span className="text-gray-400" aria-hidden>·</span>
          <span className="flex items-center gap-0.5">
            <IoIosEye className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
            {viewCountStr}
          </span>
        </p>
      </div>
      <span className="shrink-0 text-gray-400" aria-hidden>
        <svg className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
