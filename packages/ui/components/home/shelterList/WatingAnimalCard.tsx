import { ShelterAnimalItem } from "@/packages/type/postType";
import Image from 'next/image';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, collection } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/firebase';
import { useEffect, useState } from "react";
import { IoIosCalendar } from "react-icons/io";


export default function WatingAnimalCard({ animal }: { animal: ShelterAnimalItem }) {
    const { user } = useAuth();

    const router = useRouter();

    const [likedAnimals, setLikedAnimals] = useState<Set<string>>(new Set());
    // 좋아요 상태 확인
    useEffect(() => {
        const checkLikedAnimals = async () => {
            if (!user?.uid || animal.desertionNo === undefined || animal.noticeNo === undefined) return;

            const likedSet = new Set<string>();
            try {
                const abandonmentRef = collection(firestore, 'users', user.uid, 'abandonment');
                const abandonmentDoc = doc(abandonmentRef, animal.desertionNo);
                const docSnapshot = await getDoc(abandonmentDoc);
                if (docSnapshot.exists()) {
                    likedSet.add(animal.desertionNo);
                }
            } catch (error) {
                console.error('좋아요 상태 확인 오류:', error);
            }
            setLikedAnimals(likedSet);
        };

        checkLikedAnimals();
    }, [user, animal.desertionNo, animal.noticeNo]);

    const getGenderText = (sexCd?: string) => {
        if (sexCd === 'M') return '수컷';
        if (sexCd === 'F') return '암컷';
        return '미상';
    };

    // 나이 텍스트
    const getAgeText = (age?: string) => {
        if (!age) return '';
        if (age.includes('년')) return age;
        if (age.includes('개월')) return age;
        return age;
    };
    // 날짜 포맷팅 (YYYYMMDDHHMM 형식을 YYYY.MM.DD로 변환)
    const formatRescueDate = (happenDt?: string) => {
        if (!happenDt) return '';
        if (happenDt.length >= 8) {
            return `${happenDt.slice(0, 4)}.${happenDt.slice(4, 6)}.${happenDt.slice(6, 8)}`;
        }
        return happenDt;
    };

    const imageUrl = animal.popfile1 || '/static/images/defaultDog.png';
    const animalName = animal.kindNm || animal.kindFullNm || '이름 없음';
    const age = getAgeText(animal.age);
    const breed = animal.kindNm || '품종 미상';
    const gender = getGenderText(animal.sexCd);
    const rescueDate = formatRescueDate(animal.happenDt);

    // processState에 따른 배지 정보
    const getStatusBadge = () => {
        if (!animal.processState) return null;

        if (animal.processState === 'notice') {
            return {
                text: '공고중',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-700',
            };
        }
        if (animal.processState === 'protect') {
            return {
                text: '보호중',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-700',
            };
        }
        return {
            text: animal.processState,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
        };
    };

    const statusBadge = getStatusBadge();

    // 좋아요 토글
    const handleLike = async (animal: ShelterAnimalItem, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user?.uid || !animal.desertionNo) return;

        const desertionNo = animal.desertionNo;
        try {
            const abandonmentRef = collection(firestore, 'users', user.uid, 'abandonment');
            const abandonmentDoc = doc(abandonmentRef, desertionNo);
            const isLiked = likedAnimals.has(desertionNo);

            if (isLiked) {
                await deleteDoc(abandonmentDoc);
                setLikedAnimals(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(desertionNo);
                    return newSet;
                });
            } else {
                await setDoc(abandonmentDoc, {
                    ...animal,
                    createdAt: serverTimestamp(),
                });
                setLikedAnimals(prev => new Set(prev).add(desertionNo));
            }
        } catch (error) {
            console.error('좋아요 처리 오류:', error);
        }
    };


    return (
        <div
            key={animal.desertionNo || animal.noticeNo}
            className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
            <div className="relative w-full h-48">
                <Image
                    src={imageUrl}
                    alt={animalName}
                    fill
                    className="object-cover"
                    unoptimized
                />
                {statusBadge && (
                    <div className="absolute top-1.5 left-1.5">
                        <span className={`inline-flex items-center rounded-3xl ${statusBadge.bgColor} ${statusBadge.textColor} px-3 py-1 text-xs font-semibold`}>
                            {statusBadge.text}
                        </span>
                    </div>
                )}
            </div>
            <div className="p-3 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-gray-900 flex-1">
                        {animalName}
                    </h3>
                    <button
                        onClick={(e) => handleLike(animal, e)}
                        className="ml-2 shrink-0"
                    >
                        {likedAnimals.has(animal.desertionNo || '') ? (
                            <HiHeart className="w-4 h-4 text-red-600" />
                        ) : (
                            <HiOutlineHeart className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                </div>

                <div className="text-xs text-gray-600">
                    {age && breed && gender ? (
                        <span>{age} · {breed} · {gender}</span>
                    ) : (
                        <span>{age || breed || gender || '정보 없음'}</span>
                    )}
                </div>

                {rescueDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <IoIosCalendar className="w-3 h-3" />
                        <span>{rescueDate} 구조</span>
                    </div>
                )}

                <button
                    onClick={() => {
                        if (animal.desertionNo) {
                            router.push(`/shelter/${animal.desertionNo}`);
                        }
                    }}
                    className="w-full font-extrabold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl py-2.5 px-3 text-xs transition-colors mt-1"
                >
                    자세히 보기
                </button>
            </div>
        </div>
    );
}