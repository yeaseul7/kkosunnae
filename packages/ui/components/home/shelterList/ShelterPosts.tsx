'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import MapComponent from './MapComponent';
import { Address, ShelterInfoItem } from '@/packages/type/shelterTyps';
import Image from 'next/image';
import { MdMap } from 'react-icons/md';
import { sidoLocation } from '@/static/data/sidoLocation';
import { IoCall, IoLocationSharp } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import ShelterCardSkeleton from '../../base/ShelterCardSkeleton';


export default function ShelterPosts() {
    const router = useRouter();
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [shelters, setShelters] = useState<ShelterInfoItem[]>([]);
    const [sheltersLoading, setSheltersLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSido, setSelectedSido] = useState<string>('서울');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [shelterIdTokens, setShelterIdTokens] = useState<Record<string, string>>({});

    useEffect(() => {
        if (shelters.length === 0) {
            setShelterIdTokens({});
            return;
        }
        const careRegNos = shelters.map((s) => s.careRegNo).filter((v): v is string => Boolean(v));
        if (careRegNos.length === 0) return;
        fetch('/api/shelter-id/encode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ care_reg_nos: careRegNos }),
        })
            .then((res) => res.json())
            .then((data) => setShelterIdTokens(data?.tokens ?? {}))
            .catch(() => setShelterIdTokens({}));
    }, [shelters]);

    const fetchShelterInfo = useCallback(async (sidoCd?: string) => {
        setSheltersLoading(true);
        try {
            let targetSidoCd: string | null = null;

            if (sidoCd === undefined) {
                const storedMatchedAddress = localStorage.getItem('matched_address');
                if (storedMatchedAddress) {
                    const matchedAddress = JSON.parse(storedMatchedAddress);
                    targetSidoCd = matchedAddress.sidoCd;
                }
            } else if (sidoCd !== '') {
                targetSidoCd = sidoCd;
            }

            if (targetSidoCd === null && sidoCd === undefined) {
                const seoulSido = sidoLocation.items.find(item => item.SIDO_NAME === '서울특별시');
                targetSidoCd = seoulSido?.SIDO_CD || '6110000';
                console.log('시도 코드가 없어 기본값(서울)을 사용합니다:', targetSidoCd);
            }

            const response = await fetch(
                `/api/shelter-info?upr_cd=${targetSidoCd || ''}&numOfRows=1000&pageNo=1`
            );

            if (!response.ok) {
                throw new Error('보호소 정보 조회 실패');
            }

            const data = await response.json();

            if (data?.response?.body?.items?.item) {
                const items = Array.isArray(data.response.body.items.item)
                    ? data.response.body.items.item
                    : [data.response.body.items.item];
                setShelters(items);
                console.log('보호소 정보 가져오기 성공:', items.length, '개');
            } else {
                setShelters([]);
            }
        } catch (err) {
            console.error('보호소 정보 조회 오류:', err);
            setShelters([]);
        } finally {
            setSheltersLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadStoredAddress = () => {
            try {
                const storedMatchedAddress = localStorage.getItem('matched_address');
                const storedLocation = localStorage.getItem('location');

                let locationData: { latitude?: number; longitude?: number } | null = null;
                if (storedLocation) {
                    locationData = JSON.parse(storedLocation);
                }

                const DEFAULT_SEOUL_LATITUDE = 37.5665;
                const DEFAULT_SEOUL_LONGITUDE = 126.9780;

                if (storedMatchedAddress) {
                    const matchedAddress = JSON.parse(storedMatchedAddress);

                    setAddress({
                        roadAddress: '',
                        jibunAddress: '',
                        level1: matchedAddress.level1,
                        level2: '',
                        level3: '',
                        sidoCd: matchedAddress.sidoCd,
                        sidoName: matchedAddress.sidoName,
                        latitude: locationData?.latitude ?? DEFAULT_SEOUL_LATITUDE,
                        longitude: locationData?.longitude ?? DEFAULT_SEOUL_LONGITUDE,
                    });
                    // 현재 바인딩된 지역으로 초기 선택 설정
                    if (matchedAddress.sidoName) {
                        const shortName = getShortSidoName(matchedAddress.sidoName);
                        setSelectedSido(shortName);
                    }
                } else {
                    // 저장된 주소가 없으면 서울을 기본값으로 설정
                    const seoulSido = sidoLocation.items.find(item => item.SIDO_NAME === '서울특별시');
                    if (seoulSido) {
                        setAddress({
                            roadAddress: '',
                            jibunAddress: '',
                            level1: '서울특별시',
                            level2: '',
                            level3: '',
                            sidoCd: seoulSido.SIDO_CD,
                            sidoName: seoulSido.SIDO_NAME,
                            latitude: locationData?.latitude ?? DEFAULT_SEOUL_LATITUDE,
                            longitude: locationData?.longitude ?? DEFAULT_SEOUL_LONGITUDE,
                        });
                        setSelectedSido('서울');
                    }
                }

                fetchShelterInfo();

                setLoading(false);
            } catch (err) {
                console.error('저장된 주소 정보 로드 오류:', err);
                setError('주소 정보를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        loadStoredAddress();
    }, [fetchShelterInfo]);

    // 시도 선택 핸들러
    const handleSidoSelect = (sidoName: string) => {
        setSelectedSido(sidoName);
        setCurrentPage(1);

        if (sidoName === '전체') {
            fetchShelterInfo('');
        } else {
            const sidoItem = sidoLocation.items.find(item => {
                const shortName = getShortSidoName(item.SIDO_NAME);
                return shortName === sidoName;
            });
            if (sidoItem) {
                fetchShelterInfo(sidoItem.SIDO_CD);
            }
        }
    };

    const getShortSidoName = (sidoName: string): string => {
        const shortNames: Record<string, string> = {
            '서울특별시': '서울',
            '부산광역시': '부산',
            '대구광역시': '대구',
            '인천광역시': '인천',
            '광주광역시': '광주',
            '대전광역시': '대전',
            '울산광역시': '울산',
            '세종특별자치시': '세종',
            '경기도': '경기',
            '강원특별자치도': '강원',
            '충청북도': '충북',
            '충청남도': '충남',
            '전북특별자치도': '전북',
            '전라남도': '전남',
            '경상북도': '경북',
            '경상남도': '경남',
            '제주특별자치도': '제주',
        };
        return shortNames[sidoName] || sidoName.replace(/특별시|광역시|특별자치시|도/g, '').replace(/특별자치도/g, '');
    };

    const filteredShelters = useMemo(() => {
        return shelters.filter(shelter => {
            const matchesSearch = searchQuery === '' ||
                (shelter.careNm?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    shelter.careAddr?.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesSearch;
        });
    }, [shelters, searchQuery]);

    const totalPages = Math.ceil(filteredShelters.length / itemsPerPage);
    const paginatedShelters = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredShelters.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredShelters, currentPage]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">현재 위치를 가져오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <h3 className="text-red-800 font-semibold mb-2">위치 정보 오류</h3>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="mb-4">
                <h1 className="text-2xl font-bold mb-2">전국 유기동물 보호소 안내</h1>
                <p className="text-sm text-gray-600">도움의 손길을 기다리는 친구들이 있는 가장 가까운 보호소를 찾아보세요.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="w-full lg:col-span-2">
                    <div className="border border-gray-200 rounded-3xl p-4 bg-white" style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
                        <MapComponent
                            center={
                                address && address.latitude !== undefined && address.longitude !== undefined
                                    ? { lat: address.latitude, lng: address.longitude }
                                    : undefined
                            }
                            zoom={10}
                            shelters={shelters}
                            initialSidoCd={address?.sidoCd}
                            selectedSidoCd={
                                selectedSido === '전체'
                                    ? ''
                                    : (() => {
                                        const sidoItem = sidoLocation.items.find(item => {
                                            const shortName = getShortSidoName(item.SIDO_NAME);
                                            return shortName === selectedSido;
                                        });
                                        return sidoItem?.SIDO_CD || null;
                                    })()
                            }
                            onSidoSelect={(sidoCd) => {
                                if (sidoCd === '') {
                                    handleSidoSelect('전체');
                                } else {
                                    const sidoItem = sidoLocation.items.find(item => item.SIDO_CD === sidoCd);
                                    if (sidoItem) {
                                        handleSidoSelect(getShortSidoName(sidoItem.SIDO_NAME));
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="w-full lg:col-span-3">
                    <div className="mb-6 border border-gray-200 rounded-3xl p-4 bg-white" style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
                        <div className="mb-4">
                            <div className="relative w-full">
                                <div className="flex items-center px-4 w-full h-12 bg-gray-50 border border-gray-200 rounded-full focus-within:border-blue-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                                    <Image
                                        src="/static/svg/icon-search-3.svg"
                                        alt="Search"
                                        width={20}
                                        height={20}
                                        className="mr-3 text-gray-400 shrink-0"
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        placeholder="보호소 이름이나 지역명을 검색하세요..."
                                        className="flex-1 w-full text-sm placeholder-gray-400 text-gray-900 bg-transparent border-none outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleSidoSelect('전체')}
                                className={`px-3 py-1.5 rounded-full border transition-colors duration-200 text-xs ${selectedSido === '전체'
                                    ? 'bg-primary1 text-white border-primary1'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                    }`}
                            >
                                전체
                            </button>
                            {sidoLocation.items.map((sido) => {
                                const shortName = getShortSidoName(sido.SIDO_NAME);
                                return (
                                    <button
                                        key={sido.SIDO_CD}
                                        onClick={() => handleSidoSelect(shortName)}
                                        className={`px-3 py-1.5 rounded-full border transition-colors duration-200 text-xs ${selectedSido === shortName
                                            ? 'bg-primary1 text-white border-primary1'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                            }`}
                                    >
                                        {shortName}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        {sheltersLoading ? (
                            Array.from({ length: 10 }).map((_, index) => (
                                <ShelterCardSkeleton key={`skeleton-${index}`} />
                            ))
                        ) : paginatedShelters.length > 0 ? (
                            paginatedShelters.map((shelter, index) => (
                                <div
                                    key={shelter.careRegNo || index}
                                    className="bg-white border border-gray-200 rounded-3xl p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <h3 className="text-sm font-semibold text-gray-900">
                                                    {shelter.careNm || '보호소'}
                                                </h3>

                                            </div>
                                            {shelter.careAddr && (
                                                <p className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                                                    <IoLocationSharp /> {shelter.careAddr}
                                                </p>
                                            )}
                                            {shelter.careTel && (
                                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                                    <IoCall /> {shelter.careTel}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => {
                                                    const token = shelter.careRegNo ? shelterIdTokens[shelter.careRegNo] : undefined;
                                                    if (token) router.push(`/animalShelter/${token}`);
                                                }}
                                                disabled={shelter.careRegNo ? !shelterIdTokens[shelter.careRegNo] : true}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors text-xs font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                상세보기
                                            </button>
                                            <button
                                                className="p-2 rounded-full bg-gray-100 text-primary1 hover:bg-gray-200 transition-colors"
                                                aria-label="지도 보기"
                                            >
                                                <MdMap className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    &lt;
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === page
                                            ? 'bg-primary1 text-white border-primary1'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}