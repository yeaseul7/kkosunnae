'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { HiHeart } from 'react-icons/hi2';
import { HiChatBubbleLeft } from 'react-icons/hi2';
import { HiMapPin } from 'react-icons/hi2';
import { PostData, ShelterAnimalItem } from '@/packages/type/postType';
import {
  formatDate,
  formatDateToKorean,
} from '@/packages/utils/dateFormatting';
import getOptimizedCloudinaryUrl from '@/packages/utils/optimization';
import UserProfile from '../common/UserProfile';
import { FaPaw } from 'react-icons/fa';

export default function AbandonedCard({
  shelterAnimal,
}: {
  shelterAnimal: ShelterAnimalItem;
}) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLongHover, setIsLongHover] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 모든 사용 가능한 이미지 URL 배열 생성
  const availableImages = useMemo(() => {
    const images: string[] = [];
    for (let i = 1; i <= 8; i++) {
      const popfile = shelterAnimal[
        `popfile${i}` as keyof ShelterAnimalItem
      ] as string | undefined;
      if (popfile && typeof popfile === 'string' && popfile.trim() !== '') {
        images.push(popfile);
      }
    }
    return images;
  }, [shelterAnimal]);

  // 현재 이미지 URL
  const currentImageUrl = useMemo(() => {
    if (availableImages.length === 0) return null;
    if (currentImageIndex >= availableImages.length) return null;
    return availableImages[currentImageIndex];
  }, [availableImages, currentImageIndex]);

  const thumbnailImage = useMemo(() => {
    if (!currentImageUrl) return null;
    // Cloudinary 이미지가 아닌 경우(외부 이미지)는 최적화하지 않음
    if (currentImageUrl.includes('res.cloudinary.com')) {
      return getOptimizedCloudinaryUrl(currentImageUrl, 150, 150);
    }
    // 외부 이미지는 그대로 사용 (Next.js Image의 unoptimized 옵션 사용)
    return currentImageUrl;
  }, [currentImageUrl]);

  // 외부 이미지인지 확인 (Cloudinary가 아닌 경우)
  const isExternalImage = useMemo(() => {
    return currentImageUrl && !currentImageUrl.includes('res.cloudinary.com');
  }, [currentImageUrl]);

  // 이미지 로드 실패 시 다음 이미지 시도
  const handleImageError = useCallback(() => {
    if (currentImageIndex < availableImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  }, [currentImageIndex, availableImages.length]);

  // shelterAnimal이 변경되면 이미지 인덱스 초기화
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [shelterAnimal.desertionNo]);

  const defaultImage = useMemo(() => {
    if (shelterAnimal.upKindNm === '417000') {
      return '/static/images/defaultDogImg.png';
    }
    if (shelterAnimal.kindCd === '422400') {
      return '/static/images/defaultCatImg.png';
    }
    return '/static/images/defaultDogImg.png';
  }, []);

  // 이미지가 없거나 모든 이미지가 실패한 경우 기본 이미지 사용
  const displayImage = useMemo(() => {
    if (
      availableImages.length === 0 ||
      currentImageIndex >= availableImages.length
    ) {
      return defaultImage;
    }
    return thumbnailImage || defaultImage;
  }, [availableImages.length, currentImageIndex, thumbnailImage, defaultImage]);

  // 상태 뱃지 스타일 결정
  const statusBadge = useMemo(() => {
    return {
      text: shelterAnimal?.processState || '상태 미확인',
      bgColor: 'bg-primary2',
      textColor: 'text-white',
    };
  }, [shelterAnimal?.processState]);

  // 공고종료일 뱃지 계산
  const noticeEndBadge = useMemo(() => {
    if (!shelterAnimal?.noticeEdt) return null;

    // YYYYMMDD 형식을 Date로 변환
    const noticeEdtStr = shelterAnimal.noticeEdt;
    const year = parseInt(noticeEdtStr.substring(0, 4));
    const month = parseInt(noticeEdtStr.substring(4, 6)) - 1; // 월은 0부터 시작
    const day = parseInt(noticeEdtStr.substring(6, 8));
    const endDate = new Date(year, month, day);
    
    // 오늘 날짜 (시간 제외)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    // 날짜 차이 계산 (밀리초를 일로 변환)
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      // 지난 경우
      return {
        text: '공고 종료',
        bgColor: 'bg-gray-400',
        textColor: 'text-white',
      };
    } else if (diffDays === 0) {
      // 오늘 종료
      return {
        text: '오늘 종료',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
      };
    } else if (diffDays === 1) {
      // 1일 전
      return {
        text: '1일 전',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
      };
    } else if (diffDays <= 7) {
      // 1주일 이하 (2일~7일)
      return {
        text: `${diffDays}일 전`,
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
      };
    } else {
      // 1주일 초과
      return {
        text: `${diffDays}일 전`,
        bgColor: 'bg-primary2',
        textColor: 'text-white',
      };
    }
  }, [shelterAnimal?.noticeEdt]);
  const openGoogleMap = useCallback((e: React.MouseEvent, address: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, '_blank');
  }, []);

  // hover 시작 시 1초 후 상태 변경
  const handleMouseEnter = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsLongHover(true);
    }, 1000);
  }, []);

  // hover 종료 시 상태 초기화
  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsLongHover(false);
  }, []);

  // 컴포넌트 언마운트 시 timeout 정리
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <article
      key={shelterAnimal.desertionNo}
      onClick={() => router.push(`/read/${shelterAnimal.desertionNo}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex overflow-hidden flex-col bg-white rounded-lg shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98] w-full max-w-[260px] border border-gray-100"
    >
      <div className="relative w-full bg-gray-100 aspect-[4/5] overflow-hidden">
        <Image
          src={displayImage}
          alt={shelterAnimal?.desertionNo || '유기동물 이미지'}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
          unoptimized={
            isExternalImage || displayImage === defaultImage || undefined
          }
          loading="lazy"
          onError={handleImageError}
        />
        {/* 상태 뱃지 */}
        {shelterAnimal?.processState && (
          <div
            className={`absolute top-2 right-2 ${statusBadge.bgColor} ${statusBadge.textColor} px-2 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm bg-opacity-90`}
          >
            {statusBadge.text}
          </div>
        )}
        {/* 공고종료일 뱃지 */}
        {noticeEndBadge && (
          <div
            className={`absolute top-2 left-2 ${noticeEndBadge.bgColor} ${noticeEndBadge.textColor} px-2 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm bg-opacity-90`}
          >
            {noticeEndBadge.text}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 gap-1 relative">
        {/* 기본 정보 - 높이 유지하며 부드러운 fade out */}
        <div
          className={`flex flex-col gap-1 transition-opacity duration-300 ease-in-out ${
            isLongHover ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-medium text-gray-400">
                구조 위치
              </label>
              <button
                onClick={(e) =>
                  openGoogleMap(e, shelterAnimal?.happenPlace || '')
                }
                className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200"
                title="구글 지도에서 위치 보기"
              >
                <HiMapPin className="w-3 h-3" />
                <span>위치 보기</span>
              </button>
            </div>
            <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
              {shelterAnimal?.happenPlace || '정보 없음'}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400">
              구조 일시
            </label>
            <span className="text-sm font-semibold text-gray-900">
              {formatDateToKorean(shelterAnimal?.happenDt || undefined) ||
                '정보 없음'}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400">
              동물 정보
            </label>
            <div className="flex flex-wrap items-baseline gap-1 text-sm text-gray-900">
              <span className="text-gray-700">{shelterAnimal.kindNm}</span>
              {shelterAnimal?.sexCd && (
                <>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-700">
                    {shelterAnimal.sexCd === 'F'
                      ? '여자'
                      : shelterAnimal.sexCd === 'M'
                      ? '남자'
                      : shelterAnimal.sexCd}
                  </span>
                </>
              )}
              {shelterAnimal?.colorCd && (
                <>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-700">{shelterAnimal.colorCd}</span>
                </>
              )}
              {shelterAnimal?.weight && (
                <>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-700">{shelterAnimal.weight}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out ${
            isLongHover ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/read/${shelterAnimal.desertionNo}`);
            }}
            className="w-full flex justify-center items-center p-2 font-bold text-white rounded-lg bg-primary2 hover:bg-primary1 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 gap-2"
          >
            <FaPaw /> 
            <span className='text-sm font-semibold'>자세히 보러가기</span> 
          </button>
        </div>
      </div>
    </article>
  );
}
