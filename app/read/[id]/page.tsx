import { Metadata } from 'next';
import ReadPostContent from '@/packages/ui/components/home/read/ReadPostContent';
import { getPostById } from '@/lib/api/post';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import PageFooter from '@/packages/ui/components/base/PageFooter';
import {
  getBaseUrl,
  extractText,
  extractFirstImage,
  generateMetadata as generateMetadataUtil,
  generateDefaultMetadata,
} from '@/packages/utils/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: postId } = await params;
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/read/${postId}`;

  try {
    const post = await getPostById(postId);

    if (post) {
      const title = post.title || '게시물';
      const description =
        extractText(post.content).substring(0, 160) || '꼬순내 게시물';
      const imageUrl = extractFirstImage(post.content);

      return generateMetadataUtil({
        title: `${title} `,
        description,
        imageUrl,
        url,
        type: 'article',
        imageAlt: title,
      });
    }
  } catch (error) {
    console.error('메타데이터 생성 중 오류:', error);
  }

  return generateDefaultMetadata(
    '게시물 | 꼬순내',
    '꼬순내 게시물',
    url,
    {
      type: 'article',
    },
  );
}

export default async function ReadPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: postId } = await params;
  const post = await getPostById(postId);

  return (
    <main className="page-container-full">
      <PageTemplate visibleHeaderButtons={true} visibleHomeTab={false}>
        <ReadPostContent postId={postId} initialPost={post} />
      </PageTemplate>
      <PageFooter />
    </main>
  );
}
