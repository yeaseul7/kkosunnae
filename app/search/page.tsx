import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import SearchBase from '@/packages/ui/components/home/search/SearchBase';

export default function Search() {
  return (
    <div className="w-full min-h-screen font-sans bg-white">
      <main className="flex flex-col justify-between items-center w-full min-h-screen bg-whitesm:items-start">
        <PageTemplate visibleHomeTab={false}>
          <SearchBase />
        </PageTemplate>
      </main>
    </div>
  );
}
