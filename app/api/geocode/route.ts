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
    console.error('VWorld API 키가 설정되지 않았습니다.');
    return NextResponse.json(
      { error: 'VWorld API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const apiUrl = `https://api.vworld.kr/req/address?service=address&request=getAddress&key=${apiKey}&point=${longitude},${latitude}&type=both&format=json`;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('VWorld API 호출 실패:', {
        status: response.status,
        statusText: response.statusText,
        response: responseText.substring(0, 500),
      });
      return NextResponse.json(
        {
          error: 'VWorld API 호출 실패',
          status: response.status,
          details: responseText.substring(0, 500)
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError, 'Response:', responseText.substring(0, 500));
      return NextResponse.json(
        { error: 'API 응답 파싱 실패', details: responseText.substring(0, 500) },
        { status: 500 }
      );
    }

    // VWorld API 에러 응답 확인
    if (data.response?.status === 'ERROR') {
      console.error('VWorld API 에러 응답:', data);
      return NextResponse.json(
        {
          error: '주소 변환 실패',
          message: data.response?.text || '알 수 없는 오류'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocoding error:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      {
        error: '주소 변환 중 오류가 발생했습니다.',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
