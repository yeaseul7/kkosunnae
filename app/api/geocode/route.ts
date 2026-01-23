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

    // 재시도 로직 (최대 3번)
    let lastError: Error | null = null;
    let response: Response | null = null;
    let responseText: string = '';

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // 타임아웃을 위한 AbortController (호환성 개선)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15초 타임아웃

        response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        responseText = await response.text();
        break; // 성공하면 루프 종료
      } catch (fetchError) {
        lastError = fetchError instanceof Error ? fetchError : new Error(String(fetchError));

        // 마지막 시도가 아니면 잠시 대기 후 재시도
        if (attempt < 3) {
          console.warn(`VWorld API 호출 실패 (시도 ${attempt}/3), 재시도 중...`, lastError.message);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // 1초, 2초 대기
          continue;
        }

        // 모든 시도 실패
        throw lastError;
      }
    }

    if (!response) {
      throw new Error('API 응답을 받지 못했습니다.');
    }

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

    let errorMessage = '알 수 없는 오류';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;

      // 네트워크 에러 처리
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        errorMessage = '요청 시간 초과';
        statusCode = 504;
      } else if (error.message.includes('fetch failed') || error.message.includes('UND_ERR_SOCKET')) {
        errorMessage = 'VWorld API 서버와의 연결에 실패했습니다. 잠시 후 다시 시도해주세요.';
        statusCode = 503; // Service Unavailable
      }
    }

    return NextResponse.json(
      {
        error: '주소 변환 중 오류가 발생했습니다.',
        details: errorMessage
      },
      { status: statusCode }
    );
  }
}
