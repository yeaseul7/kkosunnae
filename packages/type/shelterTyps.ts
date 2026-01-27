export interface ShelterInfoItem {
    careNm?: string;
    careRegNo?: string;
    orgNm?: string;
    divisionNm?: string;
    saveTrgtAnimal?: string;
    careAddr?: string;
    jibunAddr?: string;
    lat?: number;
    lng?: number;
    careTel?: string;
}
export interface SidoLocationItem {
    SIDO_CD: string;
    SIDO_NAME: string;
}


export interface Address {
    roadAddress: string;
    jibunAddress: string;
    level1: string; // 시/도
    level2: string; // 시/군/구
    level3: string; // 읍/면/동
    sidoCd?: string; // 매칭된 시도 코드
    sidoName?: string; // 매칭된 시도 이름
    latitude?: number; // 위도
    longitude?: number; // 경도
}