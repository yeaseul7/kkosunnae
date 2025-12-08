import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  FieldValue,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

export type HistoryAction = 'like' | 'comment' | 'reply';
export type HistoryTargetType = 'post' | 'comment' | 'reply';

export interface HistoryData {
  actorId: string; // 행위를 한 사용자 ID
  targetType: HistoryTargetType; // 'post' | 'comment' | 'reply'
  targetId: string; // 게시물/댓글/대댓글 ID
  postId: string; // 게시물 ID (항상 필요)
  commentId?: string; // 댓글 ID (댓글이나 대댓글인 경우)
  replyId?: string; // 대댓글 ID (대댓글인 경우)
  action: HistoryAction; // 'like' | 'comment' | 'reply'
  isRead: boolean;
  createdAt: FieldValue; // serverTimestamp()
}

// 조회된 히스토리 데이터 (createdAt이 Timestamp로 변환됨)
export interface HistoryDataWithId extends Omit<HistoryData, 'createdAt'> {
  id: string;
  createdAt: Timestamp;
}

/**
 * 히스토리 생성
 * @param targetUserId 알림을 받을 사용자 ID (게시물/댓글/대댓글 작성자)
 * @param actorId 행위를 한 사용자 ID
 * @param action 행위 타입 ('like' | 'comment' | 'reply')
 * @param targetType 대상 타입 ('post' | 'comment' | 'reply')
 * @param targetId 대상 ID
 * @param postId 게시물 ID
 * @param commentId 댓글 ID (선택)
 * @param replyId 대댓글 ID (선택)
 */
export async function createHistory(
  targetUserId: string,
  actorId: string,
  action: HistoryAction,
  targetType: HistoryTargetType,
  targetId: string,
  postId: string,
  commentId?: string,
  replyId?: string,
): Promise<void> {
  // 자기 자신에게는 알림을 생성하지 않음
  if (targetUserId === actorId) {
    return;
  }

  try {
    const historyCollection = collection(
      firestore,
      'users',
      targetUserId,
      'history',
    );

    const historyData: HistoryData = {
      actorId,
      targetType,
      targetId,
      postId,
      action,
      isRead: false,
      createdAt: serverTimestamp(),
    };

    if (commentId) {
      historyData.commentId = commentId;
    }

    if (replyId) {
      historyData.replyId = replyId;
    }

    await addDoc(historyCollection, historyData);
  } catch (error) {
    console.error('히스토리 생성 실패:', error);
    // 히스토리 생성 실패는 조용히 처리 (앱 동작에 영향을 주지 않음)
  }
}

/**
 * 히스토리를 읽음으로 표시
 * @param userId 사용자 ID
 * @param historyId 히스토리 ID
 */
export async function markHistoryAsRead(
  userId: string,
  historyId: string,
): Promise<void> {
  try {
    const historyRef = doc(firestore, 'users', userId, 'history', historyId);
    const historyDoc = await getDoc(historyRef);

    if (historyDoc.exists() && !historyDoc.data().isRead) {
      const { updateDoc } = await import('firebase/firestore');
      await updateDoc(historyRef, {
        isRead: true,
      });
    }
  } catch (error) {
    console.error('히스토리 읽음 표시 실패:', error);
  }
}

/**
 * 사용자의 히스토리 조회
 * @param userId 사용자 ID
 * @param options 조회 옵션
 * @returns 히스토리 배열
 */
export async function getHistory(
  userId: string,
  options?: {
    unreadOnly?: boolean; // 읽지 않은 히스토리만 조회
    limitCount?: number; // 조회 개수 제한
  },
): Promise<HistoryDataWithId[]> {
  try {
    const historyCollection = collection(firestore, 'users', userId, 'history');

    let q = query(historyCollection, orderBy('createdAt', 'desc'));

    // // 읽지 않은 히스토리만 조회
    // if (options?.unreadOnly) {
    //   q = query(q, where('isRead', '==', false));
    // }

    // 개수 제한
    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const historySnapshot = await getDocs(q);
    const historyList = historySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as HistoryDataWithId[];

    return historyList;
  } catch (error) {
    console.error('히스토리 조회 실패:', error);
    return [];
  }
}

/**
 * 사용자의 최근 히스토리 조회 (5개)
 * @param userId 사용자 ID
 * @param options 조회 옵션
 * @returns 히스토리 배열
 */
export async function getHistoryRecent(
  userId: string,
  options?: {
    unreadOnly?: boolean; // 읽지 않은 히스토리만 조회
    limitCount?: number; // 조회 개수 제한
  },
): Promise<HistoryDataWithId[]> {
  try {
    const historyCollection = collection(firestore, 'users', userId, 'history');

    let q = query(historyCollection, orderBy('createdAt', 'desc'), limit(5));

    // // 읽지 않은 히스토리만 조회
    // if (options?.unreadOnly) {
    //   q = query(q, where('isRead', '==', false));
    // }

    // 개수 제한
    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const historySnapshot = await getDocs(q);
    const historyList = historySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as HistoryDataWithId[];

    return historyList;
  } catch (error) {
    console.error('히스토리 조회 실패:', error);
    return [];
  }
}
/**
 * 읽지 않은 히스토리 개수 조회
 * @param userId 사용자 ID
 * @returns 읽지 않은 히스토리 개수
 */
export async function getUnreadHistoryCount(userId: string): Promise<number> {
  try {
    const historyCollection = collection(firestore, 'users', userId, 'history');
    // 개수만 필요하므로 orderBy 제거 (인덱스 불필요)
    const q = query(historyCollection, where('isRead', '==', false));
    const historySnapshot = await getDocs(q);
    return historySnapshot.size;
  } catch (error) {
    console.error('읽지 않은 히스토리 개수 조회 실패:', error);
    return 0;
  }
}

/**
 * 모든 히스토리를 읽음으로 표시
 * @param userId 사용자 ID
 */
export async function markAllHistoryAsRead(userId: string): Promise<void> {
  try {
    const historyCollection = collection(firestore, 'users', userId, 'history');
    // 모든 읽지 않은 항목을 업데이트하므로 orderBy 제거 (인덱스 불필요)
    const q = query(historyCollection, where('isRead', '==', false));
    const historySnapshot = await getDocs(q);

    const { updateDoc } = await import('firebase/firestore');
    const updatePromises = historySnapshot.docs.map((doc) =>
      updateDoc(doc.ref, {
        isRead: true,
      }),
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('모든 히스토리 읽음 표시 실패:', error);
  }
}
