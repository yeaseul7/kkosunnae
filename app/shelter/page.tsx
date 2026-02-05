import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import ShelterPostsServer from '@/packages/ui/components/home/shelter/ShelterPostsServer';
import PreloadSearchModel from './PreloadSearchModel';

export default function Shelter() {
  return (
    <main className="page-container-full">
      <PageTemplate visibleHomeTab={false}>
        <PreloadSearchModel />
        <ShelterPostsServer />
      </PageTemplate>
    </main>
  );
}
