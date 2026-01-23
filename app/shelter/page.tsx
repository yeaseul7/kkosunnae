import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import ShelterPosts from '@/packages/ui/components/home/shelter/ShelterPosts';

export default function Shelter() {
  return (
    <main className="page-container-full">
      <PageTemplate visibleHomeTab={false}>
        <ShelterPosts />
      </PageTemplate>
    </main>
  );
}
