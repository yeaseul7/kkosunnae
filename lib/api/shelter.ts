import { ShelterAnimalData, ShelterAnimalItem } from '@/packages/type/postType';

export interface AnimalFilterState {
  sexCd: string | null;
  state: string | null;
  upKindCd: string | null;
  searchQuery: string;
  bgnde: string | null;
  endde: string | null;
}

export interface FetchShelterAnimalDataResult {
  items: ShelterAnimalItem[];
  hasMore: boolean;
}

export async function fetchShelterAnimalData(
  page: number,
  filters: AnimalFilterState,
): Promise<FetchShelterAnimalDataResult> {
  const params = new URLSearchParams();
  params.append('pageNo', page.toString());
  params.append('numOfRows', '30');

  if (filters.sexCd) params.append('sex_cd', filters.sexCd);
  if (filters.state) params.append('state', filters.state);
  if (filters.upKindCd) params.append('upkind', filters.upKindCd);
  if (filters.bgnde) params.append('bgnde', filters.bgnde);
  if (filters.endde) params.append('endde', filters.endde);
  if (filters.searchQuery) params.append('searchQuery', filters.searchQuery);

  const response = await fetch(`/api/shelter-data?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch shelter data');
  }

  const shelterAnimalResponse = (await response.json()) as {
    response: ShelterAnimalData;
  };

  const items = shelterAnimalResponse?.response?.body?.items?.item;

  if (items) {
    let itemsArray = Array.isArray(items) ? items : [items];
    const originalItemsLength = itemsArray.length;

    // 검색어 필터링
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      itemsArray = itemsArray.filter((item) => {
        const rfidCd = item.rfidCd?.toLowerCase() || '';
        const happenPlace = item.happenPlace?.toLowerCase() || '';
        const careAddr = item.careAddr?.toLowerCase() || '';
        const careNm = item.careNm?.toLowerCase() || '';
        return (
          rfidCd.includes(searchLower) ||
          happenPlace.includes(searchLower) ||
          careAddr.includes(searchLower) ||
          careNm.includes(searchLower)
        );
      });
    }

    const hasMore = originalItemsLength === 30;

    return {
      items: itemsArray,
      hasMore,
    };
  }

  return {
    items: [],
    hasMore: false,
  };
}
