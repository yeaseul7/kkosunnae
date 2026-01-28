import { Suspense } from 'react';
import AbandonedCardSkeleton from '../../base/AbandonedCardSkeleton';
import ShelterPostsClient from './ShelterPostsClient';

async function ShelterPostsContent() {



  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
    'http://localhost:3001';

  const params = new URLSearchParams();
  params.append('pageNo', '1');
  params.append('numOfRows', '30');

  const response = await fetch(`${baseUrl}/api/shelter-data?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch shelter data');
  }

  const shelterAnimalResponse = await response.json();
  const items = shelterAnimalResponse?.response?.body?.items?.item;
  const itemsArray = items ? (Array.isArray(items) ? items : [items]) : [];
  const hasMore = itemsArray.length === 30;

  const initialData = {
    items: itemsArray,
    hasMore,
  };

  return <ShelterPostsClient initialData={initialData} />;
}

function ShelterPostsSkeleton() {
  return (
    <>
      <div className="h-20 bg-gray-50 animate-pulse mb-4" />
      <div className="grid grid-cols-1 gap-2 pt-8 w-full px-4 sm:px-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
        {Array.from({ length: 12 }).map((_, index) => (
          <AbandonedCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    </>
  );
}

export default function ShelterPostsServer() {
  return (
    <Suspense fallback={<ShelterPostsSkeleton />}>
      <ShelterPostsContent />
    </Suspense>
  );
}
