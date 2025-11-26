import { Timestamp } from 'firebase/firestore';

export interface CommentData {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string;
  content: string;
  createdAt: Timestamp | null;
}
