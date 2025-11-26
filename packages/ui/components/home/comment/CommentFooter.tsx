import { CommentData } from '@/packages/type/commentType';
import { BsHeart, BsHeartFill, BsPlusSquare } from 'react-icons/bs';

export default function CommentFooter({
  commentData,
}: {
  commentData: CommentData;
}) {
  return (
    <div className="flex gap-2 justify-between items-center mt-4">
      <button className="flex gap-1 items-center text-primary1">
        <BsPlusSquare />
        답글
      </button>
      <div className="flex gap-2 items-center">
        <button className="flex gap-1 items-center text-primary1">
          <BsHeart />
        </button>
      </div>
    </div>
  );
}
