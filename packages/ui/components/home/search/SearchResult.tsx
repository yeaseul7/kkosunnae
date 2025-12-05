import { PostData } from '@/packages/type/postType';
import PostCard from '../../base/PostCard';

export default function SearchResult({
  boardsData,
}: {
  boardsData: PostData[];
}) {
  return (
    <div className="mt-8 w-full">
      <div>검색 결과 {boardsData.length}개</div>
      {boardsData.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 pt-8 w-full md:grid-cols-2 lg:grid-cols-3">
          {boardsData.map((board) => (
            <PostCard key={board.id} post={board} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-8 text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
