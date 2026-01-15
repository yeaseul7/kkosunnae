'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import Image from 'next/image';


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
  sexCd: string | null; // F, M, Q, null
  state: string | null; // notice, protect, null
  upKindCd: string | null; // 417000, 422400, 429900, null
  searchQuery: string; // rfidCd, happenPlace, careNm 검색용
  bgnde: string | null; // 접수일 시작일 (YYYYMMDD)
  endde: string | null; // 접수일 종료일 (YYYYMMDD)
}

interface AnimalFilterHeaderProps {
  filters: AnimalFilterState;
  onFilterChange: (filters: AnimalFilterState) => void;
}

export default function AnimalFilterHeader({ filters, onFilterChange }: AnimalFilterHeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // filters가 변경되면 날짜 입력 필드도 업데이트
  useEffect(() => {
    if (filters.bgnde && filters.bgnde.length === 8) {
      const formatted = `${filters.bgnde.substring(0, 4)}-${filters.bgnde.substring(4, 6)}-${filters.bgnde.substring(6, 8)}`;
      if (startDate !== formatted) {
        setStartDate(formatted);
      }
    } else if (!filters.bgnde && startDate) {
      setStartDate('');
    }
  }, [filters.bgnde, startDate]);

  useEffect(() => {
    if (filters.endde && filters.endde.length === 8) {
      const formatted = `${filters.endde.substring(0, 4)}-${filters.endde.substring(4, 6)}-${filters.endde.substring(6, 8)}`;
      if (endDate !== formatted) {
        setEndDate(formatted);
      }
    } else if (!filters.endde && endDate) {
      setEndDate('');
    }
  }, [filters.endde, endDate]);


  const handleFilterChange = (key: keyof AnimalFilterState, value: string | null) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
    setOpenDropdown(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 검색어는 즉시 업데이트 (디바운싱은 useEffect에서 처리)
    const newFilters = { ...filters, searchQuery: e.target.value };
    onFilterChange(newFilters);
  };

  // 날짜를 YYYYMMDD 형식으로 변환
  const formatDateToYYYYMMDD = (dateString: string): string | null => {
    if (!dateString) return null;
    // YYYY-MM-DD 형식을 YYYYMMDD로 변환
    return dateString.replace(/-/g, '');
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setStartDate(dateValue);
    // 필터는 onBlur에서 업데이트
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setEndDate(dateValue);
    // 필터는 onBlur에서 업데이트
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
    <div className="w-full py-6 px-4 bg-white border-b border-gray-200">
      <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
        {/* 검색창 */}
        <div className="relative w-full">
          <div className="flex items-center px-4 w-full h-12 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:border-primary1 focus-within:ring-2 focus-within:ring-primary1/20 transition-all">
            <Image
              src="/static/svg/icon-search-3.svg"
              alt="Search"
              width={20}
              height={20}
              className="mr-3 text-gray-400 shrink-0"
            />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              placeholder="동물등록번호, 구조위치, 보호소명 검색"
              className="flex-1 w-full text-sm placeholder-gray-400 text-gray-900 bg-transparent border-none outline-none"
            />
          </div>
        </div>

        {/* 필터 옵션 */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* 성별 필터 */}
          <div className="relative z-50">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'sexCd' ? null : 'sexCd')}
              className="flex justify-between items-center px-4 py-2 min-w-[100px] text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:border-primary1 hover:text-primary1 transition-colors"
            >
              <span>성별: {getFilterLabel('sexCd')}</span>
              <MdArrowDropDown className={`w-5 h-5 transition-transform ${openDropdown === 'sexCd' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'sexCd' && (
              <ul className="absolute left-0 top-full z-10 p-2 mt-1 min-w-[100px] bg-white rounded-lg shadow-lg border border-gray-200">
                {sexOptions.map((option) => (
                  <li
                    key={option.value || 'all'}
                    className={`p-2 cursor-pointer rounded-md transition-colors ${
                      filters.sexCd === option.value
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
              className="flex justify-between items-center px-4 py-2 min-w-[100px] text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:border-primary1 hover:text-primary1 transition-colors"
            >
              <span>상태: {getFilterLabel('state')}</span>
              <MdArrowDropDown className={`w-5 h-5 transition-transform ${openDropdown === 'state' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'state' && (
              <ul className="absolute left-0 top-full z-10 p-2 mt-1 min-w-[100px] bg-white rounded-lg shadow-lg border border-gray-200">
                {stateOptions.map((option) => (
                  <li
                    key={option.value || 'all'}
                    className={`p-2 cursor-pointer rounded-md transition-colors ${
                      filters.state === option.value
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
              className="flex justify-between items-center px-4 py-2 min-w-[100px] text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:border-primary1 hover:text-primary1 transition-colors"
            >
              <span>축종: {getFilterLabel('upKindCd')}</span>
              <MdArrowDropDown className={`w-5 h-5 transition-transform ${openDropdown === 'upKindCd' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'upKindCd' && (
              <ul className="absolute left-0 top-full z-10 p-2 mt-1 min-w-[100px] bg-white rounded-lg shadow-lg border border-gray-200">
                {upKindOptions.map((option) => (
                  <li
                    key={option.value || 'all'}
                    className={`p-2 cursor-pointer rounded-md transition-colors ${
                      filters.upKindCd === option.value
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
          <div className="flex items-center gap-2 px-4 py-1 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm">
            <label className="text-xs text-gray-500 whitespace-nowrap shrink-0">접수일:</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                onBlur={handleStartDateBlur}
                className="w-[140px] px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary1/20 focus:border-primary1 transition-all"
                placeholder="시작일"
              />
              <span className="text-gray-400 shrink-0">~</span>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                onBlur={handleEndDateBlur}
                className="w-[140px] px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary1/20 focus:border-primary1 transition-all"
                placeholder="종료일"
              />
            </div>
          </div>

          {/* 필터 초기화 버튼 */}
          {(filters.sexCd !== null || filters.state !== null || filters.upKindCd !== null || filters.searchQuery || filters.bgnde || filters.endde) && (
            <button
              onClick={() => {
                const resetFilters = { sexCd: null, state: null, upKindCd: null, searchQuery: '', bgnde: null, endde: null };
                onFilterChange(resetFilters);
                setStartDate('');
                setEndDate('');
              }}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              필터 초기화
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
