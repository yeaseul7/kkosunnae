'use client';
import { firestore } from '@/lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import { IoIosArrowBack } from 'react-icons/io';
import Loading from '@/packages/ui/components/base/Loading';
import NotFound from '@/packages/ui/components/base/NotFound';
import { PostData } from '@/packages/type/postType';
import ReadHeader from '@/packages/ui/components/home/read/ReadHeader';
import ReadFooter from '@/packages/ui/components/home/read/ReadFooter';
import Liked from '@/packages/ui/components/home/comment/Liked';

export default function ReadPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '',
    editable: false,
    immediatelyRender: false,
  });

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

          // 에디터에 콘텐츠 설정
          if (editor && data.content) {
            editor.commands.setContent(data.content);
          }
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
  }, [postId, editor]);

  return (
    <div className="flex justify-center items-center min-h-screen font-sans bg-white">
      <main className="flex flex-col items-center px-4 py-4 w-full max-w-6xl min-h-screen">
        <PageTemplate visibleHeaderButtons={true} visibleHomeTab={false}>
          {loading && <Loading />}
          {error && !loading && <NotFound error={error} />}

          {!loading && !error && post && (
            <>
              <button
                onClick={() => router.back()}
                className="flex gap-2 items-center my-4 text-gray-600 hover:text-gray-800"
              >
                <IoIosArrowBack />
                뒤로가기
              </button>

              <div className="relative">
                <Liked />
                <article className="p-8 bg-white">
                  <ReadHeader post={post} isEditing={false} />

                  <div className="max-w-none prose">
                    {editor && (
                      <EditorContent editor={editor} className="tiptap" />
                    )}
                  </div>
                </article>
              </div>
              <ReadFooter post={post} postId={postId} />
            </>
          )}
        </PageTemplate>
      </main>
    </div>
  );
}
