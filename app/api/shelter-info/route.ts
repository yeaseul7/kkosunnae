import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://apis.data.go.kr/1543061/animalShelterSrvc_v2';

interface ShelterInfoParams {
  care_reg_no?: string; // 보호소번호
  upr_cd?: string; // 시도코드
  org_cd?: string; // 시군구코드
  pageNo?: string; // 페이지 번호 (기본값: 1)
  numOfRows?: string; // 페이지당 보여줄 개수 (기본값: 10)
  _type?: string; // xml(기본값) 또는 json
}

// 보호소 정보 응답 타입
export interface ShelterInfoItem {
  careNm?: string; // 보호소명
  careRegNo?: string; // 보호소번호
  orgNm?: string; // 관할기관명
  divisionNm?: string; // 구분명
  saveTrgtAnimal?: string; // 보호대상동물
  careAddr?: string; // 보호소주소
  jibunAddr?: string; // 지번주소
  lat?: number; // 위도
  lng?: number; // 경도
  dsignationDate?: string; // 지정일자
  weekOprStime?: string; // 평일 운영시작시간
  weekOprEtime?: string; // 평일 운영종료시간
  weekCellStime?: string; // 평일 입양시작시간
  weekCellEtime?: string; // 평일 입양종료시간
  weekendOprStime?: string; // 주말 운영시작시간
  weekendOprEtime?: string; // 주말 운영종료시간
  weekendCellStime?: string; // 주말 입양시작시간
  weekendCellEtime?: string; // 주말 입양종료시간
  closeDay?: string; // 휴무일
  vetPersonCnt?: number; // 수의사 인원수
  specsPersonCnt?: number; // 전문인력 인원수
  medicalCnt?: number; // 의료실 수
  breedCnt?: number; // 사육실 수
  quarabtineCnt?: number; // 격리실 수
  feedCnt?: number; // 사료보관실 수
  careTel?: string; // 보호소전화번호
  dataStdDt?: string; // 데이터기준일자
}

export interface ShelterInfoResponse {
  response: {
    header: {
      reqNo: number;
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: ShelterInfoItem | ShelterInfoItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export async function GET(request: NextRequest) {
  try {
    const serviceKey = process.env.NEXT_PUBLIC_SHELTERS_OPENAPI;

    if (!serviceKey) {
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 },
      );
    }

    // URL 쿼리 파라미터에서 요청 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const params: ShelterInfoParams = {};

    // 각 파라미터를 조건부로 추가
    if (searchParams.has('care_reg_no'))
      params.care_reg_no = searchParams.get('care_reg_no')!;
    if (searchParams.has('upr_cd'))
      params.upr_cd = searchParams.get('upr_cd')!;
    if (searchParams.has('org_cd'))
      params.org_cd = searchParams.get('org_cd')!;
    if (searchParams.has('pageNo'))
      params.pageNo = searchParams.get('pageNo')!;
    if (searchParams.has('numOfRows'))
      params.numOfRows = searchParams.get('numOfRows')!;
    if (searchParams.has('_type'))
      params._type = searchParams.get('_type')!;

    // 기본값 설정
    const pageNo = params.pageNo || '1';
    const numOfRows = params.numOfRows || '10';
    const _type = params._type || 'json';

    // URL 파라미터 구성
    const urlParams = new URLSearchParams();
    urlParams.append('serviceKey', serviceKey);
    urlParams.append('pageNo', pageNo);
    urlParams.append('numOfRows', numOfRows);
    urlParams.append('_type', _type);

    // 선택적 파라미터 추가
    if (params.care_reg_no)
      urlParams.append('care_reg_no', params.care_reg_no);
    if (params.upr_cd) urlParams.append('upr_cd', params.upr_cd);
    if (params.org_cd) urlParams.append('org_cd', params.org_cd);

    // 공공데이터포털 API 호출
    // 엔드포인트 경로: /shelterInfo (보호소 정보 조회)
    const apiUrl = `${API_BASE_URL}/shelterInfo_v2?${urlParams.toString()}`;
    console.log('Shelter API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shelter API Error:', errorText);
      return NextResponse.json(
        {
          error: 'Failed to fetch data from shelter API',
          details: errorText,
        },
        { status: response.status },
      );
    }

    const data = (await response.json()) as ShelterInfoResponse;

    // 응답 데이터 검증 및 정규화
    if (data?.response?.body?.items?.item) {
      // item이 배열이 아닌 경우 배열로 변환
      const items = data.response.body.items.item;
      if (!Array.isArray(items)) {
        data.response.body.items.item = [items];
      }
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Shelter info API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to fetch shelter info',
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
