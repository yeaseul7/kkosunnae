'use client';

import { useRef } from 'react';
import { MdPhotoCamera, MdSearch, MdFavorite, MdAutoAwesome } from 'react-icons/md';

export interface AiHeaderProps {
    previewUrl: string | null;
    searchLoading: boolean;
    modelReady?: boolean;
    dailyAiUsed?: number | null;
    dailyLimit?: number;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    onLoadModel?: () => void;
}

export default function AiHeader({
    previewUrl,
    searchLoading,
    modelReady = false,
    dailyAiUsed = null,
    dailyLimit = 3,
    onFileChange,
    onSearch,
    onLoadModel,
}: AiHeaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {/* 헤더: AI 친구 찾기 + 설명 */}
            <header className="text-center mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    AI 스마트 검색
                </h1>
                {dailyAiUsed != null && (
                    <p className="text-xs text-gray-500 mb-2">
                        오늘 <span className="font-semibold text-primary1">{dailyAiUsed}</span>/{dailyLimit}회 사용
                    </p>
                )}
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
                    AI가 보호소 공고를 분석하여 우리 아이와 가장 닮은 친구를 찾아드립니다.
                    <br className="hidden sm:block" />
                    <span className="text-primary1 font-medium">2026년 2월 5일</span>, 소중한 인연을 위한 데이터 업데이트를 시작했습니다.
                </p>
            </header>

            {/* 메인 카드: 업로드 영역 + 가이드 + 검색 버튼 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row md:min-h-[320px]">
                    {/* 왼쪽: 이미지 업로드 */}
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                fileInputRef.current?.click();
                            }
                        }}
                        className="flex flex-1 min-h-[200px] md:min-h-0 p-8 md:p-10 flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onFileChange}
                            className="sr-only"
                            aria-label="강아지/고양이 사진 업로드"
                        />
                        <div className="relative w-full h-full min-h-[180px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 hover:border-primary1 hover:bg-primary1/5 transition-colors overflow-hidden">
                            {previewUrl ? (
                                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={previewUrl} alt="업로드한 사진" className="w-full h-full object-contain" />
                                </div>
                            ) : (
                                <>
                                    <div className="relative mb-4">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center ring-4 ring-gray-200">
                                            <MdPhotoCamera className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                                        </div>
                                        <span className="absolute -top-0.5 -right-0.5 w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-blue-500 text-sm font-bold shadow-sm">
                                            +
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-800 mb-1">
                                        이미지 업로드
                                    </p>
                                    <p className="text-sm text-gray-500 text-center px-4">
                                        드래그 앤 드롭 하거나 클릭하여 사진을 추가하세요
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium w-fit mb-6">
                                <MdAutoAwesome className="w-4 h-4 shrink-0" />
                                <span>AI 스마트 검색 가이드</span>
                            </div>
                            <ol className="space-y-4">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                                        1
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-900">아이의 사진 업로드</p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            얼굴과 전신이 잘 보이는 밝은 사진일수록 정확도가 높아져요.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                                        2
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-900">AI 분석</p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            인공지능이 사진 속 동물의 특징을 추출합니다.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                                        3
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-900">닮은 친구 확인</p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            전국 보호소 공고 중 유사도가 높은 친구들을 보여드립니다.
                                        </p>
                                    </div>
                                </li>
                            </ol>
                        </div>
                        <div className="mt-6 flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={onSearch}
                                disabled={!previewUrl || searchLoading}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary1 hover:bg-primary1/90 text-white font-medium py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <MdSearch className="w-5 h-5 shrink-0" />
                                {searchLoading ? '검색 중...' : '검색하기'}
                            </button>
                            {!modelReady && !searchLoading && onLoadModel && (
                                <button
                                    type="button"
                                    onClick={onLoadModel}
                                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                                >
                                    AI 모델 로드하기
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
