import { Timestamp } from 'firebase/firestore';

export interface UserInfo {
  approve: boolean;
  nickname: string | null;
  photoURL: string | null;
  email: string;
  description: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}
