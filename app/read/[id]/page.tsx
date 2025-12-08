import { Metadata } from 'next';
import ReadPostContent from '@/packages/ui/components/home/read/ReadPostContent';
import { getPostById } from '@/lib/api/post';

// HTML에서 텍스트 추출 헬퍼 함수
function extractText(html: string | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// 이미지 URL 추출 헬퍼 함수
function extractFirstImage(html: string | undefined): string | null {
  if (!html || typeof html !== 'string') {
    return null;
  }
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = html.match(imgRegex);
  return match && match[1] ? match[1] : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: postId } = await params;

  // 환경에 따른 기본 URL 설정
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    'http://localhost:3001';

  try {
    const post = await getPostById(postId);

    if (post) {
      const title = post.title || '게시물';
      const description =
        extractText(post.content).substring(0, 160) || '꼬순내 게시물';

      // 이미지 URL을 절대 경로로 변환
      let imageUrl = extractFirstImage(post.content);
      if (imageUrl) {
        // 상대 경로인 경우 절대 경로로 변환
        if (imageUrl.startsWith('/')) {
          imageUrl = `${baseUrl}${imageUrl}`;
        } else if (!imageUrl.startsWith('http')) {
          imageUrl = `${baseUrl}/${imageUrl}`;
        }
      } else {
        imageUrl = `${baseUrl}/static/images/defaultDogImg.png`;
      }

      const url = `${baseUrl}/read/${postId}`;

      return {
        title: `${title} | 꼬순내`,
        description,
        metadataBase: new URL(baseUrl),
        openGraph: {
          title,
          description,
          url,
          siteName: '꼬순내',
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
          locale: 'ko_KR',
          type: 'article',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [imageUrl],
        },
      };
    }
  } catch (error) {
    console.error('메타데이터 생성 중 오류:', error);
  }

  const defaultImageUrl = `${baseUrl}/static/images/defaultDogImg.png`;

  return {
    title: '게시물 | 꼬순내',
    description: '꼬순내 게시물',
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: '게시물 | 꼬순내',
      description: '꼬순내 게시물',
      url: `${baseUrl}/read/${postId}`,
      siteName: '꼬순내',
      images: [
        {
          url: defaultImageUrl,
          width: 1200,
          height: 630,
          alt: '꼬순내',
        },
      ],
      locale: 'ko_KR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: '게시물 | 꼬순내',
      description: '꼬순내 게시물',
      images: [defaultImageUrl],
    },
  };
}

export default async function ReadPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: postId } = await params;
  const post = await getPostById(postId);

  return <ReadPostContent postId={postId} initialPost={post} />;
}
