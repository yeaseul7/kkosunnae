import PageTemplate from '@/packages/ui/components/base/PageTemplate';

export default function WritePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-between py-4 px-4 bg-whitesm:items-start">
        <PageTemplate
          visibleHomeTab={false}
          visibleHeaderButtons={false}
        ></PageTemplate>
      </main>
    </div>
  );
}
