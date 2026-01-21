import { MetadataRoute } from 'next';
import { getBoardsData } from '@/lib/api/post';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === 'production'
    ? 'https://www.kkosunnae.com'
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://www.kkosunnae.com');

// Timestamp를 Date로 변환하는 헬퍼 함수
function getDateFromTimestamp(timestamp: unknown): Date {
  if (!timestamp) return new Date();

  // Firestore Timestamp 객체 (seconds 속성이 있는 경우)
  if (
    typeof timestamp === 'object' &&
    timestamp !== null &&
    'seconds' in timestamp
  ) {
    return new Date((timestamp as { seconds: number }).seconds * 1000);
  }

  // Firestore Timestamp 객체 (toDate 메서드가 있는 경우)
  if (
    typeof timestamp === 'object' &&
    timestamp !== null &&
    'toDate' in timestamp &&
    typeof (timestamp as { toDate: () => Date }).toDate === 'function'
  ) {
    return (timestamp as { toDate: () => Date }).toDate();
  }

  // Date 객체
  if (
    typeof timestamp === 'object' &&
    timestamp !== null &&
    Object.prototype.toString.call(timestamp) === '[object Date]'
  ) {
    return timestamp as Date;
  }

  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shelter`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 동적 게시물 및 사용자 페이지들
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const [posts, usersSnapshot] = await Promise.all([
      getBoardsData(),
      getDocs(collection(firestore, 'users')),
    ]);

    // 게시물 페이지
    const postPages: MetadataRoute.Sitemap = posts.map((post) => {
      const lastModified = post.updatedAt
        ? getDateFromTimestamp(post.updatedAt)
        : post.createdAt
          ? getDateFromTimestamp(post.createdAt)
          : new Date();

      return {
        url: `${baseUrl}/read/${post.id}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });

    // 사용자 프로필 페이지
    const userPages: MetadataRoute.Sitemap = usersSnapshot.docs.map(
      (userDoc) => {
        const userData = userDoc.data();
        const lastModified = userData.updatedAt
          ? getDateFromTimestamp(userData.updatedAt)
          : userData.createdAt
            ? getDateFromTimestamp(userData.createdAt)
            : new Date();

        return {
          url: `${baseUrl}/posts/${userDoc.id}`,
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.6,
        };
      },
    );

    dynamicPages = [...postPages, ...userPages];
  } catch (error) {
    console.error('동적 sitemap 생성 중 오류:', error);
  }

  return [...staticPages, ...dynamicPages];
}
