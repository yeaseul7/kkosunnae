import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import ShelterPostsServer from '@/packages/ui/components/home/shelter/ShelterPostsServer';

export default function Shelter() {
  return (
    <main className="page-container-full">
      <PageTemplate visibleHomeTab={false}>
        <ShelterPostsServer />
      </PageTemplate>
    </main>
  );
}
