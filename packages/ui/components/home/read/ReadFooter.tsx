import { PostData } from '@/packages/type/postType';
import WriteComment from '../comment/WriteComment';
import CommentList from '../comment/CommentList';

export default function ReadFooter({
  postId,
}: {
  post: PostData;
  postId: string;
}) {
  return (
    <div className="flex flex-col w-full">
      <CommentList postId={postId} />
      <WriteComment postId={postId} />
    </div>
  );
}
