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
      <WriteComment postId={postId} />
      <CommentList postId={postId} />
    </div>
  );
}
