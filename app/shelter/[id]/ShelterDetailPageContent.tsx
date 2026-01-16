'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Lottie from 'lottie-react';
import PageTemplate from '@/packages/ui/components/base/PageTemplate';
import Loading from '@/packages/ui/components/base/Loading';
import { ShelterAnimalItem, ShelterAnimalData } from '@/packages/type/postType';
import { ShelterInfoResponse, ShelterInfoItem } from '@/app/api/shelter-info/route';
import { formatDateToKorean } from '@/packages/utils/dateFormatting';
import { HiHeart, HiShare } from 'react-icons/hi2';
import { FaPaw, FaLeaf } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import Notfound_ad_animal from '@/packages/ui/components/base/Notfound_ad_animal';
import AnimalImgCard from '@/packages/ui/components/home/shelter/AnimalImgCard';
import AnimalInfoCard from '@/packages/ui/components/home/shelter/AnimalInfoCard';

interface ShelterDetailPageContentProps {
  desertionNo: string;
}

export default function ShelterDetailPageContent({
  desertionNo,
}: ShelterDetailPageContentProps) {
  const router = useRouter();
  const [animalData, setAnimalData] = useState<ShelterAnimalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animalImgList, setAnimalImgList] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [emptyAnimationData, setEmptyAnimationData] = useState<any>(null);
  const [shelterInfo, setShelterInfo] = useState<ShelterInfoItem | null>(null);

  useEffect(() => {
    const fetchAnimalData = async () => {
      if (!desertionNo) {
        setError('유기번호가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('desertion_no', desertionNo);
        params.append('numOfRows', '1');

        const response = await fetch(`/api/shelter-data?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch animal data');
        }

        const shelterAnimalResponse = (await response.json()) as {
          response: ShelterAnimalData;
        };

        const items = shelterAnimalResponse?.response?.body?.items?.item;
        if (items) {
          const itemsArray = Array.isArray(items) ? items : [items];
          if (itemsArray.length > 0) {
            console.log(itemsArray[0]);
            setAnimalData(itemsArray[0]);
          } else {
            setError('동물 정보를 찾을 수 없습니다.');
          }
        } else {
          setError('동물 정보를 찾을 수 없습니다.');
        }
      } catch (e) {
        console.error('동물 정보 조회 중 오류 발생:', e);
        setError('동물 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalData();
  }, [desertionNo]);

  useEffect(() => {
    if (animalData) {
      const animalImgList = [];
      for (let i = 1; i <= 8; i++) {
        const popfile = animalData[`popfile${i}` as keyof ShelterAnimalItem] as
          | string
          | undefined;
        if (popfile && typeof popfile === 'string' && popfile.trim() !== '') {
          animalImgList.push(popfile);
        }
      }
      setAnimalImgList(animalImgList);
    }
  }, [animalData]);

  useEffect(() => {
    const fetchShelterInfo = async () => {
      if (!animalData?.careRegNo) {
        return;
      }

      try {
        const params = new URLSearchParams();
        params.append('care_reg_no', animalData.careRegNo);
        params.append('pageNo', '1');
        params.append('numOfRows', '10');

        const response = await fetch(`/api/shelter-info?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shelter info');
        }

        const shelterInfoResponse = (await response.json()) as ShelterInfoResponse;
        const items = shelterInfoResponse?.response?.body?.items?.item;
        
        if (items) {
          // item이 배열인 경우 첫 번째 항목, 단일 객체인 경우 그대로 사용
          const item = Array.isArray(items) ? items[0] : items;
          setShelterInfo(item);
          console.log('Shelter Info:', item);
        } else {
          setShelterInfo(null);
        }
      } catch (e) {
        console.error('보호소 정보 조회 중 오류 발생:', e);
      }
    };

    fetchShelterInfo();
  }, [animalData?.careRegNo]);

  useEffect(() => {
    fetch('/static/lottie/search_empty.json')
      .then((res) => res.json())
      .then((data) => setEmptyAnimationData(data))
      .catch((err) => console.error('Failed to load animation:', err));
  }, []);

  const mainImage = useMemo(() => {
    if (animalImgList.length > 0) {
      return animalImgList[selectedImageIndex];
    }
    return '/static/images/defaultDogImg.png';
  }, [animalImgList, selectedImageIndex]);

  const statusText = useMemo(() => {
    if (animalData?.processState === '보호중') {
      return '보호중';
    }
    if (animalData?.processState === '공고중') {
      return '공고중';
    }
    return '미상';
  }, [animalData?.processState]);

  const genderText = useMemo(() => {
    if (animalData?.sexCd === 'F') return '암컷';
    if (animalData?.sexCd === 'M') return '수컷';
    return '미상';
  }, [animalData?.sexCd]);

  const breedText = useMemo(() => {
    return animalData?.kindNm || animalData?.kindFullNm || '품종 미상';
  }, [animalData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error || !animalData) {
    return (
      <Notfound_ad_animal
        emptyAnimationData={emptyAnimationData}
        error={error || '동물 정보를 찾을 수 없습니다.'}
        router={router}
      />
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen font-sans bg-white">
      <main className="flex flex-col justify-between items-center px-4 py-4 w-full max-w-6xl min-h-screen bg-whitesm:items-start">
        <PageTemplate visibleHomeTab={false}>
          <div className="flex flex-col gap-6 px-4 mx-auto w-full max-w-6xl sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors self-start"
            >
              <IoIosArrowBack className="w-5 h-5" />
              <span>뒤로가기</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <AnimalImgCard
                mainImage={mainImage}
                animalData={animalData}
                animalImgList={animalImgList}
                selectedImageIndex={selectedImageIndex}
                setSelectedImageIndex={setSelectedImageIndex}
              />

              <div className="flex flex-col gap-6">
                <AnimalInfoCard
                  animalData={animalData}
                  statusText={statusText}
                  genderText={genderText}
                  breedText={breedText}
                  desertionNo={desertionNo}
                />

                {/* 입양 문의 안내 */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <FaPaw className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">입양 문의</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    입양 문의는 전화 문의를 통해 진행해주세요.
                  </p>
                  
                  {shelterInfo && (
                    <div className="flex flex-col gap-3 mt-2">
                      {/* 운영 시간 정보 */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">운영 시간</h4>
                        <div className="flex flex-col gap-2 text-sm">
                          {shelterInfo.weekOprStime && shelterInfo.weekOprEtime && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 min-w-[80px]">평일 운영:</span>
                              <span className="text-gray-900">
                                {shelterInfo.weekOprStime} ~ {shelterInfo.weekOprEtime}
                              </span>
                            </div>
                          )}
                          {shelterInfo.weekCellStime && shelterInfo.weekCellEtime && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 min-w-[80px]">평일 분양:</span>
                              <span className="text-gray-900">
                                {shelterInfo.weekCellStime} ~ {shelterInfo.weekCellEtime}
                              </span>
                            </div>
                          )}
                          {shelterInfo.weekendOprStime && shelterInfo.weekendOprEtime && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 min-w-[80px]">주말 운영:</span>
                              <span className="text-gray-900">
                                {shelterInfo.weekendOprStime} ~ {shelterInfo.weekendOprEtime}
                              </span>
                            </div>
                          )}
                          {shelterInfo.weekendCellStime && shelterInfo.weekendCellEtime && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 min-w-[80px]">주말 분양:</span>
                              <span className="text-gray-900">
                                {shelterInfo.weekendCellStime} ~ {shelterInfo.weekendCellEtime}
                              </span>
                            </div>
                          )}
                          {shelterInfo.closeDay && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 min-w-[80px]">휴무일:</span>
                              <span className="text-gray-900">
                                {shelterInfo.closeDay === '0' ? '없음' : 
                                 shelterInfo.closeDay === '1' ? '월요일' :
                                 shelterInfo.closeDay === '2' ? '화요일' :
                                 shelterInfo.closeDay === '3' ? '수요일' :
                                 shelterInfo.closeDay === '4' ? '목요일' :
                                 shelterInfo.closeDay === '5' ? '금요일' :
                                 shelterInfo.closeDay === '6' ? '토요일' :
                                 shelterInfo.closeDay === '7' ? '일요일' :
                                 shelterInfo.closeDay}
                              </span>
                            </div>
                          )}
                        </div>
                  
                      </div>
                      
                      {(shelterInfo.careTel || animalData?.careTel) && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex flex-col gap-2">
                            {shelterInfo.careTel && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-600">전화번호 1:</span>
                                <span className="text-sm text-gray-900">{shelterInfo.careTel}</span>
                              </div>
                            )}
                            {animalData?.careTel && animalData.careTel !== shelterInfo.careTel && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-600">전화번호 2:</span>
                                <span className="text-sm text-gray-900">{animalData.careTel}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

         
          </div>
        </PageTemplate>
      </main>
    </div>
  );
}
