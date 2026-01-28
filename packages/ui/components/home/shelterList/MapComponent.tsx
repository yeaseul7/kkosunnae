'use client';

import { ShelterInfoItem } from '@/packages/type/shelterTyps';
import { useEffect, useRef, useState } from 'react';
import { getShortSidoName } from '@/packages/utils/locationUtils';

interface MapComponentProps {
    center?: { lat: number; lng: number };
    zoom?: number;
    height?: string;
    shelters: ShelterInfoItem[];
    onSidoSelect?: (sidoCd: string) => void;
    initialSidoCd?: string;
    selectedSidoCd?: string | null;
}

interface SidoItem {
    SIDO_CD: string;
    SIDO_NAME: string;
}

interface NaverMapOptions {
    center: NaverLatLng;
    zoom: number;
    minZoom?: number;
    maxZoom?: number;
}

interface NaverLatLng {
    lat(): number;
    lng(): number;
}

interface NaverMap {
    setCenter(latlng: NaverLatLng): void;
    setZoom(zoom: number): void;
    setMinZoom(zoom: number): void;
    setMaxZoom(zoom: number): void;
    fitBounds(bounds: NaverLatLngBounds): void;
}

interface NaverMarker {
    setMap(map: NaverMap | null): void;
    setPosition(position: NaverLatLng): void;
    getPosition(): NaverLatLng;
}

interface NaverInfoWindow {
    open(map: NaverMap, marker: NaverMarker): void;
    close(): void;
    setContent(content: string | HTMLElement): void;
}

interface NaverLatLngBounds {
    extend(latlng: NaverLatLng): void;
}


declare global {
    interface Window {
        naver: {
            maps: {
                Map: new (element: HTMLElement | string, options?: NaverMapOptions) => NaverMap;
                LatLng: new (lat: number, lng: number) => NaverLatLng;
                LatLngBounds: new () => NaverLatLngBounds;
                MapOptions: NaverMapOptions;
                Marker: new (options: { position: NaverLatLng; map: NaverMap; title?: string }) => NaverMarker;
                InfoWindow: new (options?: { content: string | HTMLElement; maxWidth?: number; pixelOffset?: { x: number; y: number } }) => NaverInfoWindow;
                Event: {
                    addListener(target: NaverMarker, event: string, handler: () => void): void;
                };
            };
        };
    }
}

