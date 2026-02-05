import { EMBED_MODEL } from './constants';
import type { FeatureExtractor } from './types';

let cachedExtractor: FeatureExtractor | null = null;
let loadPromise: Promise<FeatureExtractor> | null = null;

/**
 * 이미지 임베딩 모델 싱글톤 로드 (shelter 페이지에서 초기화, search-animal/ SearchAi에서 재사용)
 */
export async function loadEmbedModel(): Promise<FeatureExtractor> {
  if (cachedExtractor) return cachedExtractor;
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const { pipeline } = await import('@huggingface/transformers');
    const extractor = await pipeline('image-feature-extraction', EMBED_MODEL);
    cachedExtractor = extractor as unknown as FeatureExtractor;
    return cachedExtractor;
  })();
  return loadPromise;
}

/** 모델 로드 여부 (캐시 확인용) */
export function isModelLoaded(): boolean {
  return cachedExtractor != null;
}
