import Image from 'next/image';
import Link from 'next/link';

const FOOTER_LINKS = {
  바로가기: [
    { label: '홈', href: '/' },
    { label: '공지사항', href: '/notice' },
    { label: '보호소', href: '/shelter' },
    { label: '커뮤니티', href: '/community' },
  ],
  서비스: [
    { label: '유기동물 보호소', href: '/animalShelter' },
    { label: '검색', href: '/search' },
  ],
} as const;

export default function PageFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-8 py-8 sm:px-12 md:px-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary1/30 rounded">
              <Image
                src="/static/images/textLogo.png"
                alt="꼬순내 로고"
                width={120}
                height={120}
                className="shrink-0"
              />
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-6 sm:gap-x-12">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h3 className="mb-3 text-sm font-bold text-gray-900">{title}</h3>
                <ul className="flex flex-col gap-2">
                  {links.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-xs text-gray-600 hover:text-primary1 hover:underline focus:outline-none focus:ring-2 focus:ring-primary1/30 rounded"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 하단: 저작권 */}
        <div className="mt-8 flex flex-col items-center gap-1 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
          <div>created by lee yeaseul</div>
          <div>© copyright 2025. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
