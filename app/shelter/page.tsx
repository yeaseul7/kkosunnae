import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import ShelterPosts from '@/packages/ui/components/home/shelter/ShelterPosts';

export default function Shelter() {
  return (
    <div className="w-full min-h-screen font-sans bg-white">
      <main className="flex flex-col justify-between items-center w-full min-h-screen bg-whitesm:items-start">
        <PageTemplate visibleHomeTab={false}>
          <ShelterPosts />
        </PageTemplate>
      </main>
    </div>
  );
}
