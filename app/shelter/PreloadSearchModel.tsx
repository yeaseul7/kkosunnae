'use client';

import { useEffect } from 'react';
import { loadEmbedModel } from '@/lib/search-animal';

/** shelter 페이지 마운트 시 AI 이미지 검색 모델 초기화 (검색 페이지 진입 전 미리 로드) */
export default function PreloadSearchModel() {
  useEffect(() => {
    loadEmbedModel().catch(() => {
      // 실패 시 조용히 실패 (검색 페이지에서 다시 시도 가능)
    });
  }, []);
  return null;
}
