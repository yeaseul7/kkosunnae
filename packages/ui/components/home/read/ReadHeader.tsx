import { PostData } from '@/packages/type/postType';
import NextImage from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/firebase/auth';

export default function ReadHeader({
  post,
  isEditing,
}: {
  post: PostData | null;
  isEditing: boolean;
}) {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const postId = params.id as string;

  const handleEdit = useCallback(() => {
    router.push(`/edit/${postId}`);
  }, [router, postId]);

  const handleDelete = useCallback(async () => {
    if (!user) {
      alert('게시물을 삭제하려면 로그인이 필요합니다.');
      return;
    }

    if (!post) {
      alert('게시물 정보를 불러올 수 없습니다.');
      return;
    }

    // 작성자 확인
    if (post.authorId !== user.uid) {
      alert('본인이 작성한 게시물만 삭제할 수 있습니다.');
      return;
    }

    // 삭제 확인
    const confirmed = window.confirm('정말로 이 게시물을 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(doc(firestore, 'boards', postId));
      alert('게시물이 성공적으로 삭제되었습니다.');
      router.push('/'); // 홈으로 리다이렉트
    } catch (e) {
      console.error('게시물 삭제 중 오류 발생:', e);

      const error = e as { code?: string; message?: string };
      if (error.code === 'permission-denied') {
        alert(
          '권한이 없습니다. Firestore 보안 규칙을 확인해주세요.\n\n' +
            'Firebase 콘솔 > Firestore Database > 규칙에서 boards 컬렉션에 대한 삭제 권한이 설정되어 있는지 확인하세요.',
        );
      } else {
        alert(
          `게시물 삭제 중 오류가 발생했습니다: ${
            error.message || '알 수 없는 오류'
          }`,
        );
      }
    }
  }, [router, postId, user, post]);

  return (
    <header className="mb-6">
      <h1 className="mb-4 text-3xl font-bold">{post?.title}</h1>

      <div className="flex gap-4 justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          {post?.authorPhotoURL ? (
            <NextImage
              src={post?.authorPhotoURL}
              alt={post?.authorName}
              width={28}
              height={28}
              className="object-cover w-7 h-7 rounded-full"
            />
          ) : (
            <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
          )}
          <div className="flex gap-2 items-center">
            <div className="pr-2 text-base font-semibold">
              {post?.authorName}
            </div>
            {post?.createdAt && (
              <div className="text-sm text-gray-500">
                {post?.createdAt.toDate().toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1 items-center">
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-2 py-1 text-gray-500 whitespace-nowrap transition-colors cursor-pointer shrink-0 hover:text-gray-900"
            >
              수정
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-2 py-1 text-gray-500 whitespace-nowrap transition-colors cursor-pointer shrink-0 hover:text-gray-900"
          >
            삭제
          </button>
        </div>
      </div>

      {post?.tags && post?.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post?.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-sm whitespace-nowrap rounded-full cursor-pointer bg-element2 text-primary1 shrink-0"
            >
              # {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
