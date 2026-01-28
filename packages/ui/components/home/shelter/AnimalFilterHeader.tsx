'use client';
import { useState, useMemo, useEffect } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import Image from 'next/image';
import { getShortSidoName } from '@/packages/utils/locationUtils';

interface SidoItem {
  SIDO_CD: string;
  SIDO_NAME: string;
}


const sexOptions = [
  { value: null, label: '전체' },
  { value: 'F', label: '여자' },
  { value: 'M', label: '남자' },
  { value: 'Q', label: '미상' },
];

const stateOptions = [
  { value: null, label: '전체' },
  { value: 'notice', label: '공고중' },
  { value: 'protect', label: '보호중' },
];

const upKindOptions = [
  { value: null, label: '전체' },
  { value: '417000', label: '개' },
  { value: '422400', label: '고양이' },
  { value: '429900', label: '기타' },
];

export interface AnimalFilterState {
  sexCd: string | null;
  state: string | null;
  upKindCd: string | null;
  searchQuery: string;
  bgnde: string | null;
  endde: string | null;
  upr_cd: string | null;
}

interface AnimalFilterHeaderProps {
  filters: AnimalFilterState;
  onFilterChange: (filters: AnimalFilterState) => void;
}

export default function AnimalFilterHeader({ filters, onFilterChange }: AnimalFilterHeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sidoList, setSidoList] = useState<SidoItem[]>([]);

  useEffect(() => {
    const loadSidoList = () => {
      const storedSidoData = localStorage.getItem('sido_data');
      if (storedSidoData) {
        try {
          const sidoData: SidoItem[] = JSON.parse(storedSidoData);
          setSidoList(sidoData);
        } catch (err) {
          console.error('시도 데이터 파싱 오류:', err);
        }
      }
    };
    loadSidoList();
  }, []);

  const derivedStartDate = useMemo(() => {
    if (filters.bgnde && filters.bgnde.length === 8) {
      return `${filters.bgnde.substring(0, 4)}-${filters.bgnde.substring(4, 6)}-${filters.bgnde.substring(6, 8)}`;
    }
    return '';
  }, [filters.bgnde]);

  const derivedEndDate = useMemo(() => {
    if (filters.endde && filters.endde.length === 8) {
      return `${filters.endde.substring(0, 4)}-${filters.endde.substring(4, 6)}-${filters.endde.substring(6, 8)}`;
    }
    return '';
  }, [filters.endde]);

  const [startDate, setStartDate] = useState<string>(derivedStartDate);
  const [endDate, setEndDate] = useState<string>(derivedEndDate);
  const [prevBgnde, setPrevBgnde] = useState(filters.bgnde);
  const [prevEndde, setPrevEndde] = useState(filters.endde);

  // Sync local state when filters change externally (e.g., reset button)
  if (filters.bgnde !== prevBgnde) {
    setPrevBgnde(filters.bgnde);
    setStartDate(derivedStartDate);
  }
  if (filters.endde !== prevEndde) {
    setPrevEndde(filters.endde);
    setEndDate(derivedEndDate);
  }

  const handleFilterChange = (key: keyof AnimalFilterState, value: string | null) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
    setOpenDropdown(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, searchQuery: e.target.value };
    onFilterChange(newFilters);
  };

  const formatDateToYYYYMMDD = (dateString: string): string | null => {
    if (!dateString) return null;
    return dateString.replace(/-/g, '');
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setStartDate(dateValue);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setEndDate(dateValue);
  };

  const handleStartDateBlur = () => {
    const formatted = formatDateToYYYYMMDD(startDate);
    const newFilters = { ...filters, bgnde: formatted };
    onFilterChange(newFilters);
  };

  const handleEndDateBlur = () => {
    const formatted = formatDateToYYYYMMDD(endDate);
    const newFilters = { ...filters, endde: formatted };
    onFilterChange(newFilters);
  };

  const getFilterLabel = (type: 'sexCd' | 'state' | 'upKindCd') => {
    const options = type === 'sexCd' ? sexOptions : type === 'state' ? stateOptions : upKindOptions;
    const selected = options.find((opt) => opt.value === filters[type]);
    return selected?.label || '전체';
  };

  return (
    <div className="w-full pb-3 pt-6 px-3 sm:pb-4 sm:pt-10 sm:px-4 ">
      <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-7xl mx-auto">
        {/* 검색창 */}
        <div className="relative w-full">
          <div className="flex items-center px-3 sm:px-4 w-full h-10 sm:h-12 bg-white border border-gray-300 rounded-full shadow-sm focus-within:border-primary1 focus-within:ring-2 focus-within:ring-primary1/20 transition-all">
            <Image
              src="/static/svg/icon-search-3.svg"
              alt="Search"
              width={18}
              height={18}
              className="mr-2 sm:mr-3 text-gray-400 shrink-0 sm:w-5 sm:h-5"
            />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              placeholder="동물등록번호, 구조위치, 보호소명"
              className="flex-1 w-full text-xs sm:text-sm placeholder-gray-400 text-gray-900 bg-transparent border-none outline-none"
            />
          </div>
        </div>

        {/* 필터 옵션 */}
        <div className="flex flex-wrap gap-2 sm:gap-3 items-start">
          {/* 성별 필터 */}
          <div className="relative z-50">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'sexCd' ? null : 'sexCd')}
              className="flex justify-between items-center px-3 sm:px-4 py-1.5 sm:py-2 min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm cursor-pointer hover:border-primary1 hover:text-primary1 transition-colors"
            >
              <span>성별: {getFilterLabel('sexCd')}</span>
              <MdArrowDropDown className={`w-4 h-4 sm:w-5 sm:h-5 ml-1 transition-transform ${openDropdown === 'sexCd' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'sexCd' && (
              <ul className="absolute left-0 top-full z-10 p-2 mt-1 min-w-[80px] sm:min-w-[100px] bg-white rounded-2xl shadow-lg border border-gray-200">
                {sexOptions.map((option) => (
                  <li
                    key={option.value || 'all'}
                    className={`p-2 text-xs sm:text-sm cursor-pointer rounded-md transition-colors ${filters.sexCd === option.value
                      ? 'bg-primary1 text-white'
                      : 'hover:bg-gray-100 hover:text-primary1'
                      }`}
                    onClick={() => handleFilterChange('sexCd', option.value)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 상태 필터 */}
          <div className="relative z-50">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'state' ? null : 'state')}
              className="flex justify-between items-center px-3 sm:px-4 py-1.5 sm:py-2 min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm cursor-pointer hover:border-primary1 hover:text-primary1 transition-colors"
            >
              <span>상태: {getFilterLabel('state')}</span>
              <MdArrowDropDown className={`w-4 h-4 sm:w-5 sm:h-5 ml-1 transition-transform ${openDropdown === 'state' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'state' && (
              <ul className="absolute left-0 top-full z-10 p-2 mt-1 min-w-[80px] sm:min-w-[100px] bg-white rounded-2xl shadow-lg border border-gray-200">
                {stateOptions.map((option) => (
                  <li
                    key={option.value || 'all'}
                    className={`p-2 text-xs sm:text-sm cursor-pointer rounded-md transition-colors ${filters.state === option.value
                      ? 'bg-primary1 text-white'
                      : 'hover:bg-gray-100 hover:text-primary1'
                      }`}
                    onClick={() => handleFilterChange('state', option.value)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 축종 필터 */}
          <div className="relative z-50">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'upKindCd' ? null : 'upKindCd')}
              className="flex justify-between items-center px-3 sm:px-4 py-1.5 sm:py-2 min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm cursor-pointer hover:border-primary1 hover:text-primary1 transition-colors"
            >
              <span>축종: {getFilterLabel('upKindCd')}</span>
              <MdArrowDropDown className={`w-4 h-4 sm:w-5 sm:h-5 ml-1 transition-transform ${openDropdown === 'upKindCd' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'upKindCd' && (
              <ul className="absolute left-0 top-full z-10 p-2 mt-1 min-w-[80px] sm:min-w-[100px] bg-white rounded-2xl shadow-lg border border-gray-200">
                {upKindOptions.map((option) => (
                  <li
                    key={option.value || 'all'}
                    className={`p-2 text-xs sm:text-sm cursor-pointer rounded-md transition-colors ${filters.upKindCd === option.value
                      ? 'bg-primary1 text-white'
                      : 'hover:bg-gray-100 hover:text-primary1'
                      }`}
                    onClick={() => handleFilterChange('upKindCd', option.value)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 접수일 필터 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-1 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-2xl sm:rounded-full shadow-sm">
            <label className="text-xs text-gray-500 whitespace-nowrap shrink-0">접수일:</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                onBlur={handleStartDateBlur}
                className="w-full sm:w-[110px] md:w-[140px] px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary1/20 focus:border-primary1 transition-all"
                placeholder="시작일"
              />
              <span className="hidden sm:inline text-gray-400 shrink-0">~</span>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                onBlur={handleEndDateBlur}
                className="w-full sm:w-[110px] md:w-[140px] px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary1/20 focus:border-primary1 transition-all"
                placeholder="종료일"
              />
            </div>
          </div>

          {/* 필터 초기화 버튼 */}
          {(filters.sexCd !== null || filters.state !== null || filters.upKindCd !== null || filters.searchQuery || filters.bgnde || filters.endde || filters.upr_cd) && (
            <button
              onClick={() => {
                const resetFilters = { sexCd: null, state: null, upKindCd: null, searchQuery: '', bgnde: null, endde: null, upr_cd: null };
                onFilterChange(resetFilters);
                setStartDate('');
                setEndDate('');
              }}
              className="w-full sm:w-auto px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* 시도 필터 버튼들 */}
        {sidoList.length > 0 && (
          <div className="flex flex-wrap justify-start gap-2 mt-2">
            <button
              onClick={() => handleFilterChange('upr_cd', null)}
              className={`px-3 py-1.5 rounded-full border transition-colors duration-200 text-xs sm:text-sm ${!filters.upr_cd
                ? 'bg-primary1 text-white border-primary1'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
            >
              전체
            </button>
            {sidoList.map((sido) => (
              <button
                key={sido.SIDO_CD}
                onClick={() => handleFilterChange('upr_cd', sido.SIDO_CD)}
                className={`px-3 py-1.5 rounded-full border transition-colors duration-200 text-xs sm:text-sm ${filters.upr_cd === sido.SIDO_CD
                  ? 'bg-primary1 text-white border-primary1'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
              >
                {getShortSidoName(sido.SIDO_NAME)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
