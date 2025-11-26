'use client';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import EditContainer from '@/packages/ui/components/home/edit/editContainer';

export default function EditPostPage() {
  return (
    <div className="flex justify-center items-center h-screen font-sans bg-white">
      <main className="flex flex-col items-center px-4 py-4 w-full max-w-6xl h-full">
        <PageTemplate
          visibleHeaderButtons={false}
          visibleHomeTab={false}
        ></PageTemplate>
        <EditContainer className="flex flex-col p-4 w-full h-full min-h-0" />
      </main>
    </div>
  );
}
