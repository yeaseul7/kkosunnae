import { useParams, useRouter } from 'next/navigation';
import DecorateHr from '../../base/DecorateHr';
import TagInput from '../write/TagInput';
import WriteBody from '../write/WriteBody';
import WriteFooter from '../write/WriteFooter';
import WriteHeader from '../write/WriteHeader';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PostData } from '@/packages/type/postType';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/firebase/auth';
import Loading from '@/packages/ui/components/base/Loading';
import NotFound from '@/packages/ui/components/base/NotFound';

export default function EditContainer({ className }: { className?: string }) {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const postId = params.id as string;
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [writeCategory, setWriteCategory] = useState<'adoption' | 'pet-life'>('adoption');
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError('게시물 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(firestore, 'boards', postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as PostData;
          setPost(data);
        } else {
          setError('게시물을 찾을 수 없습니다.');
        }
      } catch (e) {
        console.error('게시물 조회 중 오류 발생:', e);
        setError('게시물을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const updatePost = async () => {
    if (!post) return;

    if (!user) {
      alert('게시물을 수정하려면 로그인이 필요합니다.');
      return;
    }

    // 작성자 확인
    if (post.authorId !== user.uid) {
      alert('본인이 작성한 게시물만 수정할 수 있습니다.');
      return;
    }

    try {
      await updateDoc(doc(firestore, 'boards', postId), {
        title: post.title,
        content: post.content,
        tags: post.tags,
        category: writeCategory,
        updatedAt: serverTimestamp(),
      });
      alert('게시물이 성공적으로 수정되었습니다!');
      router.push(`/read/${postId}`);
    } catch (e) {
      console.error('게시물 수정 중 오류 발생:', e);

      const error = e as { code?: string; message?: string };
      if (error.code === 'permission-denied') {
        alert(
          '권한이 없습니다. Firestore 보안 규칙을 확인해주세요.\n\n' +
          'Firebase 콘솔 > Firestore Database > 규칙에서 boards 컬렉션에 대한 업데이트 권한이 설정되어 있는지 확인하세요.\n\n' +
          '예시 규칙:\n' +
          'match /boards/{document=**} {\n' +
          '  allow update: if request.auth != null && request.auth.uid == resource.data.authorId;\n' +
          '}',
        );
      } else {
        alert(
          `게시물 수정 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'
          }`,
        );
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !post) {
    return <NotFound error={error || '게시물을 찾을 수 없습니다.'} />;
  }

  return (
    <div className={`flex flex-col w-full h-full ${className || ''}`}>
      <div className="flex flex-col w-full h-full">
        <WriteHeader
          postData={post}
          setPostData={setPost as Dispatch<SetStateAction<PostData>>}
          writeCategory={post.category as 'adoption' | 'pet-life'}
          setWriteCategory={setWriteCategory as Dispatch<SetStateAction<'adoption' | 'pet-life'>>}
        />
        <TagInput
          postData={post}
          setPostData={setPost as Dispatch<SetStateAction<PostData | null>>}
        />
        <DecorateHr />
        <div className="flex-1 w-full min-h-0">
          <WriteBody
            postData={post}
            setPostData={setPost as Dispatch<SetStateAction<PostData | null>>}
          />
        </div>
        <div className="flex justify-end items-center mt-4 w-full shrink-0">
          <WriteFooter posting={updatePost} />
        </div>
      </div>
    </div>
  );
}
