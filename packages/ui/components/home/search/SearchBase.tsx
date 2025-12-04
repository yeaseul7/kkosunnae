'use client';

import { useEffect, useState } from 'react';
import Search from '../../common/Search';
import { getBoardsDataBySearch } from '@/lib/api/post';
import Loading from '../../base/Loading';
import { PostData } from '@/packages/type/postType';
import PostCard from '../../base/PostCard';

export default function SearchBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [boardsData, setBoardsData] = useState<PostData[]>([]);
  useEffect(() => {
    if (searchQuery.length > 0) {
      const fetchBoardsDataBySearch = async () => {
        setLoading(true);
        const boardsData = await getBoardsDataBySearch(searchQuery);
        setBoardsData(boardsData as PostData[]);
        setLoading(false);
      };
      fetchBoardsDataBySearch();
    }
  }, [searchQuery]);

  const resultDom = () => {
    if (loading) {
      return <Loading />;
    }
    if (boardsData.length === 0) {
      return (
        <div className="flex justify-center items-center py-8 text-gray-500">
          검색 결과가 없습니다.
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-6 pt-8 w-full md:grid-cols-2 lg:grid-cols-3">
        {boardsData.map((board) => (
          <PostCard key={board.id} post={board} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center p-8 w-full">
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {resultDom()}
    </div>
  );
}
