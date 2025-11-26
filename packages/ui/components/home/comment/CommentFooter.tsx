import { BsHeart, BsHeartFill, BsPlusSquare } from 'react-icons/bs';

export default function CommentFooter() {
  return (
    <div className="flex gap-2 items-center mt-4">
      <button className="flex gap-1 items-center text-primary1">
        <BsPlusSquare />
        답글
      </button>
      <button className="flex gap-1 items-center text-primary1">
        <BsHeart />
        좋아요
      </button>
      <button className="flex gap-1 items-center text-primary1">
        <BsHeartFill />
      </button>
    </div>
  );
}
