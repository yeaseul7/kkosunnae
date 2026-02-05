export type SimilarMatch = {
  id: string;
  score?: number;
  metadata?: Record<string, unknown>;
};

export type FeatureExtractor = (
  url: string,
  opts?: { pool?: boolean }
) => Promise<{ data: Float32Array; dims?: number[] }>;
