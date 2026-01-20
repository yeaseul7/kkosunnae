import { Metadata } from 'next';
import ShelterDetailPageContent from './ShelterDetailPageContent';

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  'http://localhost:3001';

async function fetchAnimalData(desertionNo: string) {
  try {
    const params = new URLSearchParams();
    params.append('desertion_no', desertionNo);
    params.append('numOfRows', '1');

    const response = await fetch(`${baseUrl}/api/shelter-data?${params.toString()}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }

    const shelterAnimalResponse = await response.json();
    const items = shelterAnimalResponse?.response?.body?.items?.item;
    
    if (items) {
      const itemsArray = Array.isArray(items) ? items : [items];
      return itemsArray.length > 0 ? itemsArray[0] : null;
    }
    return null;
  } catch (error) {
    console.error('동물 정보 조회 중 오류 발생:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: desertionNo } = await params;

  console.log('=== 메타데이터 생성 시작 ===');
  console.log('desertionNo:', desertionNo);
  console.log('baseUrl:', baseUrl);

  try {
    const animalData = await fetchAnimalData(desertionNo);
    
    console.log('animalData:', animalData ? '데이터 있음' : '데이터 없음');

    if (animalData) {
      const kindName = animalData.kindFullNm || animalData.kindNm || '유기동물';
      const title = `${kindName} | 꼬순내`;
      const description = animalData.specialMark
        ? `${kindName} - ${animalData.specialMark.substring(0, 120)}`
        : `${kindName} 입양 정보를 확인해보세요.`;

      // 이미지 URL 처리
      let imageUrl = animalData.popfile || animalData.popfile1 || animalData.popfile2 || animalData.popfile3;
      
      console.log('원본 이미지 URL:', imageUrl);
      
      if (imageUrl) {
        // 이미 절대 경로인 경우
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          // 그대로 사용
        } else if (imageUrl.startsWith('/')) {
          imageUrl = `${baseUrl}${imageUrl}`;
        } else {
          imageUrl = `${baseUrl}/${imageUrl}`;
        }
      } else {
        imageUrl = `${baseUrl}/static/images/defaultDogImg.png`;
      }

      console.log('최종 이미지 URL:', imageUrl);

      const pageUrl = `${baseUrl}/shelter/${desertionNo}`;

      const metadata: Metadata = {
        title,
        description,
        metadataBase: new URL(baseUrl),
        openGraph: {
          title,
          description,
          url: pageUrl,
          siteName: '꼬순내',
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: kindName,
            },
          ],
          locale: 'ko_KR',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [imageUrl],
        },
      };

      console.log('생성된 메타데이터:', JSON.stringify(metadata, null, 2));
      return metadata;
    }
  } catch (error) {
    console.error('메타데이터 생성 중 오류:', error);
  }

  const defaultImageUrl = `${baseUrl}/static/images/defaultDogImg.png`;

  return {
    title: '유기동물 정보 | 꼬순내',
    description: '유기동물 입양 정보를 확인해보세요.',
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: '유기동물 정보 | 꼬순내',
      description: '유기동물 입양 정보를 확인해보세요.',
      url: `${baseUrl}/shelter/${desertionNo}`,
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
      title: '유기동물 정보 | 꼬순내',
      description: '유기동물 입양 정보를 확인해보세요.',
      images: [defaultImageUrl],
    },
  };
}

export default async function ShelterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: desertionNo } = await params;
  return <ShelterDetailPageContent desertionNo={desertionNo} />;
}
