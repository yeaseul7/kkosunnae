import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { CommentData } from '@/packages/type/commentType';
/**
 * 댓글 조회
 * @param postId 게시물 ID
 * @returns 댓글 배열
 */
export async function getComments(
  postId: string,
): Promise<CommentData[] | undefined> {
  try {
    const commentsCollection = collection(
      firestore,
      'boards',
      postId,
      'comments',
    );
    const commentsSnapshot = await getDocs(commentsCollection);
    const commentsList = commentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommentData[];
    return commentsList;
  } catch (error) {
    console.error('댓글 조회 실패:', error);
    return undefined;
  }
}
