'use client';

import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useFullAdmin } from '@/hooks/useFullAdmin';
import { useViewCount } from '@/hooks/useViewCount';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import Link from 'next/link';
import { firestore } from '@/lib/firebase/firebase';
import { formatDateMeta } from '@/packages/utils/dateFormatting';
import { optimizeImageUrlsInHtml } from '@/packages/utils/optimization';
import type { NoticeData } from '@/packages/type/noticeType';
import { Timestamp } from 'firebase/firestore';
import {
  IoIosArrowBack,
  IoIosCalendar,
  IoIosPerson,
  IoIosEye,
  IoIosList,
} from 'react-icons/io';
import { RiPencilFill } from 'react-icons/ri';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import NoticeReadContentSkeleton from './NoticeReadContentSkeleton';
import ReadFooter from '../common/ReadFooter';

const NOTICE_COLLECTION = 'notice';

interface NoticeReadData extends NoticeData {
  category?: string;
  authorName?: string;
}

interface NoticeReadContentProps {
  noticeId: string;
}

function toNoticeData(id: string, data: Record<string, unknown>): NoticeReadData {
  const raw = data as {
    title?: string;
    content?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    category?: string;
    authorName?: string;
  };
  const createdAt =
    raw.createdAt instanceof Timestamp ? raw.createdAt : Timestamp.now();
  const updatedAt =
    raw.updatedAt instanceof Timestamp ? raw.updatedAt : Timestamp.now();
  return {
    id,
    title: raw.title ?? '',
    content: raw.content ?? '',
    createdAt,
    updatedAt,
    category: raw.category,
    authorName: raw.authorName,
  };
}

export default function NoticeReadContent({ noticeId }: NoticeReadContentProps) {
  const router = useRouter();
  const { fullAdmin } = useFullAdmin();
  const [notice, setNotice] = useState<NoticeReadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { viewCount } = useViewCount(NOTICE_COLLECTION, noticeId ?? undefined, {
    enabled: !!notice,
  });

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '',
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!noticeId) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setNotice(null);

    const load = async () => {
      try {
        const snap = await getDoc(doc(firestore, NOTICE_COLLECTION, noticeId));
        if (cancelled) return;
        if (snap.exists()) {
          const data = toNoticeData(snap.id, snap.data());
          setNotice(data);
          setNotFound(false);
          if (editor && data.content) {
            const optimized = optimizeImageUrlsInHtml(data.content);
            editor.commands.setContent(optimized);
          }
        } else {
          setNotice(null);
          setNotFound(true);
        }
      } catch (e) {
        if (!cancelled) {
          console.error('공지 조회 실패:', e);
          setNotice(null);
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [noticeId, editor]);

  const handleDelete = useCallback(async () => {
    if (!noticeId || !fullAdmin) return;
    if (!confirm('이 공지를 삭제하시겠습니까?')) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(firestore, NOTICE_COLLECTION, noticeId));
      router.push('/notice');
    } catch (e) {
      console.error('공지 삭제 실패:', e);
      alert('삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  }, [noticeId, fullAdmin, router]);

  useEffect(() => {
    if (notice?.content && editor) {
      const optimized = optimizeImageUrlsInHtml(notice.content);
      editor.commands.setContent(optimized);
    }
  }, [notice?.content, editor]);

  if (loading) {
    return <NoticeReadContentSkeleton />;
  }
  if (notFound || !notice) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-sm sm:text-base">공지를 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => router.push('/notice')}
          className="text-xs text-primary1 hover:underline sm:text-sm"
        >
          목록으로
        </button>
      </div>
    );
  }

  const categoryLabel = notice.category ?? '공지';
  const dateStr = formatDateMeta(notice.createdAt);
  const viewCountStr = viewCount.toLocaleString('ko-KR');

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <nav className="mb-4 text-xs text-gray-500 sm:text-sm" aria-label="breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-gray-700">
              홈
            </Link>
          </li>
          <li className="text-gray-400" aria-hidden>›</li>
          <li>
            <Link href="/notice" className="hover:text-gray-700">
              공지사항
            </Link>
          </li>
          <li className="text-gray-400" aria-hidden>›</li>
          <li className="text-gray-700" aria-current="page">
            상세보기
          </li>
        </ol>
      </nav>

      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 sm:text-sm"
      >
        <IoIosArrowBack className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
        뒤로가기
      </button>

      <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <span className="mb-3 inline-block rounded-md bg-primary1 px-2 py-0.5 text-xs font-medium text-white sm:px-2.5 sm:py-1 sm:text-sm">
          {categoryLabel}
        </span>
        <h1 className="mb-6 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
          {notice.title}
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-gray-100 pb-4 text-xs text-gray-500 sm:mb-8 sm:gap-x-4 sm:pb-6 sm:text-sm">
          <span className="flex items-center gap-1.5">
            <IoIosCalendar className="h-3.5 w-3.5 shrink-0 text-gray-400 sm:h-4 sm:w-4" />
            작성일: {dateStr}
          </span>
          <span className="h-3.5 w-px bg-gray-200 sm:h-4" aria-hidden />
          <span className="flex items-center gap-1.5">
            <IoIosPerson className="h-3.5 w-3.5 shrink-0 text-gray-400 sm:h-4 sm:w-4" />
            작성자: 운영진
          </span>
          <span className="h-3.5 w-px bg-gray-200 sm:h-4" aria-hidden />
          <span className="flex items-center gap-1.5">
            <IoIosEye className="h-3.5 w-3.5 shrink-0 text-gray-400 sm:h-4 sm:w-4" />
            조회수: {viewCountStr}
          </span>
        </div>

        <div className="max-w-none prose prose-sm [&_.tiptap]:text-sm [&_img]:mx-auto [&_img]:block [&_figcaption]:text-primary1 [&_figcaption]:text-center [&_figcaption]:text-xs sm:[&_figcaption]:text-sm [&_figcaption]:mt-2 sm:[&_.tiptap]:text-base">
          {editor && <EditorContent editor={editor} className="tiptap" />}
        </div>
      </article>

      <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4">
        <button
          type="button"
          onClick={() => router.push('/notice')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
        >
          <IoIosList className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
          목록으로 돌아가기
        </button>
        {fullAdmin && (
          <>
            <Link
              href={`/notice/write/${noticeId}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary1 bg-white px-4 py-2.5 text-xs font-medium text-primary1 transition-colors hover:bg-primary1/5 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
            >
              <RiPencilFill className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              수정
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500 bg-white px-4 py-2.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
            >
              <MdOutlineDeleteOutline className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          </>
        )}

      </div>

      <ReadFooter type="notice" noticeId={noticeId} />
    </div>
  );
}
