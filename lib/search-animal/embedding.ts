/**
 * 백엔드와 동일: pool: false → CLS(첫 토큰) 추출 후 L2 정규화 (코사인 유사도용)
 */
export function getImageEmbeddingFromResult(
  result: { data?: Float32Array; dims?: number[] } | null
): number[] | null {
  if (!result?.data) return null;
  const data = result.data as Float32Array;
  const dims = result.dims ?? [];
  const hiddenDim = dims.length >= 3 ? dims[2] : data.length;
  const clsVector = data.subarray(0, hiddenDim);
  const arr = Array.from(clsVector);
  const norm = Math.sqrt(arr.reduce((s, x) => s + x * x, 0)) || 1;
  return arr.map((x) => x / norm);
}
