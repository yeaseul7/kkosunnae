import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { PostData } from '@/packages/type/postType';

// 작성자 정보 캐시 (메모리 캐시, 세션 동안 유지)
const authorInfoCache = new Map<
  string,
  { nickname: string; photoURL: string | null; cachedAt: number }
>();

const CACHE_TTL = 5 * 60 * 1000; // 5분 캐시

// 작성자 정보를 가져와서 게시물 데이터에 추가하는 헬퍼 함수 (export하여 다른 곳에서도 사용 가능)
export async function enrichPostsWithAuthorInfo(
  posts: PostData[],
): Promise<PostData[]> {
  if (posts.length === 0) {
    return posts;
  }

  // 고유한 authorId 추출 (유효한 authorId만)
  const uniqueAuthorIds = [
    ...new Set(
      posts.filter((post) => post.authorId).map((post) => post.authorId),
    ),
  ];

  if (uniqueAuthorIds.length === 0) {
    return posts;
  }

  // 캐시에서 가져오거나 Firestore에서 조회
  const authorInfoMap = new Map<
    string,
    { nickname: string; photoURL: string | null }
  >();
  const now = Date.now();
  const authorIdsToFetch: string[] = [];

  // 캐시 확인
  uniqueAuthorIds.forEach((authorId) => {
    const cached = authorInfoCache.get(authorId);
    if (cached && now - cached.cachedAt < CACHE_TTL) {
      authorInfoMap.set(authorId, {
        nickname: cached.nickname,
        photoURL: cached.photoURL,
      });
    } else {
      authorIdsToFetch.push(authorId);
    }
  });

  // 캐시에 없는 작성자 정보만 병렬로 가져오기
  if (authorIdsToFetch.length > 0) {
    await Promise.all(
      authorIdsToFetch.map(async (authorId) => {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', authorId));
          let authorInfo: { nickname: string; photoURL: string | null };

          if (userDoc.exists()) {
            const userData = userDoc.data();
            authorInfo = {
              nickname: userData?.nickname || userData?.displayName || '',
              photoURL: userData?.photoURL || null,
            };
            // 개발 환경에서만 로그 출력
            if (process.env.NODE_ENV === 'development') {
              console.log(`작성자 ${authorId} 정보 가져오기 성공:`, {
                nickname: authorInfo.nickname,
                hasPhoto: !!authorInfo.photoURL,
              });
            }
          } else {
            // Firestore에 문서가 없으면 기본값 설정
            console.warn(
              `작성자 ${authorId}의 users 문서가 존재하지 않습니다.`,
            );
            authorInfo = {
              nickname: '',
              photoURL: null,
            };
          }

          // 캐시에 저장
          authorInfoCache.set(authorId, {
            ...authorInfo,
            cachedAt: now,
          });
          authorInfoMap.set(authorId, authorInfo);
        } catch (error) {
          // 권한 오류인 경우 상세 로그 출력
          const firebaseError = error as { code?: string; message?: string };
          if (firebaseError?.code === 'permission-denied') {
            console.warn(
              `작성자 ${authorId} 정보 가져오기 권한 오류:`,
              'Firestore 규칙이 아직 배포되지 않았거나, users 컬렉션에 대한 읽기 권한이 없습니다.',
              'Firebase 콘솔에서 firestore.rules를 배포했는지 확인하세요.',
            );
          } else {
            console.error(`작성자 ${authorId} 정보 가져오기 실패:`, error);
          }
          const defaultInfo = {
            nickname: '',
            photoURL: null,
          };
          // 권한 오류도 캐시에 저장하여 반복 요청 방지 (단기간)
          authorInfoCache.set(authorId, {
            ...defaultInfo,
            cachedAt: now,
          });
          authorInfoMap.set(authorId, defaultInfo);
        }
      }),
    );
  }

  // 게시물 데이터에 작성자 정보 추가
  return posts.map((post) => {
    if (!post.authorId) {
      return post;
    }

    const authorInfo = authorInfoMap.get(post.authorId);
    if (authorInfo) {
      return {
        ...post,
        authorName: authorInfo.nickname || post.authorName || '',
        authorPhotoURL: authorInfo.photoURL ?? post.authorPhotoURL ?? null,
      };
    }

    // 작성자 정보를 가져오지 못한 경우 기존 값 유지
    return post;
  });
}

