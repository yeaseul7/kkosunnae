import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const longitude = searchParams.get('longitude');
  const latitude = searchParams.get('latitude');

  if (!longitude || !latitude) {
    return NextResponse.json(
      { error: '경도와 위도가 필요합니다.' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_VWORLD_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'VWorld API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.vworld.kr/req/address?service=address&request=getAddress&key=${apiKey}&point=${longitude},${latitude}&type=both&format=json`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('VWorld API 호출 실패');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: '주소 변환 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