export default function MapComponent({
    center,
    zoom = 7,
    height = '400px',
    shelters,
    onSidoSelect,
    initialSidoCd,
    selectedSidoCd,
}: MapComponentProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<NaverMap | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const markersRef = useRef<NaverMarker[]>([]);
    const [sidoList, setSidoList] = useState<SidoItem[]>([]);
    const [selectedSido, setSelectedSido] = useState<string | null>(initialSidoCd || null);



    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as Window & { navermap_authFailure?: () => void }).navermap_authFailure = () => {
                console.error('네이버 지도 API 인증 실패');
                setError('네이버 지도 API 인증에 실패했습니다. 클라이언트 ID와 서비스 URL을 확인하세요.');
                setIsLoaded(false);
            };
        }

        const checkNaverMap = () => {
            if (typeof window !== 'undefined' && window.naver && window.naver.maps) {
                return true;
            }
            return false;
        };

        const initializeMap = () => {
            if (!mapRef.current || !checkNaverMap()) {
                return false;
            }

            if (map) {
                return true;
            }

            try {
                const mapOptions: NaverMapOptions = {
                    center: new window.naver.maps.LatLng(center?.lat ?? 35.5, center?.lng ?? 127.5),
                    zoom: zoom,
                    minZoom: 6,
                    maxZoom: 18,
                };

                const mapInstance = new window.naver.maps.Map(mapRef.current, mapOptions);

                if (mapInstance.setMinZoom) {
                    mapInstance.setMinZoom(6);
                }

                setMap(mapInstance);
                setIsLoaded(true);
                setError(null);


                return true;
            } catch (err) {
                console.error('지도 초기화 오류:', err);
                return false;
            }
        };

        if (checkNaverMap()) {
            initializeMap();
            return;
        }

        let attemptCount = 0;
        const maxAttempts = 100;

        const interval = setInterval(() => {
            attemptCount++;
            if (checkNaverMap()) {
                clearInterval(interval);
                const success = initializeMap();
                if (!success && attemptCount >= maxAttempts) {
                    setError('지도를 초기화할 수 없습니다. 잠시 후 다시 시도해주세요.');
                }
            } else if (attemptCount >= maxAttempts) {
                clearInterval(interval);
                if (!isLoaded && !error) {
                    setError('네이버 지도 API를 로드할 수 없습니다. 네트워크 연결을 확인하세요.');
                }
            }
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [center?.lat, center?.lng, zoom, map, isLoaded, error]);

    useEffect(() => {
        if (map && window.naver && window.naver.maps) {
            map.setCenter(new window.naver.maps.LatLng(center?.lat ?? 35.5, center?.lng ?? 127.5));
            map.setZoom(zoom);
        }
    }, [center?.lat, center?.lng, zoom, map]);

    // 시도 목록 가져오기
    useEffect(() => {
        const storedSidoData = localStorage.getItem('sido_data');
        if (storedSidoData) {
            try {
                const sidoData: SidoItem[] = JSON.parse(storedSidoData);
                setSidoList(sidoData);
            } catch (err) {
                console.error('시도 데이터 파싱 오류:', err);
            }
        }
    }, []);

    // initialSidoCd가 변경되면 selectedSido 업데이트
    useEffect(() => {
        if (initialSidoCd) {
            setSelectedSido(initialSidoCd);
        }
    }, [initialSidoCd]);

    // selectedSidoCd prop이 변경되면 내부 상태 동기화
    useEffect(() => {
        if (selectedSidoCd !== undefined) {
            setSelectedSido(selectedSidoCd);
        }
    }, [selectedSidoCd]);

    // 시도 선택 핸들러
    const handleSidoSelect = (sidoCd: string) => {
        setSelectedSido(sidoCd);
        if (onSidoSelect) {
            onSidoSelect(sidoCd);
        }
    };

    // 보호소 마커 표시
    useEffect(() => {
        if (!map || !isLoaded || !window.naver || !window.naver.maps || !shelters || shelters.length === 0) {
            return;
        }

        // 기존 마커 제거
        markersRef.current.forEach((marker) => {
            marker.setMap(null);
        });
        markersRef.current = [];

        // 새로운 마커 생성
        const validShelters = shelters.filter((shelter) => shelter.lat && shelter.lng);

        validShelters.forEach((shelter) => {
            if (shelter.lat && shelter.lng) {
                try {
                    const position = new window.naver.maps.LatLng(shelter.lat, shelter.lng);
                    const marker = new window.naver.maps.Marker({
                        position: position,
                        map: map,
                        title: shelter.careNm || '보호소',
                    });

                    // 정보창 생성
                    const infoWindow = new window.naver.maps.InfoWindow({
                        content: `
                            <div style="padding: 10px; min-width: 200px;">
                                <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${shelter.careNm || '보호소'}</h3>
                                ${shelter.careAddr ? `<p style="margin: 4px 0; font-size: 12px; color: #666;">📍 ${shelter.careAddr}</p>` : ''}
                                ${shelter.careTel ? `<p style="margin: 4px 0; font-size: 12px; color: #666;">📞 ${shelter.careTel}</p>` : ''}
                                ${shelter.divisionNm ? `<p style="margin: 4px 0; font-size: 12px; color: #666;">🏢 ${shelter.divisionNm}</p>` : ''}
                            </div>
                        `,
                        maxWidth: 300,
                    });

                    // 마커 클릭 시 정보창 표시
                    window.naver.maps.Event.addListener(marker, 'click', () => {
                        // 다른 정보창 닫기
                        markersRef.current.forEach((m) => {
                            if (m !== marker) {
                                // 정보창은 마커별로 관리해야 하지만, 간단하게 처리
                            }
                        });
                        infoWindow.open(map, marker);
                    });

                    markersRef.current.push(marker);
                } catch (err) {
                    console.error('마커 생성 오류:', err, shelter);
                }
            }
        });

        // 마커가 있으면 지도 범위 조정
        if (validShelters.length > 0) {
            const bounds = new window.naver.maps.LatLngBounds();
            validShelters.forEach((shelter) => {
                if (shelter.lat && shelter.lng) {
                    bounds.extend(new window.naver.maps.LatLng(shelter.lat, shelter.lng));
                }
            });
            map.fitBounds(bounds);
        }

        return () => {
            // 클린업: 마커 제거
            markersRef.current.forEach((marker) => {
                marker.setMap(null);
            });
            markersRef.current = [];
        };
    }, [map, isLoaded, shelters]);

    return (
        <div className="w-full">
            {error ? (
                <div className="flex items-center justify-center h-full min-h-[400px] bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-center p-6">
                        <div className="text-red-600 text-lg font-semibold mb-2">⚠️ 지도 로드 실패</div>
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="relative">
                        <div
                            ref={mapRef}
                            style={{ width: '100%', height, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}
                            className="rounded-lg border border-gray-200 overflow-hidden"
                        />
                        {!isLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600">지도를 불러오는 중...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 시도 선택 버튼 - 지도 아래 */}
                    {sidoList.length > 0 && (
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => {
                                    if (onSidoSelect) {
                                        // "전체" 선택 시 빈 문자열 전달
                                        onSidoSelect('');
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-full border transition-colors duration-200 text-xs ${!selectedSido || selectedSido === ''
                                    ? 'bg-primary1 text-white border-primary1'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                    }`}
                            >
                                전체
                            </button>
                            {sidoList.map((sido) => (
                                <button
                                    key={sido.SIDO_CD}
                                    onClick={() => handleSidoSelect(sido.SIDO_CD)}
                                    className={`px-3 py-1.5 rounded-full border transition-colors duration-200 text-xs ${selectedSido === sido.SIDO_CD
                                        ? 'bg-primary1 text-white border-primary1'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                        }`}
                                >
                                    {getShortSidoName(sido.SIDO_NAME)}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}