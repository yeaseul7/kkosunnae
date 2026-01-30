'use client';

import Link from 'next/link';

export default function Banner2() {
    return (
        <section
            className="relative flex w-full shrink-0 overflow-hidden rounded-2xl bg-sky-50/90 aspect-[3/2] min-h-[200px] sm:aspect-[2/1] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[340px] lg:aspect-auto"
            aria-label="공지사항 배너"
        >
            <div
                className="absolute inset-0 bg-cover bg-no-repeat bg-left"
                style={{
                    backgroundImage: 'url(/static/images/banner2.jpeg)',
                    backgroundPosition: 'left center',
                    backgroundSize: 'cover',
                }}
            />
            <div
                className="absolute inset-0 bg-gradient-to-l from-white/95 via-sky-50/70 to-transparent sm:via-sky-50/50"
                aria-hidden
            />
            <div className="relative flex w-full items-center justify-end px-4 py-6 pr-14 sm:pr-20 sm:px-6 sm:py-8 md:px-8 md:pr-24 md:py-10 lg:min-h-[340px]">
                <div className="max-w-xl min-w-0 text-right">
                    <h2 className="text-base font-semibold leading-snug text-gray-800 sm:text-xl sm:leading-relaxed md:text-2xl lg:text-3xl lg:leading-relaxed">
                        꼬순내에서 공지사항을 전해드립니다🐾
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:mt-3 sm:text-sm md:mt-4 md:text-base lg:text-lg lg:leading-relaxed">
                        업데이트 소식 등 꼬순내에서 전해드리는 소식을 확인해보세요.
                    </p>
                    <Link
                        href="/notice"
                        className="mt-3 inline-block rounded-full bg-primary1 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary2 sm:mt-5 sm:px-5 sm:py-2.5 sm:text-sm md:mt-6 md:px-6 md:py-3 md:text-base"
                    >
                        공지사항 보기
                    </Link>
                </div>
            </div>
        </section>
    );
}
