'use client';

import Link from 'next/link';

type BannerImageProps = {
    imageUrl: string;
    link: string;
    title: string;
};
export default function BannerImage({ imageUrl, link, title }: BannerImageProps) {
    return (
        <section
            className="relative flex w-full shrink-0 overflow-hidden rounded-2xl min-h-[160px] sm:min-h-[200px] md:min-h-[240px] lg:min-h-[293px]"
            aria-label={title}
        >
            {/* 여백(letterbox)을 채우는 블러 레이어 - 항상 표시 */}
            <div
                className="absolute inset-0 bg-cover bg-no-repeat bg-center"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    filter: 'blur(20px)',
                    transform: 'scale(1.15)',
                }}
            />
            {/* 선명한 이미지: contain으로 전체 노출, 빈 공간에는 블러가 비침 */}
            <div
                className="absolute inset-0 bg-no-repeat bg-center bg-contain"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <Link
                href={link}
                className="absolute inset-0 z-10"
                aria-label={title}
            />
        </section>
    );
}
