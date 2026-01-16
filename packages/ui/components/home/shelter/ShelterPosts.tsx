'use client';
import { getTrendingBoardsData } from '@/lib/api/post';
import { useEffect, useState, useRef, useCallback } from 'react';
import PostCard from '../../base/PostCard';
import Loading from '../../base/Loading';
import {
  PostData,
  ShelterAnimalData,
  ShelterAnimalItem,
} from '@/packages/type/postType';
import AbandonedCard from '../../base/AbandonedCard';
import AnimalFilterHeader, { AnimalFilterState } from './AnimalFilterHeader';

export default function ShelterPosts() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [shelterAnimalData, setShelterAnimalData] = useState<
    ShelterAnimalItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filters, setFilters] = useState<AnimalFilterState>({
    sexCd: null,
    state: null,
    upKindCd: null,
    searchQuery: '',
    bgnde: null,
    endde: null,
  });
  const filtersRef = useRef<AnimalFilterState>(filters);
  const isLoadingMoreRef = useRef(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const isFilterRequestInProgress = useRef(false);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    isLoadingMoreRef.current = isLoadingMore;
  }, [isLoadingMore]);

  const fetchShelterAnimalData = useCallback(
    async (
      page: number,
      isInitial = false,
      currentFilters?: AnimalFilterState,
    ) => {
      if (
        (isLoadingMoreRef.current || isFilterRequestInProgress.current) &&
        !isInitial
      )
        return;

      try {
        if (!isInitial) {
          setIsLoadingMore(true);
        }

        const filterParams = currentFilters || filtersRef.current;
        const params = new URLSearchParams();
        params.append('pageNo', page.toString());
        params.append('numOfRows', '30');

        if (filterParams.sexCd) params.append('sex_cd', filterParams.sexCd);
        if (filterParams.state) params.append('state', filterParams.state);
        if (filterParams.upKindCd)
          params.append('upkind', filterParams.upKindCd);
        if (filterParams.bgnde) params.append('bgnde', filterParams.bgnde);
        if (filterParams.endde) params.append('endde', filterParams.endde);
        if (filterParams.searchQuery)
          params.append('searchQuery', filterParams.searchQuery);

        const response = await fetch(`/api/shelter-data?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shelter data');
        }
        const shelterAnimalResponse = (await response.json()) as {
          response: ShelterAnimalData;
        };

        const items = shelterAnimalResponse?.response?.body?.items?.item;
        const totalCount =
          shelterAnimalResponse?.response?.body?.totalCount || 0;

        if (items) {
          let itemsArray = Array.isArray(items) ? items : [items];
          const originalItemsLength = itemsArray.length;

          if (filterParams.searchQuery) {
            const searchLower = filterParams.searchQuery.toLowerCase();
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

          const hasMoreData = originalItemsLength === 30;
          if (isInitial) {
            setShelterAnimalData(itemsArray);
            setHasMore(hasMoreData);
          } else {
            setShelterAnimalData((prev) => {
              const newData = [...prev, ...itemsArray];
              setHasMore(hasMoreData);
              return newData;
            });
          }
        } else {
          setHasMore(false);
        }
      } catch (e) {
        console.error('유기견 보호소 데이터 조회 중 오류 발생:', e);
        setHasMore(false);
      } finally {
        setIsLoadingMore(false);
        if (isInitial) {
          setLoading(false);
        }
      }
    },
    [],
  );

  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFilterChange = useCallback((newFilters: AnimalFilterState) => {
    const prevFilters = filtersRef.current;
    const isSearchQueryChanged =
      prevFilters.searchQuery !== newFilters.searchQuery;
    const isOtherFilterChanged =
      prevFilters.sexCd !== newFilters.sexCd ||
      prevFilters.state !== newFilters.state ||
      prevFilters.upKindCd !== newFilters.upKindCd ||
      prevFilters.bgnde !== newFilters.bgnde ||
      prevFilters.endde !== newFilters.endde;

    if (!isSearchQueryChanged && !isOtherFilterChanged) {
      return;
    }

    setFilters(newFilters);

    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
      filterTimeoutRef.current = null;
    }

    const applyFilters = () => {
      if (isFilterRequestInProgress.current) return;

      isFilterRequestInProgress.current = true;
      setPageNo(1);
      setShelterAnimalData([]);
      setHasMore(true);
      setLoading(true);

      const params = new URLSearchParams();
      params.append('pageNo', '1');
      params.append('numOfRows', '30');

      if (newFilters.sexCd) params.append('sex_cd', newFilters.sexCd);
      if (newFilters.state) params.append('state', newFilters.state);
      if (newFilters.upKindCd) params.append('upkind', newFilters.upKindCd);
      if (newFilters.bgnde) params.append('bgnde', newFilters.bgnde);
      if (newFilters.endde) params.append('endde', newFilters.endde);
      if (newFilters.searchQuery)
        params.append('searchQuery', newFilters.searchQuery);

      fetch(`/api/shelter-data?${params.toString()}`)
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch shelter data');
          return response.json();
        })
        .then((shelterAnimalResponse: { response: ShelterAnimalData }) => {
          const items = shelterAnimalResponse?.response?.body?.items?.item;
          const totalCount =
            shelterAnimalResponse?.response?.body?.totalCount || 0;

          if (items) {
            let itemsArray = Array.isArray(items) ? items : [items];
            const originalItemsLength = itemsArray.length;

            // API route에서 이미 필터링되었지만, 이중 체크를 위해 클라이언트에서도 필터링
            if (newFilters.searchQuery) {
              const searchLower = newFilters.searchQuery.toLowerCase();
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

            const hasMoreData = originalItemsLength === 30;

            setShelterAnimalData(itemsArray);
            setHasMore(hasMoreData);
          } else {
            setHasMore(false);
          }
        })
        .catch((e) => {
          console.error('유기견 보호소 데이터 조회 중 오류 발생:', e);
          setHasMore(false);
        })
        .finally(() => {
          setLoading(false);
          isFilterRequestInProgress.current = false;
        });
    };

    // 검색어 변경 시 디바운싱 적용, 다른 필터는 즉시 적용
    if (isSearchQueryChanged) {
      filterTimeoutRef.current = setTimeout(applyFilters, 500);
    } else {
      applyFilters();
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getTrendingBoardsData();
        setPosts(postsData);
      } catch (e) {
        console.error('게시물 조회 중 오류 발생:', e);
      }
    };
    fetchPosts();
    fetchShelterAnimalData(1, true);
  }, []);

  useEffect(() => {
    // 초기 로딩 중이거나 hasMore가 false이면 observer 설정하지 않음
    if (loading || !hasMore) {
      return;
    }

    // 로딩 중이면 observer 설정하지 않음
    if (isLoadingMore) {
      return;
    }

    // 필터 변경 중이면 observer 설정하지 않음
    if (isFilterRequestInProgress.current) {
      return;
    }

    // observerTarget이 마운트될 때까지 기다림
    const currentTarget = observerTarget.current;
    if (!currentTarget) {
      // DOM이 아직 준비되지 않았으면 다음 틱에 다시 시도
      const timeoutId = setTimeout(() => {
        const retryTarget = observerTarget.current;
        if (
          retryTarget &&
          hasMore &&
          !isLoadingMore &&
          !isFilterRequestInProgress.current
        ) {
          const observer = new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) {
                if (
                  hasMore &&
                  !isLoadingMoreRef.current &&
                  !isFilterRequestInProgress.current
                ) {
                  const nextPage = pageNo + 1;
                  setPageNo(nextPage);
                  fetchShelterAnimalData(nextPage, false, filtersRef.current);
                }
              }
            },
            {
              threshold: 0.1,
              rootMargin: '200px',
            },
          );
          observer.observe(retryTarget);
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (
            hasMore &&
            !isLoadingMoreRef.current &&
            !isFilterRequestInProgress.current
          ) {
            const nextPage = pageNo + 1;
            setPageNo(nextPage);
            fetchShelterAnimalData(nextPage, false, filtersRef.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px',
      },
    );

    observer.observe(currentTarget);

    return () => {
      observer.disconnect();
    };
  }, [loading, hasMore, isLoadingMore, pageNo, fetchShelterAnimalData]);


  return (
    <>
      <AnimalFilterHeader
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      {shelterAnimalData.length === 0 && !loading ? (
        <div className="py-12 text-center text-gray-500">
          유기동물 데이터가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 pt-8 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {shelterAnimalData.map((shelterAnimal: ShelterAnimalItem) => (
            <AbandonedCard
              key={shelterAnimal.desertionNo}
              shelterAnimal={shelterAnimal}
            />
          ))}
        </div>
      )}
      {loading && <Loading />}
      {hasMore && (
        <div
          ref={observerTarget}
          className="h-32 flex justify-center items-center py-12"
          data-testid="infinite-scroll-trigger"
        >
          {isLoadingMore && <Loading />}
        </div>
      )}
      {!hasMore && shelterAnimalData.length > 0 && (
        <div className="text-center text-gray-500 py-8">
          모든 데이터를 불러왔습니다.
        </div>
      )}
    </>
  );
}
