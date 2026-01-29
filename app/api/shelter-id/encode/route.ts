import { NextResponse } from 'next/server';
import { encodeShelterId } from '@/lib/shelterId';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const careRegNos = body?.care_reg_nos;

    if (!Array.isArray(careRegNos)) {
      return NextResponse.json(
        { error: 'care_reg_nos 배열이 필요합니다.' },
        { status: 400 }
      );
    }

    const tokens: Record<string, string> = {};
    for (const careRegNo of careRegNos) {
      if (careRegNo != null && String(careRegNo).trim()) {
        const key = String(careRegNo).trim();
        tokens[key] = encodeShelterId(key);
      }
    }

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('shelter-id encode error:', error);
    return NextResponse.json(
      { error: '토큰 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