export async function getBoardsData(): Promise<PostData[]> {
  const boardsCol = collection(firestore, 'boards');
  const boardsSnapshot = await getDocs(boardsCol);
  const boardsList = boardsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PostData[];

  return await enrichPostsWithAuthorInfo(boardsList);
}

// 최근 게시물만 가져오는 API
export async function getRecentBoardsData(
  limitCount: number = 20,
): Promise<PostData[]> {
  const boardsCol = collection(firestore, 'boards');
  const q = query(boardsCol, orderBy('createdAt', 'desc'), limit(limitCount));
  const boardsSnapshot = await getDocs(q);
  const boardsList = boardsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PostData[];

  return await enrichPostsWithAuthorInfo(boardsList);
}

export async function getTrendingBoardsData(
  limitCount: number = 20,
): Promise<PostData[]> {
  try {
    const boardsCol = collection(firestore, 'boards');
    const q = query(
      boardsCol,
      orderBy('createdAt', 'desc'),
      limit(Math.min(limitCount * 5, 100)),
    );
    const boardsSnapshot = await getDocs(q);
    const boardsList = boardsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PostData[];

    const BATCH_SIZE = 20;
    const postsWithCommentCount: Array<{
      post: PostData;
      commentCount: number;
      engagementScore: number;
    }> = [];

    for (let i = 0; i < boardsList.length; i += BATCH_SIZE) {
      const batch = boardsList.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (post) => {
          try {
            const commentsCollection = collection(
              firestore,
              'boards',
              post.id,
              'comments',
            );
            const commentsSnapshot = await getDocs(commentsCollection);
            const commentCount = commentsSnapshot.size;
            const likes = post.likes || 0;
            const engagementScore = likes + commentCount;

            return {
              post,
              commentCount,
              engagementScore,
            };
          } catch (error) {
            console.error(
              `게시물 ${post.id}의 댓글 개수 가져오기 실패:`,
              error,
            );
            return {
              post,
              commentCount: 0,
              engagementScore: post.likes || 0,
            };
          }
        }),
      );
      postsWithCommentCount.push(...batchResults);
    }

    postsWithCommentCount.sort((a, b) => b.engagementScore - a.engagementScore);

    const sortedPosts = postsWithCommentCount
      .slice(0, limitCount)
      .map((item) => item.post);

    return await enrichPostsWithAuthorInfo(sortedPosts);
  } catch (error) {
    console.error('트렌딩 게시물 조회 중 오류 발생:', error);
    return [];
  }
}

export async function getBoardsDataBySearch(
  searchQuery: string,
): Promise<PostData[]> {
  if (!searchQuery?.trim()) {
    return [];
  }

  const trimmedQuery = searchQuery.trim();
  const boardsCol = collection(firestore, 'boards');
  const endQuery = trimmedQuery + '\uf8ff';

  try {
    const titleQuery = query(
      boardsCol,
      where('title', '>=', trimmedQuery),
      where('title', '<=', endQuery),
    );

    const tagQuery = query(
      boardsCol,
      where('tags', 'array-contains', trimmedQuery),
    );

    const [titleSnapshot, tagSnapshot] = await Promise.all([
      getDocs(titleQuery),
      getDocs(tagQuery),
    ]);

    const boardsMap = new Map<string, PostData>();

    titleSnapshot.forEach((doc) => {
      boardsMap.set(doc.id, { id: doc.id, ...doc.data() } as PostData);
    });

    tagSnapshot.forEach((doc) => {
      boardsMap.set(doc.id, { id: doc.id, ...doc.data() } as PostData);
    });

    const filteredBoards = Array.from(boardsMap.values());

    filteredBoards.sort((a: PostData, b: PostData) => {
      const aTime = a.createdAt?.toMillis() || 0;
      const bTime = b.createdAt?.toMillis() || 0;
      return bTime - aTime; // 내림차순
    });

    return await enrichPostsWithAuthorInfo(filteredBoards);
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return [];
  }
}
