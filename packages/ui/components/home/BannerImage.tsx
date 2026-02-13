'use client';

import Image from 'next/image';
import Link from 'next/link';

type BannerImageProps = {
    imageUrl: string;
    link: string;
    title: string;
    priority?: boolean;
};

const SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px';

export default function BannerImage({ imageUrl, link, title, priority = false }: BannerImageProps) {
    return (
        <section
            className="relative flex w-full shrink-0 overflow-hidden rounded-2xl min-h-[160px] sm:min-h-[200px] md:min-h-[240px] lg:min-h-[293px]"
            aria-label={title}
        >
            {/* 여백(letterbox)을 채우는 블러 레이어 */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <Image
                    src={imageUrl}
                    alt=""
                    fill
                    sizes={SIZES}
                    className="object-cover object-center scale-[1.15]"
                    style={{ filter: 'blur(20px)' }}
                    priority={priority}
                    loading={priority ? undefined : 'lazy'}
                />
            </div>
            {/* 선명한 이미지: contain으로 전체 노출 */}
            <div className="absolute inset-0 rounded-2xl">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes={SIZES}
                    className="object-contain object-center"
                    priority={priority}
                    loading={priority ? undefined : 'lazy'}
                />
            </div>
            <Link
                href={link}
                className="absolute inset-0 z-10"
                aria-label={title}
            />
        </section>
    );
}
