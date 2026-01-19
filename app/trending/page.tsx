import PageFooter from '@/packages/ui/components/base/PageFooter';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import TrendingPosts from '@/packages/ui/components/home/trending/TrendingPosts';

export default function Trending() {
  return (
    <div className="flex justify-center items-center min-h-screen font-sans bg-white">
      <main className="flex flex-col justify-between items-center w-full max-w-6xl min-h-screen bg-whitesm:items-start">
        <PageTemplate>
          <TrendingPosts />
        </PageTemplate>
        <PageFooter />
      </main>
    </div>
  );
}
