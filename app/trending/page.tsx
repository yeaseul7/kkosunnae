import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import TrendingPosts from '@/packages/ui/components/home/trending/TrendingPosts';

export default function Trending() {
  return (
    <div className="flex justify-center items-center min-h-screen font-sans">
      <main className="flex flex-col justify-between items-center px-4 py-4 w-full max-w-6xl min-h-screen bg-whitesm:items-start">
        <PageTemplate>
          <TrendingPosts />
        </PageTemplate>
      </main>
    </div>
  );
}
