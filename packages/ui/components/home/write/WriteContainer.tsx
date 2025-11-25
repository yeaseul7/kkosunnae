'use client';
import { firestore } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/firebase/auth';
import DecorateHr from '@/packages/ui/components/base/DecorateHr';
import TagInput from '@/packages/ui/components/home/write/TagInput';
import WriteBody from '@/packages/ui/components/home/write/WriteBody';
import WriteFooter from '@/packages/ui/components/home/write/WriteFooter';
import WriteHeader from '@/packages/ui/components/home/write/WriteHeader';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

interface WriteContainerProps {
  className?: string;
}
export interface PostData {
  title: string;
  content: string;
  tags: string[];
}

export default function WriteContainer({ className }: WriteContainerProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [postData, setPostData] = useState<PostData>({
    title: '',
    content: '',
    tags: [],
  });

  const posting = useCallback(async () => {
    if (!user) {
      console.error('게시물을 작성하려면 로그인이 필요합니다.');
      alert('게시물을 작성하려면 로그인이 필요합니다.');
      return;
    }

    console.log('게시물 생성 시도 - 사용자:', user.uid, user.email);

    try {
      const postDataToSave = {
        ...postData,
        authorId: user.uid,
        authorName: user.displayName || user.email || '익명',
        authorPhotoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log('저장할 데이터:', postDataToSave);

      const docRef = await addDoc(
        collection(firestore, 'boards'),
        postDataToSave,
      );
      console.log('게시물 생성 완료! 문서 ID: ', docRef.id);
      alert('게시물이 성공적으로 생성되었습니다!');
      router.push(`/read/${docRef.id}`);
    } catch (e) {
      console.error('게시물 생성 중 오류 발생: ', e);

      const error = e as { code?: string; message?: string };
      console.error('오류 코드:', error.code);
      console.error('오류 메시지:', error.message);

      if (error.code === 'permission-denied') {
        alert(
          '권한이 없습니다. Firestore 보안 규칙을 확인해주세요.\n\nFirebase 콘솔 > Firestore Database > 규칙에서 boards 컬렉션에 대한 쓰기 권한이 설정되어 있는지 확인하세요.',
        );
      } else {
        alert(
          `게시물 생성 중 오류가 발생했습니다: ${
            error.message || '알 수 없는 오류'
          }`,
        );
      }
    }
  }, [postData, user, router]);
  return (
    <div className={`flex flex-col  w-full h-full ${className || ''}`}>
      <div className="flex flex-col justify-start items-center w-full h-full">
        <WriteHeader postData={postData} setPostData={setPostData} />
        <TagInput postData={postData} setPostData={setPostData} />
        <DecorateHr />
        <WriteBody postData={postData} setPostData={setPostData} />
        <div className="flex justify-end items-center w-full">
          <WriteFooter posting={posting} />
        </div>
      </div>
    </div>
  );
}
