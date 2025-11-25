import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

export async function getBoardsData() {
  const boardsCol = collection(firestore, 'boards'); // 'boards' 컬렉션 참조 생성
  const boardsSnapshot = await getDocs(boardsCol); // 모든 문서 스냅샷 가져오기
  const boardsList = boardsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })); // 데이터 추출

  return boardsList;
}

// 최근 게시물만 가져오는 API
export async function getRecentBoardsData(limitCount: number = 20) {
  const boardsCol = collection(firestore, 'boards');
  const q = query(boardsCol, orderBy('createdAt', 'desc'), limit(limitCount));
  const boardsSnapshot = await getDocs(q);
  const boardsList = boardsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return boardsList;
}

// 좋아요가 많은 순서대로 가져오는 API
export async function getTrendingBoardsData(limitCount: number = 20) {
  const boardsCol = collection(firestore, 'boards');
  const q = query(boardsCol, orderBy('likes', 'desc'), limit(limitCount));
  const boardsSnapshot = await getDocs(q);
  const boardsList = boardsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return boardsList;
}
