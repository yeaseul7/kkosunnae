'use client';

import Link from 'next/link';

export default function Banner1() {
    return (
        <section
            className="relative flex w-full shrink-0 overflow-hidden rounded-2xl bg-amber-50/90 aspect-[3/2] min-h-[200px] sm:aspect-[2/1] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[340px] lg:aspect-auto"
            aria-label="보호소 안내 배너"
        >
            <div
                className="absolute inset-0 bg-cover bg-no-repeat bg-right"
                style={{
                    backgroundImage: 'url(/static/images/banner1.jpeg)',
                    backgroundPosition: 'right center',
                    backgroundSize: 'cover',
                }}
            />
            <div
                className="absolute inset-0 bg-gradient-to-r from-white/90 via-amber-50/70 to-transparent sm:via-amber-50/50"
                aria-hidden
            />
            <div className="relative flex w-full items-center px-4 py-6 pl-14 sm:pl-20 sm:px-6 sm:py-8 md:px-8 md:pl-24 md:py-10 lg:min-h-[340px]">
                <div className="max-w-xl min-w-0">
                    <h2 className="text-base font-semibold leading-snug text-gray-800 sm:text-xl sm:leading-relaxed md:text-2xl lg:text-3xl lg:leading-relaxed">
                        오늘 하루를 꼬순내로
                        <br />
                        채워주시겠어요?
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:mt-3 sm:text-sm md:mt-4 md:text-base lg:text-lg lg:leading-relaxed">
                        당신이 내어준 시간이 모여, 아이들에게는 기적 같은 봄이 됩니다.
                    </p>
                    <Link
                        href="/animalShelter"
                        className="mt-3 inline-block rounded-full bg-primary1 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary2 sm:mt-5 sm:px-5 sm:py-2.5 sm:text-sm md:mt-6 md:px-6 md:py-3 md:text-base"
                    >
                        보호소 정보 확인하기
                    </Link>
                </div>
            </div>
        </section>
    );
}
