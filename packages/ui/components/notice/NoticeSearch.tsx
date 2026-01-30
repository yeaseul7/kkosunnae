import Image from "next/image";

interface NoticeSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function NoticeSearch({ searchQuery, setSearchQuery }: NoticeSearchProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    return (
        <div className="relative w-full">
            <div className="flex items-center px-3 sm:px-4 w-full h-9 sm:h-10 md:h-12 bg-white border border-gray-300 rounded-full shadow-sm focus-within:border-primary1 focus-within:ring-2 focus-within:ring-primary1/20 transition-all">
                <Image
                    src="/static/svg/icon-search-3.svg"
                    alt="Search"
                    width={18}
                    height={18}
                    className="mr-1.5 h-4 w-4 shrink-0 text-gray-400 sm:mr-3 sm:h-5 sm:w-5"
                />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="공지사항을 검색하세요"
                    className="flex-1 w-full text-xs placeholder-gray-400 text-gray-900 bg-transparent border-none outline-none sm:text-sm"
                />
            </div>
        </div>
    );
}