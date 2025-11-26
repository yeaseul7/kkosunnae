import { Timestamp } from 'firebase/firestore';

export interface PostData {
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorPhotoURL: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  thumbnail?: string | null; // 대표 이미지 (콘텐츠의 첫 번째 이미지)
}
