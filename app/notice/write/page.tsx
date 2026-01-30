'use client';
import NoticeWriteContainer from '@/packages/ui/components/notice/NoticeWriteContainer';
import dynamic from 'next/dynamic';

const PageTemplate = dynamic(
    () => import('@/packages/ui/components/base/PageTemplate'),
    { ssr: true }
);

const PageFooter = dynamic(
    () => import('@/packages/ui/components/base/PageFooter'),
    { ssr: true }
);




export default function NoticeWritePage() {
    return (
        <main className="grid h-screen min-h-screen w-full grid-rows-[1fr_auto]">
            <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
                <PageTemplate
                    visibleHomeTab={false}
                    visibleHeaderButtons={false}
                >
                    <div className="flex h-full min-h-0 flex-col w-full">
                        <NoticeWriteContainer />
                    </div>
                </PageTemplate>
            </div>
            <PageFooter />
        </main>
    );
}
