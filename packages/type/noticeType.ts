import { Timestamp } from "firebase/firestore";

export interface NoticeData {
    id: string;
    title: string;
    content: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    category?: string;
}

export interface NoticeListItem {
    id: string;
    title: string;
    createdAt: Timestamp;
    /** [공지], [이벤트], [안내] 등 */
    category?: string;
    /** 작성자 표시명 (운영진, 이벤트팀 등) */
    authorName?: string;
    /** view 서브컬렉션 문서 개수 (조회수) */
    viewCount?: number;
}