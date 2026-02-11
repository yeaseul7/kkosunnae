import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';

export default function WriteHeader() {
    return (
        <header className="w-full bg-gray-50">
            <div className="py-4 sm:py-5">
                <div className="flex items-start gap-2 sm:gap-3">
                    <Link
                        href="/card_news"
                        className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                        aria-label="뒤로 가기"
                    >
                        <HiArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-base font-bold text-gray-900 sm:text-lg md:text-xl lg:text-2xl tracking-tight">
                            카드뉴스 등록하기
                        </h1>
                        <p className="mt-1.5 text-xs text-gray-600 sm:text-sm">
                            새로운 정보를 담은 카드뉴스를 작성하고 커뮤니티에 공유해보세요.
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}