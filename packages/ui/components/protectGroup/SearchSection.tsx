import Search from "../common/Search";


interface SearchSectionProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function SearchSection({ searchQuery, setSearchQuery }: SearchSectionProps) {
    return (
        <section className="mt-4 sm:mt-5">
            <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex gap-2 w-full">
                    <Search
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        placeholder="단체명 또는 지역으로 검색해보세요"
                        className="flex-1 min-w-0 max-w-none"
                    />
                    <button
                        type="button"
                        className="shrink-0 px-4 py-3 rounded-md bg-primary1 hover:bg-primary2 text-white text-sm font-medium transition-colors"
                    >
                        검색하기
                    </button>
                </div>

            </div>
        </section>
    );
}