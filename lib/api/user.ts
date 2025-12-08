import { UserProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

/**
 * @param userId 사용자 ID
 * @returns 사용자 정보
 */
export async function getUserProfile(
  userId: string,
): Promise<UserProfile | undefined> {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
    return undefined;
  }
}
