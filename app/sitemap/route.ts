import { NextResponse } from 'next/server';
import { getBoardsData } from '@/lib/api/post';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  'https://www.kkosunnae.com';

export async function GET() {
  try {
    const [posts, usersSnapshot] = await Promise.all([
      getBoardsData(),
      getDocs(collection(firestore, 'users')),
    ]);

    // 게시물 sitemap entries
    const postEntries = posts.map((post) => {
      let lastModified = new Date().toISOString();

      // Timestamp 처리
      if (post.updatedAt) {
        if (typeof post.updatedAt === 'object' && 'seconds' in post.updatedAt) {
          lastModified = new Date(
            (post.updatedAt as { seconds: number }).seconds * 1000,
          ).toISOString();
        } else if (
          post.updatedAt &&
          typeof post.updatedAt === 'object' &&
          'toDate' in post.updatedAt &&
          typeof (post.updatedAt as { toDate: () => Date }).toDate ===
            'function'
        ) {
          // Firestore Timestamp 객체
          lastModified = (post.updatedAt as { toDate: () => Date })
            .toDate()
            .toISOString();
        } else if (
          post.updatedAt &&
          Object.prototype.toString.call(post.updatedAt) === '[object Date]'
        ) {
          // Date 객체
          lastModified = (post.updatedAt as Date).toISOString();
        }
      } else if (post.createdAt) {
        if (typeof post.createdAt === 'object' && 'seconds' in post.createdAt) {
          lastModified = new Date(
            (post.createdAt as { seconds: number }).seconds * 1000,
          ).toISOString();
        } else if (
          post.createdAt &&
          typeof post.createdAt === 'object' &&
          'toDate' in post.createdAt &&
          typeof (post.createdAt as { toDate: () => Date }).toDate ===
            'function'
        ) {
          // Firestore Timestamp 객체
          lastModified = (post.createdAt as { toDate: () => Date })
            .toDate()
            .toISOString();
        } else if (
          post.createdAt &&
          Object.prototype.toString.call(post.createdAt) === '[object Date]'
        ) {
          // Date 객체
          lastModified = (post.createdAt as Date).toISOString();
        }
      }

      return `  <url>
    <loc>${baseUrl}/read/${post.id}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // 사용자 프로필 페이지 sitemap entries
    const userEntries = usersSnapshot.docs.map((userDoc) => {
      const userData = userDoc.data();
      let lastModified = new Date().toISOString();

      // 사용자 정보 업데이트 날짜 처리
      if (userData.updatedAt) {
        if (
          typeof userData.updatedAt === 'object' &&
          'seconds' in userData.updatedAt
        ) {
          lastModified = new Date(
            (userData.updatedAt as { seconds: number }).seconds * 1000,
          ).toISOString();
        } else if (
          userData.updatedAt &&
          typeof userData.updatedAt === 'object' &&
          'toDate' in userData.updatedAt &&
          typeof (userData.updatedAt as { toDate: () => Date }).toDate ===
            'function'
        ) {
          lastModified = (userData.updatedAt as { toDate: () => Date })
            .toDate()
            .toISOString();
        } else if (
          userData.updatedAt &&
          Object.prototype.toString.call(userData.updatedAt) === '[object Date]'
        ) {
          lastModified = (userData.updatedAt as Date).toISOString();
        }
      } else if (userData.createdAt) {
        if (
          typeof userData.createdAt === 'object' &&
          'seconds' in userData.createdAt
        ) {
          lastModified = new Date(
            (userData.createdAt as { seconds: number }).seconds * 1000,
          ).toISOString();
        } else if (
          userData.createdAt &&
          typeof userData.createdAt === 'object' &&
          'toDate' in userData.createdAt &&
          typeof (userData.createdAt as { toDate: () => Date }).toDate ===
            'function'
        ) {
          lastModified = (userData.createdAt as { toDate: () => Date })
            .toDate()
            .toISOString();
        } else if (
          userData.createdAt &&
          Object.prototype.toString.call(userData.createdAt) === '[object Date]'
        ) {
          lastModified = (userData.createdAt as Date).toISOString();
        }
      }

      return `  <url>
    <loc>${baseUrl}/posts/${userDoc.id}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${postEntries.join('\n')}
${userEntries.join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('게시물 sitemap 생성 중 오류:', error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      {
        headers: {
          'Content-Type': 'application/xml',
        },
      },
    );
  }
}
