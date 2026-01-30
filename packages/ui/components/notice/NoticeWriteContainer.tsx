'use client';

import { useNoticeWrite } from '@/hooks/useNoticeWrite';
import type { NoticeData } from '@/packages/type/noticeType';
import type { Dispatch, SetStateAction } from 'react';
import WriteHeader from './WriteHeader';
import WriteBody from './WriteBody';
import WriteFooter from './WriteFooter';
import WriteNotice from './wrtieNotice';

interface NoticeWriteContainerProps {
    noticeId?: string;
}

export default function NoticeWriteContainer({ noticeId }: NoticeWriteContainerProps) {
    const {
        noticeData,
        setNoticeData,
        loading,
        saving,
        writing,
        notFound,
    } = useNoticeWrite(noticeId);

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center px-4 py-8">
                <p className="text-gray-500">공지 불러오는 중...</p>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="flex h-full w-full items-center justify-center px-4 py-8">
                <p className="text-gray-500">공지를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="grid h-full min-h-0 w-full flex-1 grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[7fr_3fr] lg:px-8 lg:py-8 sm:px-6 sm:py-6">
            <div className="flex min-h-0 w-full flex-col">
                <div
                    className="flex flex-1 min-h-0 flex-col rounded-2xl bg-white p-4 sm:p-6 lg:p-8"
                    style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.05)' }}
                >
                    <div className="shrink-0 mb-4">
                        <WriteHeader
                            noticeData={noticeData as NoticeData}
                            setNoticeData={setNoticeData as Dispatch<SetStateAction<NoticeData>>}
                        />
                    </div>
                    <div className="flex-1 min-h-0">
                        <WriteBody
                            noticeData={noticeData as NoticeData}
                            setNoticeData={setNoticeData as Dispatch<SetStateAction<NoticeData>>}
                        />
                    </div>
                </div>
                <div className="mt-4 flex w-full shrink-0 items-center justify-end">
                    <WriteFooter writing={writing} saving={saving} />
                </div>
            </div>
            <div className="min-h-0 px-4 sm:px-6 lg:px-8">
                <WriteNotice />
            </div>
        </div>
    );
}
