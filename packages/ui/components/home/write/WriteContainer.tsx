'use client';
import { firestore } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/firebase/auth';
import TagInput from '@/packages/ui/components/home/write/TagInput';
import WriteBody from '@/packages/ui/components/home/write/WriteBody';
import WriteFooter from '@/packages/ui/components/home/write/WriteFooter';
import WriteHeader from '@/packages/ui/components/home/write/WriteHeader';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostData } from '@/packages/type/postType';
import WriteNotice from './wrtieNotice';

interface WriteContainerProps {
  className?: string;
}
export default function WriteContainer({ className }: WriteContainerProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [postData, setPostData] = useState<PostData | null>(null);
  const [writeCategory, setWriteCategory] = useState<'adoption' | 'pet-life'>('adoption');

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
        category: writeCategory,
        authorId: user.uid,
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
          `게시물 생성 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'
          }`,
        );
      }
    }
  }, [postData, writeCategory, user, router]);
  return (
    <div
      className={`grid w-full h-full min-h-0 grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 ${className || ''}`}
    >
      <div className="flex flex-col w-full h-full min-h-0">
        <div className="flex flex-col flex-1 min-h-0 p-4 sm:p-6 lg:p-8 bg-white rounded-2xl"
          style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.05)' }}
        >
          <div className="shrink-0 mb-4">
            <WriteHeader
              postData={postData as PostData}
              setPostData={setPostData as Dispatch<SetStateAction<PostData>>}
              writeCategory={writeCategory}
              setWriteCategory={setWriteCategory}
            />
          </div>

          <div className="flex-1 min-h-0">
            <WriteBody postData={postData} setPostData={setPostData} />
          </div>
          <div className="shrink-0 mt-4">
            <TagInput
              postData={postData as PostData}
              setPostData={setPostData as Dispatch<SetStateAction<PostData | null>>}
            />
          </div>
        </div>
        <div className="flex justify-end items-center w-full shrink-0 mt-4">
          <WriteFooter posting={posting} />
        </div>
      </div>
      <div className="min-h-0 px-4 sm:px-6 lg:px-8">
        <WriteNotice />
      </div>
    </div>
  );
}
