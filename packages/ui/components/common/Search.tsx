import Image from 'next/image';

export default function Search({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <div className="relative w-full max-w-2xl">
      <div className="flex items-center px-4 w-full h-12 bg-white border border-gray-300 rounded-md shadow-sm focus-within:border-[#1257b8] focus-within:ring-1 focus-within:ring-[#1257b8] transition-all">
        <Image
          src="/static/svg/icon-search-3.svg"
          alt="Search"
          width={20}
          height={20}
          className="mr-3 text-gray-400 shrink-0"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="flex-1 w-full text-sm placeholder-gray-400 text-gray-900 bg-transparent border-none outline-none"
        />
      </div>
    </div>
  );
}
