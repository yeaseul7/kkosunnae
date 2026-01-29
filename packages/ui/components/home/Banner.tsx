'use client';

import Link from 'next/link';

export default function Banner() {
    return (
        <section
            className="relative w-full overflow-hidden rounded-2xl bg-amber-50/90 mt-4"
            aria-label="홈 배너"
        >
            <div
                className="absolute inset-0 bg-cover bg-right bg-no-repeat"
                style={{
                    backgroundImage: 'url(/static/images/banner1.jpeg)',
                    backgroundPosition: 'right center',
                }}
            />
            <div
                className="absolute inset-0 bg-gradient-to-r from-white/90 via-amber-50/70 to-transparent sm:via-amber-50/50"
                aria-hidden
            />
            <div className="relative flex min-h-[200px] w-full max-w-7xl items-center px-4 py-8 sm:min-h-[260px] sm:px-6 sm:py-10 md:min-h-[300px] md:px-8 lg:min-h-[340px]">
                <div className="max-w-xl">
                    <h2 className="text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-relaxed md:text-2xl lg:text-3xl lg:leading-relaxed">
                        오늘 하루를 꼬순내로
                        <br />
                        채워주시겠어요?
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base md:text-lg md:leading-relaxed">
                        당신이 내어준 시간이 모여, 아이들에게는 기적 같은 봄이 됩니다.
                    </p>
                    <Link
                        href="/animalShelter"
                        className="mt-5 inline-block rounded-full bg-primary1 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary2 sm:mt-6 sm:px-6 sm:py-3 sm:text-base"
                    >
                        보호소 정보 확인하기
                    </Link>
                </div>
            </div>
        </section>
    );
}
