'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { HiMapPin } from 'react-icons/hi2';
import { ShelterAnimalItem } from '@/packages/type/postType';
import { formatDateToKorean } from '@/packages/utils/dateFormatting';
import getOptimizedCloudinaryUrl from '@/packages/utils/optimization';
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
  const [prevDesertionNo, setPrevDesertionNo] = useState(shelterAnimal.desertionNo);

  if (shelterAnimal.desertionNo !== prevDesertionNo) {
    setPrevDesertionNo(shelterAnimal.desertionNo);
    setCurrentImageIndex(0);
  }

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

  const currentImageUrl = useMemo(() => {
    if (availableImages.length === 0) return null;
    if (currentImageIndex >= availableImages.length) return null;
    return availableImages[currentImageIndex];
  }, [availableImages, currentImageIndex]);

  const thumbnailImage = useMemo(() => {
    if (!currentImageUrl) return null;
    if (currentImageUrl.includes('res.cloudinary.com')) {
      return getOptimizedCloudinaryUrl(currentImageUrl, 150, 150);
    }
    return currentImageUrl;
  }, [currentImageUrl]);

  const handleImageError = useCallback(() => {
    if (currentImageIndex < availableImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  }, [currentImageIndex, availableImages.length]);

  const defaultImage = useMemo(() => {
    if (shelterAnimal.upKindNm === '417000') {
      return '/static/images/defaultDogImg.png';
    }
    if (shelterAnimal.kindCd === '422400') {
      return '/static/images/defaultCatImg.png';
    }
    return '/static/images/defaultDogImg.png';
  }, [shelterAnimal.upKindNm, shelterAnimal.kindCd]);

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

  const isExternalImage = useMemo(() => {
    if (!currentImageUrl) return false;
    // Cloudinary 이미지는 이미 최적화되어 있으므로 Next.js 최적화 불필요
    if (currentImageUrl.includes('res.cloudinary.com')) return true;
    // openapi.animal.go.kr 이미지는 Next.js로 최적화 가능
    if (currentImageUrl.includes('openapi.animal.go.kr') || currentImageUrl.includes('www.animal.go.kr')) {
      return false;
    }
    // 기본 이미지는 최적화 불필요
    if (displayImage === defaultImage) return true;
    // 기타 외부 이미지는 최적화 시도
    return false;
  }, [currentImageUrl, displayImage, defaultImage]);

  const statusBadge = useMemo(() => {
    return {
      text: shelterAnimal?.processState || '상태 미확인',
      bgColor: '#FFE5D9', // 연한 복숭아/주황색
      textColor: '#8B4513', // 어두운 갈색 텍스트
    };
  }, [shelterAnimal]);

  const noticeEndBadge = useMemo(() => {
    if (!shelterAnimal?.noticeEdt) return null;

    const noticeEdtStr = shelterAnimal.noticeEdt;
    const year = parseInt(noticeEdtStr.substring(0, 4));
    const month = parseInt(noticeEdtStr.substring(4, 6)) - 1;
    const day = parseInt(noticeEdtStr.substring(6, 8));
    const endDate = new Date(year, month, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 기존 색상 규칙을 파스텔톤으로 변환
    if (diffDays < 0) {
      return {
        text: '공고 종료',
        bgColor: '#E5E5E5', // 연한 회색
        textColor: '#6B6B6B', // 어두운 회색 텍스트
      };
    } else if (diffDays === 0) {
      return {
        text: '오늘 종료',
        bgColor: '#FFE5E5', // 연한 빨강
        textColor: '#8B1A1A', // 어두운 빨강 텍스트
      };
    } else if (diffDays === 1) {
      return {
        text: '1일 전',
        bgColor: '#FFE5E5', // 연한 빨강
        textColor: '#8B1A1A', // 어두운 빨강 텍스트
      };
    } else if (diffDays <= 7) {
      return {
        text: `${diffDays}일 전`,
        bgColor: '#FFE8D5', // 연한 주황
        textColor: '#8B4513', // 어두운 주황 텍스트
      };
    } else {
      return {
        text: `${diffDays}일 전`,
        bgColor: '#E5F0FF', // 연한 파랑 (primary2 파스텔톤)
        textColor: '#1E3A5F', // 어두운 파랑 텍스트
      };
    }
  }, [shelterAnimal]);
  const openGoogleMap = useCallback((e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, '_blank');
  }, []);

  const handleMouseEnter = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsLongHover(true);
    }, 1000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsLongHover(false);
  }, []);

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
      onClick={() => router.push(`/shelter/${shelterAnimal.desertionNo}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex overflow-hidden flex-col bg-white rounded-lg shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98] w-full max-w-full sm:max-w-[260px] border border-gray-100"
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
      </div>
      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-1 relative">
        {/* 뱃지 및 지도 버튼 - 상단 일렬 배치 */}
        <div className="flex items-center gap-2 mb-2">
          {/* 상태 뱃지 */}
          {shelterAnimal?.processState && (
            <div
              className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
              style={{
                backgroundColor: statusBadge.bgColor,
                color: statusBadge.textColor,
              }}
            >
              {statusBadge.text}
            </div>
          )}
          {/* 공고종료일 뱃지 */}
          {noticeEndBadge && (
            <div
              className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
              style={{
                backgroundColor: noticeEndBadge.bgColor,
                color: noticeEndBadge.textColor,
              }}
            >
              {noticeEndBadge.text}
            </div>
          )}
          {/* 지도 버튼 */}
          <button
            onClick={(e) =>
              openGoogleMap(e, shelterAnimal?.happenPlace || '')
            }
            className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 ml-auto"
            style={{
              backgroundColor: '#D4EDDA', // 연한 초록색
              color: '#155724', // 어두운 초록색 텍스트
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C3E6CB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#D4EDDA';
            }}
            title="구글 지도에서 지도"
          >
            <HiMapPin className="w-3 h-3" />
            <span>지도</span>
          </button>
        </div>

        {/* 기본 정보 - 높이 유지하며 부드러운 fade out */}
        <div
          className={`flex flex-col gap-1 transition-opacity duration-300 ease-in-out ${isLongHover ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400">
              구조 위치
            </label>
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
          className={`absolute inset-0 flex items-center justify-center p-3 sm:p-4 transition-opacity duration-300 ease-in-out ${isLongHover ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/shelter/${shelterAnimal.desertionNo}`);
            }}
            className="w-full flex justify-center items-center p-2 font-bold text-white rounded-lg bg-primary2 hover:bg-primary1 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 gap-2"
          >
            <FaPaw className="text-sm sm:text-base" />
            <span className='text-xs sm:text-sm font-semibold'>자세히 보러가기</span>
          </button>
        </div>
      </div>
    </article>
  );
}
