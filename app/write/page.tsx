import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import WriteContainer from '@/packages/ui/components/home/write/WriteContainer';

export default function WritePage() {
  return (
    <main className="page-container-full">
      <PageTemplate
        visibleHomeTab={false}
        visibleHeaderButtons={false}
      >
        <div className="flex flex-col w-full h-full min-h-0">
          <WriteContainer className="flex-1 min-h-0 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 w-full" />
        </div>
      </PageTemplate>
    </main>
  );
}
