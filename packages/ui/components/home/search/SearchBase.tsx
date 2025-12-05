'use client';

import { useEffect, useState } from 'react';
import Search from '../../common/Search';
import { getBoardsDataBySearch } from '@/lib/api/post';
import Loading from '../../base/Loading';
import { PostData } from '@/packages/type/postType';
import PostCard from '../../base/PostCard';
import SearchResult from './SearchResult';

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

    return <SearchResult boardsData={boardsData as unknown as PostData[]} />;
  };

  return (
    <div className="flex flex-col justify-center items-center p-8 w-full">
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {resultDom()}
    </div>
  );
}
