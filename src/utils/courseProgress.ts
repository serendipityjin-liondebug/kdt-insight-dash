// 교육과정 진행률 및 D-Day 계산 유틸리티

import { KDTProgram } from '@/types/kdt';

/**
 * 교육과정 진행률 계산
 * @param startDate 개강일
 * @param endDate 종강일  
 * @param currentDate 현재 날짜 (기본값: 오늘)
 * @returns 진행률 (0-100)
 */
export const calculateProgressRate = (
  startDate: Date, 
  endDate: Date | null, 
  currentDate: Date = new Date()
): number => {
  if (!endDate) return 0;
  
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = currentDate.getTime() - startDate.getTime();
  
  if (totalDuration <= 0) return 0;
  if (elapsedDuration <= 0) return 0;
  if (elapsedDuration >= totalDuration) return 100;
  
  return Math.round((elapsedDuration / totalDuration) * 100);
};

/**
 * 종강일까지 D-Day 계산
 * @param endDate 종강일
 * @param currentDate 현재 날짜 (기본값: 오늘)
 * @returns D-Day 문자열
 */
export const calculateDDay = (
  endDate: Date | null, 
  currentDate: Date = new Date()
): string => {
  if (!endDate) return '-';
  
  const diffTime = endDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return '진행완료';
  if (diffDays === 0) return 'D-DAY';
  return `D-${diffDays}`;
};

/**
 * 진행상태를 정확히 판단
 * @param program KDT 프로그램 데이터
 * @param currentDate 현재 날짜
 * @returns '진행중' | '완료'
 */
export const determineStatus = (
  program: KDTProgram, 
  currentDate: Date = new Date()
): '진행중' | '완료' => {
  // 종강일이 없으면 진행중
  if (!program.종강) return '진행중';
  
  // 현재 날짜가 종강일을 지났으면 완료
  if (currentDate > program.종강) return '완료';
  
  // 수료 데이터가 있고 HRD 만족도가 숫자인 경우 완료
  if (program.수료 !== null && typeof program.HRD_만족도 === 'number') {
    return '완료';
  }
  
  return '진행중';
};

/**
 * 진행률에 따른 색상 클래스 반환
 * @param progressRate 진행률 (0-100)
 * @returns Tailwind 색상 클래스
 */
export const getProgressColor = (progressRate: number): string => {
  if (progressRate < 30) return 'bg-blue-500';
  if (progressRate < 70) return 'bg-orange-500';
  return 'bg-green-500';
};

/**
 * D-Day에 따른 긴급도 색상 반환
 * @param dday D-Day 문자열
 * @returns Tailwind 색상 클래스
 */
export const getDDayColor = (dday: string): string => {
  if (dday === 'D-DAY' || dday === '진행완료') return 'text-green-600';
  
  const match = dday.match(/D-(\d+)/);
  if (match) {
    const days = parseInt(match[1]);
    if (days <= 7) return 'text-red-600';
    if (days <= 30) return 'text-orange-600';
  }
  
  return 'text-blue-600';
};