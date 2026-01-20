import { NextResponse } from 'next/server';

// 배열에서 랜덤으로 n개 선택하는 함수
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedCount = parseInt(searchParams.get('maxResults') || '5');
  const regionCode = searchParams.get('regionCode') || 'KR';

  const API_KEY = process.env.NEXT_GOOGLE_YOUTUBE_API;

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'YouTube API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.append('part', 'snippet,statistics,contentDetails');
    url.searchParams.append('chart', 'mostPopular');
    url.searchParams.append('regionCode', regionCode);
    url.searchParams.append('maxResults', '100'); // 20개 가져오기
    url.searchParams.append('videoCategoryId', '15'); // 특정 카테고리만 원할 경우 활성화
    url.searchParams.append('key', API_KEY);

    console.log('YouTube API 요청 URL:', url.toString().replace(API_KEY, 'API_KEY'));

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

    const response = await fetch(url.toString(), {
      headers: {
        'Referer': baseUrl,
        'Origin': baseUrl,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API 에러 응답:', errorData);
      return NextResponse.json(
        { 
          error: '인기 동영상을 가져오는데 실패했습니다.',
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    const randomItems = getRandomItems(data.items || [], requestedCount);
    
    return NextResponse.json({
      ...data,
      items: randomItems,
      totalResults: data.items?.length || 0,
      selectedCount: randomItems.length,
    });
  } catch (error) {
    console.error('YouTube API 에러:', error);
    return NextResponse.json(
      { 
        error: '인기 동영상을 가져오는데 실패했습니다.',
        message: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}
