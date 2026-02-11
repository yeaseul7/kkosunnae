import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';

export default function ProtectionGroupHeader() {
    return (
        <header className="w-full pt-0 pb-1">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-3xl tracking-tight">
                    동물 보호 단체 및 협회
                </h1>
                <div className="mt-2 flex flex-col gap-3 sm:mt-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4 md:mt-4">
                    <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                        <p className="text-xs text-gray-600 sm:text-sm md:text-base">
                            전국의 동물 권리 향상을 위해 노력하는 주요 단체들을 소개합니다.
                        </p>
                        <p className="text-xs text-gray-600 sm:text-sm md:text-base">
                            구조 활동부터 정책 제안까지, 생명 존중을 실천하는 파트너들과 함께하세요.
                        </p>
                    </div>
                    <Link
                        href="/protectionGroup/register"
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary1/10 px-4 py-2.5 text-sm font-medium text-primary1 hover:bg-primary1/20 transition-colors sm:py-2"
                    >
                        <HiPlus className="w-4 h-4 shrink-0" />
                        단체 등록 신청
                    </Link>
                </div>
            </div>
        </header>
    );
}