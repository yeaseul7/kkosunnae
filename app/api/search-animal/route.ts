import { NextRequest, NextResponse } from 'next/server';
import { getPineconeIndex } from '@/lib/pinecone';

/** POST: 벡터로 유사 검색 (이미지 임베딩 등) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const vector = body?.vector as number[] | undefined;
    const topK = Math.min(Math.max(Number(body?.topK) || 10, 1), 100);

    if (!Array.isArray(vector) || vector.length === 0) {
      return NextResponse.json(
        { error: 'vector 배열이 필요합니다.' },
        { status: 400 },
      );
    }

    const index = getPineconeIndex();
    const result = await index.query({
      vector,
      topK,
      includeMetadata: true,
      includeValues: false,
    });

    return NextResponse.json({
      matches: (result.matches ?? []).map((m) => ({
        id: m.id,
        score: m.score,
        metadata: m.metadata,
      })),
    });
  } catch (error) {
    console.error('[search-animal] Pinecone query 오류:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: '유사 검색에 실패했습니다.', details: message },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const index = getPineconeIndex();

    const stats = await index.describeIndexStats();

    const listResult = await index.listPaginated({ limit: 100 });
    const ids = (listResult.vectors ?? [])
      .map((v) => v.id)
      .filter((id): id is string => typeof id === 'string');

    let records: Record<string, unknown> = {};
    if (ids.length > 0) {
      const fetchResult = await index.fetch({ ids });
      const raw = fetchResult?.records;
      records = (raw != null && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    }

    return NextResponse.json({
      stats: {
        totalRecordCount: stats.totalRecordCount ?? 0,
        namespaces: stats.namespaces ?? {},
        dimension: stats.dimension,
      },
      records: Object.entries(records).map(([id, record]) => ({
        id,
        ...(record as object),
      })),
      nextToken: (listResult.pagination as { next?: string } | undefined)?.next ?? null,
    });
  } catch (error) {
    console.error('[search-animal] Pinecone 조회 오류:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Pinecone 조회에 실패했습니다.', details: message },
      { status: 500 },
    );
  }
}
