import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import ShelterPosts from '@/packages/ui/components/home/shelter/ShelterPosts';

export default function Shelter() {
  return (
    <div className="flex justify-center items-center min-h-screen font-sans bg-white">
      <main className="flex flex-col justify-between items-center px-4 py-4 w-full max-w-6xl min-h-screen bg-whitesm:items-start">
        <PageTemplate visibleHomeTab={false}>
          <ShelterPosts />
        </PageTemplate>
      </main>
    </div>
  );
}
