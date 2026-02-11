'use client';

import { CardInfoType } from '@/packages/type/cardNewsType';
import { Dispatch, SetStateAction } from 'react';
import { HiHeart, HiAcademicCap, HiClipboardList } from 'react-icons/hi';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';

const CATEGORIES = [
    { id: 'adoption', label: '입양·봉사', icon: HiHeart },
    { id: 'training', label: '훈련·교육', icon: HiAcademicCap },
    { id: 'health', label: '건강·일상', icon: HiClipboardList },
] as const;

const SUMMARY_MAX_LENGTH = 200;

export default function ContentsInfo({ cardInfo, setCardInfo }: { cardInfo: CardInfoType, setCardInfo: Dispatch<SetStateAction<CardInfoType>> }) {
    return (
        <section className="w-full rounded-3xl bg-white px-5 py-3 shadow-sm sm:px-6 sm:py-4 md:px-6 md:py-4">
            {/* 헤더 */}
            <div className="mb-4 flex items-center gap-2 sm:mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-2xl text-primary1">
                    <HiOutlineClipboardDocumentList className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-bold text-gray-900 sm:text-base">
                    콘텐츠 정보
                </h2>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
                {/* 제목 */}
                <div>
                    <label htmlFor="card-title" className="mb-1 block text-xs font-medium text-gray-800">
                        제목
                    </label>
                    <input
                        id="card-title"
                        type="text"
                        value={cardInfo.title}
                        onChange={(e) => setCardInfo({ ...cardInfo, title: e.target.value })}
                        placeholder="제목을 입력하세요 (예: 강아지 산책 시 주의사항)"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-primary1 focus:ring-1 focus:ring-primary1 sm:text-sm mt-1 sm:mt-2"
                    />
                </div>

                {/* 카테고리 */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-800 ">
                        카테고리
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1 sm:mt-2">
                        {CATEGORIES.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setCardInfo({ ...cardInfo, category: id })}
                                className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${cardInfo.category === id
                                    ? 'border-primary1 bg-primary1 text-white'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                    }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 요약 설명 */}
                <div>
                    <label htmlFor="card-summary" className="mb-1 block text-xs font-medium text-gray-800">
                        요약 설명
                    </label>
                    <div className="mt-1 sm:mt-2">
                        <textarea
                            id="card-summary"
                            value={cardInfo.summary}
                            onChange={(e) => setCardInfo({ ...cardInfo, summary: e.target.value.slice(0, SUMMARY_MAX_LENGTH) })}
                            placeholder="카드뉴스에 대한 짧은 설명을 입력해주세요. 리스트 페이지에서 노출됩니다."
                            rows={3}
                            className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-primary1 focus:ring-1 focus:ring-primary1 sm:text-sm"
                        />
                        <p className="mt-1.5 text-right text-[11px] text-gray-400">
                            {cardInfo.summary.length}/{SUMMARY_MAX_LENGTH}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
