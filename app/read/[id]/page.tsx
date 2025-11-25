'use client';
import { firestore } from '@/lib/firebase/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import NextImage from 'next/image';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import { IoIosArrowBack } from 'react-icons/io';
import Loading from '@/packages/ui/components/base/Loading';

interface PostData {
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorPhotoURL: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

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

          {error && !loading && (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="text-red-500">
                {error || '게시물을 찾을 수 없습니다.'}
              </div>
              <button
                onClick={() => router.back()}
                className="flex gap-2 items-center px-4 py-2 mt-4 text-white bg-blue-500 rounded"
              >
                뒤로가기
              </button>
            </div>
          )}

          {!loading && !error && post && (
            <>
              <button
                onClick={() => router.back()}
                className="flex gap-2 items-center my-4 text-gray-600 hover:text-gray-800"
              >
                <IoIosArrowBack />
                뒤로가기
              </button>

              <article className="p-8 bg-white">
                <header className="mb-6">
                  <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>

                  <div className="flex gap-4 items-center mb-4">
                    {post.authorPhotoURL ? (
                      <NextImage
                        src={post.authorPhotoURL}
                        alt={post.authorName}
                        width={28}
                        height={28}
                        className="object-cover w-7 h-7 rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
                    )}
                    <div className="flex gap-2 items-center">
                      <div className="pr-2 text-base font-semibold">
                        {post.authorName}
                      </div>
                      {post.createdAt && (
                        <div className="text-sm text-gray-500">
                          {post.createdAt.toDate().toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
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

                <div className="max-w-none prose">
                  {editor && (
                    <EditorContent editor={editor} className="tiptap" />
                  )}
                </div>
              </article>
            </>
          )}
        </PageTemplate>
      </main>
    </div>
  );
}
