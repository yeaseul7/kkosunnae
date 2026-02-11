'use client';

import CardNewsHeader from '@/packages/ui/components/cardNews/cardNewsHeader';
import AdoptionGuide from '@/packages/ui/components/cardNews/AdoptionGuide';
import Training from '@/packages/ui/components/cardNews/Training';
import Health from '@/packages/ui/components/cardNews/Health';
import dynamic from 'next/dynamic';

const PageTemplate = dynamic(
    () => import('@/packages/ui/components/base/PageTemplate'),
    { ssr: true }
);

const PageFooter = dynamic(
    () => import('@/packages/ui/components/base/PageFooter'),
    { ssr: true }
);

export default function CardNewsPage() {
    return (
        <main className="page-container-full">
            <PageTemplate visibleHomeTab={false}>
                <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-6">
                    <CardNewsHeader />
                    <div className="mt-8 flex flex-col gap-10">
                        <AdoptionGuide />
                        <Training />
                        <Health />
                    </div>
                </div>
            </PageTemplate>
            <PageFooter />
        </main>
    );
}
