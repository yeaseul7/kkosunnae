'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  loadEmbedModel,
  isModelLoaded,
  EMBED_DIM,
  getImageEmbeddingFromResult,
  type SimilarMatch,
} from '@/lib/search-animal';

export function useSearchAnimal() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modelReady, setModelReady] = useState(isModelLoaded());
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMatches, setSearchMatches] = useState<SimilarMatch[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const loadModel = useCallback(async () => {
    try {
      await loadEmbedModel();
      setModelReady(true);
      setSearchError(null);
      return true;
    } catch (e) {
      console.error('[search-animal] 모델 로드 실패:', e);
      setSearchError(e instanceof Error ? e.message : '모델 로드 실패');
      return false;
    }
  }, []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(file ?? null);
    setSearchMatches(null);
    setSearchError(null);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }, [previewUrl]);

  const runSearch = useCallback(async () => {
    if (!selectedFile || !previewUrl) return;
    setSearchLoading(true);
    setSearchError(null);
    setSearchMatches(null);
    try {
      const extractor = await loadEmbedModel();
      const result = await extractor(previewUrl, { pool: false });
      const vector = getImageEmbeddingFromResult(result as { data?: Float32Array; dims?: number[] });
      if (!vector || vector.length !== EMBED_DIM) {
        setSearchError(
          vector
            ? `임베딩 차원이 인덱스와 맞지 않습니다. (${vector.length} ≠ ${EMBED_DIM})`
            : '이미지에서 벡터를 추출하지 못했습니다.'
        );
        setSearchLoading(false);
        return;
      }
      const res = await fetch('/api/search-animal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vector, topK: 24 }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSearchError(json.error ?? json.details ?? '검색에 실패했습니다.');
        setSearchLoading(false);
        return;
      }
      setSearchMatches(json.matches ?? []);
    } catch (e) {
      setSearchError(e instanceof Error ? e.message : '검색 중 오류가 발생했습니다.');
    } finally {
      setSearchLoading(false);
    }
  }, [selectedFile, previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return {
    selectedFile,
    previewUrl,
    modelReady,
    searchLoading,
    searchMatches,
    searchError,
    loadModel,
    onFileChange,
    runSearch,
  };
}
