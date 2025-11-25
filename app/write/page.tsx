import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import WriteContainer from '@/packages/ui/components/home/write/WriteContainer';

export default function WritePage() {
  return (
    <div className="flex justify-center items-center h-screen font-sans bg-white">
      <main className="flex flex-col items-center px-4 py-4 w-full max-w-6xl h-full bg-whitesm:items-start">
        <PageTemplate
          visibleHomeTab={false}
          visibleHeaderButtons={false}
        ></PageTemplate>
        <WriteContainer className="flex-1 p-4 w-full" />
      </main>
    </div>
  );
}
