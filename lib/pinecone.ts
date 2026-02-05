import { Pinecone } from '@pinecone-database/pinecone';

const apiKey = process.env.NEXT_PINECONE_API_KEY;

if (!apiKey) {
  console.warn(
    '[Pinecone] NEXT_PINECONE_API_KEY is not set. Set it in .env.local to use Pinecone.',
  );
}

/** Pinecone 클라이언트 싱글톤 (서버 전용) */
export const pinecone = new Pinecone({
  apiKey: apiKey ?? '',
});

/** 인덱스 이름. .env.local에 NEXT_PINECONE_INDEX로 지정 가능 */
export const NEXT_PINECONE_INDEX_NAME =
  process.env.NEXT_PINECONE_INDEX ?? 'embeded-animal';

/**
 * 기본 인덱스 참조
 * 사용 예: const index = getPineconeIndex(); await index.query(...);
 */
export function getPineconeIndex() {
  return pinecone.index(NEXT_PINECONE_INDEX_NAME);
}
