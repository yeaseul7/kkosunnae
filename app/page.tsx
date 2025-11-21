'use client';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import { app } from '@/lib/firebase/firebase';

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen font-sans bg-zinc-50">
      <main className="flex flex-col justify-between items-center px-4 py-4 w-full max-w-6xl min-h-screen bg-whitesm:items-start">
        <PageTemplate></PageTemplate>
      </main>
    </div>
  );
}
