'use client';

import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { firestore } from '@/lib/firebase/firebase';
import type { NoticeData } from '@/packages/type/noticeType';

const NOTICE_COLLECTION = 'notice';

function toNoticeData(
  id: string,
  data: { title?: string; content?: string; createdAt?: Timestamp; updatedAt?: Timestamp; category?: string },
): NoticeData {
  const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now();
  const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.now();
  return {
    id,
    title: data.title ?? '',
    content: data.content ?? '',
    createdAt,
    updatedAt,
    category: data.category ?? '',
  };
}

function getEmptyNoticeData(): NoticeData {
  const now = Timestamp.now();
  return {
    id: '',
    title: '',
    content: '',
    createdAt: now,
    updatedAt: now,
    category: '공지',
  };
}

export function useNoticeWrite(noticeId?: string) {
  const { user } = useAuth();
  const router = useRouter();
  const [noticeData, setNoticeData] = useState<NoticeData | null>(() =>
    !noticeId ? getEmptyNoticeData() : null
  );
  const [loading, setLoading] = useState(!!noticeId);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // 생성 모드: noticeId가 없으면 로딩 해제
  useEffect(() => {
    if (!noticeId) {
      setNoticeData(getEmptyNoticeData());
      setLoading(false);
      setNotFound(false);
    }
  }, [noticeId]);

  // 수정 모드: notice 컬렉션에서 데이터 로드
  useEffect(() => {
    if (!noticeId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const snap = await getDoc(doc(firestore, NOTICE_COLLECTION, noticeId));
        if (cancelled) return;
        if (snap.exists()) {
          setNoticeData(toNoticeData(snap.id, snap.data()));
          setNotFound(false);
        } else {
          setNoticeData(null);
          setNotFound(true);
        }
      } catch (e) {
        if (!cancelled) {
          console.error('공지 로드 실패:', e);
          setNoticeData(null);
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
  }, [noticeId]);

  const writing = useCallback(async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    const title = noticeData?.title?.trim() ?? '';
    const content = noticeData?.content?.trim() ?? '';
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      const category = noticeData?.category?.trim() || '공지';
      if (noticeId) {
        await updateDoc(doc(firestore, NOTICE_COLLECTION, noticeId), {
          title,
          content,
          category,
          updatedAt: serverTimestamp(),
        });
        alert('공지가 수정되었습니다.');
      } else {
        await addDoc(collection(firestore, NOTICE_COLLECTION), {
          title,
          content,
          category,
          authorId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        alert('공지가 등록되었습니다.');
      }
      router.push('/notice');
    } catch (e) {
      console.error('공지 저장 실패:', e);
      const msg = e instanceof Error ? e.message : '저장에 실패했습니다.';
      alert(msg);
    } finally {
      setSaving(false);
    }
  }, [noticeData?.title, noticeData?.content, noticeData?.category, noticeId, user, router]);

  return {
    noticeData,
    setNoticeData,
    loading,
    saving,
    writing,
    notFound,
  };
}
