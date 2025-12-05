import { CommentData } from '@/packages/type/commentType';
import { Timestamp } from 'firebase/firestore';
import CommentHeader from './CommentHeader';
import CommentFooter from './CommentFooter';

export default function CommentContainer({
  commentData,
  postId,
}: {
  commentData: CommentData;
  postId: string;
}) {
  const { authorName, createdAt, content } = commentData;

  return (
    <div className="flex flex-col flex-1 gap-1">
      <div className="flex gap-2 items-center">
        <CommentHeader commentData={commentData} postId={postId} />
      </div>
      <p className="text-sm text-gray-700 whitespace-pre-wrap">{content}</p>
      <div>
        <CommentFooter commentData={commentData} postId={postId} />
      </div>
    </div>
  );
}
