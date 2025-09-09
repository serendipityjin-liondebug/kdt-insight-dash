// KDT 프로그램 데이터 파싱 및 처리

import { KDTProgram, FilterState } from '@/types/kdt';

const rawCSV = `과정구분,과정코드,회차,교육시간,개강,종강,년도,분기,HRD 만족도,정원,전체 지원,지원완료,HRD 전환률,HRD 확정,이탈,수료,근로자,산정 제외,제외 수료율,취창업,취업률,제외 취업률,최소 매출(수료 인원)
AI웹,KDT_B_AIW_0001,1,920,2024-07-10,2025-01-03,2024,3Q,4.2,60,547,98,24.5%,24,10,14,4,0,58.3%,5,50.0%,50.0%,233772000
프론트(웹),KDT_B_FE_0011,1,920,2024-07-24,2025-01-24,2024,3Q,4.6,70,308,77,41.6%,32,2,30,2,1,96.8%,13,46.4%,48.1%,500940000
데이터분석,KDT_B_DA_0003,3,760,2024-08-27,2025-01-23,2024,3Q,4.4,60,365,80,66.3%,53,11,42,2,2,82.4%,14,35.0%,36.8%,579348000
안드로이드,KDT_B_AOS_0003,3,920,2024-09-09,2025-03-06,2024,3Q,4.4,80,173,58,43.1%,25,3,22,2,0,88.0%,6,30.0%,30.0%,367356000
유니티,KDT_B_UGM_0002,2,920,2024-09-23,2025-03-21,2024,3Q,4.4,60,355,100,59.0%,59,13,46,2,1,79.3%,23,52.3%,53.5%,768108000
프론트(기업),KDT_B_FE_0012,1,920,2024-09-23,2025-03-26,2024,3Q,4.8,70,281,48,70.8%,34,6,28,0,0,82.4%,15,53.6%,53.6%,467544000
파이썬,KDT_B_BEPY_0012,4,920,2024-10-10,2025-04-08,2024,4Q,4.8,100,212,24,62.5%,15,7,8,3,0,53.3%,6,120.0%,120.0%,133584000
클라우드,KDT_B_CLD_0002,2,800,2024-10-24,2025-03-26,2024,4Q,4.4,60,281,67,44.8%,30,7,23,3,3,85.2%,4,20.0%,23.5%,333960000
유니티,KDT_B_UGM_0003,3,920,2024-11-19,2025-05-16,2024,4Q,3.8,120,607,151,79.5%,120,26,94,4,5,81.7%,27,30.0%,31.8%,1569612000
블록체인,KDT_B_BC_0006,5,720,2024-11-20,2025-04-10,2024,4Q,4.7,80,82,24,50.0%,12,7,5,2,2,50.0%,4,133.3%,400.0%,65340000
디자인,KDT_B_UXUID_0004,4,720,2024-11-29,2025-04-22,2024,4Q,4.1,120,443,98,83.7%,82,20,62,8,0,75.6%,19,35.2%,35.2%,810216000
자바,KDT_B_BEJV_0013,1,960,2024-11-29,2025-06-04,2024,4Q,4.3,60,265,52,67.3%,35,7,28,3,0,80.0%,10,40.0%,40.0%,487872000
iOS,KDT_B_iOS_0007,7,920,2024-12-18,2025-06-13,2024,4Q,3.6,100,234,78,57.7%,45,11,34,2,1,77.3%,1,3.1%,3.2%,567732000
데이터분석,KDT_B_DA_0004,4,760,2024-12-19,2025-05-16,2024,4Q,4.2,60,403,57,66.7%,38,14,24,6,4,70.6%,7,38.9%,50.0%,331056000
파이썬,KDT_B_BEPY_0014,5,920,2024-12-30,2025-06-27,2024,4Q,4.7,100,158,23,52.2%,12,3,9,0,0,75.0%,1,11.1%,11.1%,150282000
그로스마케팅,KDT_B_GM_0001,1,608,2025-01-31,2025-05-23,2025,1Q,3.8,60,408,126,45.2%,57,16,41,7,0,71.9%,8,23.5%,23.5%,452443200
프론트(웹),KDT_B_FE_0013,2,920,2025-02-05,2025-08-08,2025,1Q,진행중,70,462,112,62.5%,70,10,60,0,2,88.2%,0,0.0%,0.0%,1001880000
유니티,KDT_B_UGM_0004,4,920,2025-02-20,2025-08-19,2025,1Q,4.0,120,618,159,64.8%,103,8,95,0,0,92.2%,0,0.0%,0.0%,1586310000
자바,KDT_B_BEJV_0015,2,960,2025-02-25,2025-08-22,2025,1Q,진행중,60,344,68,82.4%,56,10,46,2,0,82.1%,0,0.0%,0.0%,801504000
안드로이드,KDT_B_AOS_0004,4,920,2025-03-12,2025-09-02,2025,1Q,진행중,80,259,47,48.9%,23,5,18,0,0,78.3%,4,22.2%,22.2%,300564000
클라우드,KDT_B_CLD_0003,3,800,2025-03-27,2025-08-22,2025,1Q,진행중,60,287,64,50.0%,32,9,23,0,1,74.2%,0,0.0%,0.0%,333960000
데이터분석,KDT_B_DA_0005,5,760,2025-03-28,2025-08-20,2025,1Q,진행중,90,476,131,57.3%,75,10,65,5,0,86.7%,0,0.0%,0.0%,896610000
디자인,KDT_B_UXUID_0005,5,720,2025-03-31,2025-08-22,2025,1Q,진행중,120,637,192,52.6%,101,11,90,5,0,89.1%,0,0.0%,0.0%,1176120000
프론트(기업),KDT_B_FE_0014,2,920,2025-04-21,2025-10-30,2025,2Q,진행중,70,317,64,68.8%,44,3,41,0,0,93.2%,0,0.0%,0.0%,684618000
그로스마케팅,KDT_B_GM_0002,2,608,2025-04-30,2025-08-26,2025,2Q,진행중,90,417,160,33.8%,54,15,39,5,0,72.2%,0,0.0%,0.0%,430372800
파이썬,KDT_B_BEPY_0016,6,920,2025-04-30,2025-10-17,2025,2Q,진행중,100,243,68,35.3%,24,3,21,0,0,87.5%,0,0.0%,0.0%,350658000
유니티,KDT_B_UGM_0005,5,920,2025-05-13,2025-11-12,2025,2Q,진행중,120,584,213,56.3%,120,7,113,0,2,95.8%,0,0.0%,0.0%,1886874000
자바,KDT_B_BEJV_0017,3,960,2025-05-28,2025-11-27,2025,2Q,진행중,60,230,93,52.7%,49,4,45,1,0,91.8%,0,0.0%,0.0%,784080000
데이터분석,KDT_B_DA_0006,6,760,2025-06-30,2025-11-20,2025,2Q,진행중,90,556,145,39.3%,57,2,55,0,0,96.5%,0,0.0%,0.0%,758670000
안드로이드,KDT_B_AOS_0005,5,920,2025-07-10,2026-01-13,2025,3Q,진행중,80,397,52,46.2%,24,0,24,0,0,100.0%,0,0.0%,0.0%,400752000
파이썬,KDT_B_BEPY_0018,7,920,2025-07-15,2026-01-28,2025,3Q,진행중,60,349,37,51.4%,19,0,19,0,0,100.0%,0,0.0%,0.0%,317262000
클라우드,KDT_B_CLD_0004,4,800,2025-07-29,2026-01-14,2025,3Q,,60,,51,,22,,15,,,,,,223608000
그로스마케팅,KDT_B_GM_0003,3,608,2025-08-05,2025-12-04,2025,3Q,진행중,90,382,92,53.3%,49,0,40,0,0,81.6%,0,0.0%,0.0%,441408000
프론트,KDT_B_FE_0015,3,920,2025-08-12,2026-02-13,2025,3Q,진행중,70,,,,35,,25,,,,,409101000
디자인,KDT_B_UXUID_0006,6,720,2025-08-28,2026-01-21,2025,3Q,진행중,120,,85,105.9%,90,,63,,,,,,,823284000
AIW,KDT_B_AIW_0002,2,920,2025-09-02,,2025,3Q,,60,,,,0,,,,,,,0
자바,KDT_B_BEJV_0019,4,960,2025-08-13,2026-02-25,2025,3Q,,60,,,,-,38,,27,,,,,463478400`;

// 유틸리티 함수들
const parsePercentage = (value: string): number | null => {
  if (!value || value === '-' || value === '진행중') return null;
  const numStr = value.replace('%', '');
  const num = parseFloat(numStr);
  return isNaN(num) ? null : num;
};

const parseNumber = (value: string): number | null => {
  if (!value || value === '-' || value === '진행중') return null;
  const num = parseFloat(value.replace(/,/g, ''));
  return isNaN(num) ? null : num;
};

const parseSatisfaction = (value: string): number | null => {
  if (!value || value === '-' || value === '진행중') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

const parseDate = (dateStr: string): Date | null => {
  if (!dateStr || dateStr === '-') return null;
  return new Date(dateStr);
};

// 데이터 파싱
export const parseKDTData = (): KDTProgram[] => {
  const lines = rawCSV.trim().split('\n');
  const headers = lines[0].split(',');
  const programs: KDTProgram[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const program: Partial<KDTProgram> = {};

    // 기본 정보 파싱
    program.과정구분 = values[0];
    program.과정코드 = values[1];
    program.회차 = parseInt(values[2]) || 0;
    program.교육시간 = parseInt(values[3]) || 0;
    program.개강 = parseDate(values[4])!;
    program.종강 = parseDate(values[5]);
    program.년도 = parseInt(values[6]) || 0;
    program.분기 = values[7];

    // 성과 지표 파싱
    program.HRD_만족도 = parseSatisfaction(values[8]);
    program.정원 = parseInt(values[9]) || 0;
    program.전체_지원 = parseNumber(values[10]);
    program.지원완료 = parseNumber(values[11]);
    program.HRD_전환률 = parsePercentage(values[12]);
    program.HRD_확정 = parseNumber(values[13]);
    program.이탈 = parseNumber(values[14]);
    program.수료 = parseNumber(values[15]);
    program.근로자 = parseNumber(values[16]);
    program.산정_제외 = parseNumber(values[17]);
    program.제외_수료율 = parsePercentage(values[18]);
    program.취창업 = parseNumber(values[19]);
    program.취업률 = parsePercentage(values[20]);
    program.제외_취업률 = parsePercentage(values[21]);
    program.최소_매출 = parseNumber(values[22]);

    // 취업률 데이터 검증 (0-100% 범위로 제한)
    if (program.취업률 !== null && (program.취업률 < 0 || program.취업률 > 100)) {
      program.취업률 = null;
    }
    if (program.제외_취업률 !== null && (program.제외_취업률 < 0 || program.제외_취업률 > 100)) {
      program.제외_취업률 = null;
    }

    // 계산된 필드
    program.분기키 = `${program.년도} ${program.분기}`;
    
    // 모객율 계산 - 확정인원/정원으로 변경
    program.모객율 = program.HRD_확정 && program.정원 && program.정원 > 0 
      ? Math.round((program.HRD_확정 / program.정원) * 100 * 10) / 10 
      : 0;

    // 수료율 계산
    program.수료율 = program.제외_수료율 !== null 
      ? program.제외_수료율 
      : (program.수료 && program.정원 ? Math.round((program.수료 / program.정원) * 100 * 10) / 10 : 0);

    // 진행상태 계산 - 더 정확한 로직 적용
    const currentDate = new Date();
    const isAfterEndDate = program.종강 && currentDate > program.종강;
    const hasCompletionData = program.수료 !== null && typeof program.HRD_만족도 === 'number';
    
    program.진행상태 = (isAfterEndDate || hasCompletionData) ? '완료' : '진행중';

    programs.push(program as KDTProgram);
  }

  return programs;
};

// 필터링 함수
export const filterPrograms = (programs: KDTProgram[], filters: FilterState): KDTProgram[] => {
  return programs.filter(program => {
    if (filters.년도 && program.년도 !== filters.년도) return false;
    if (filters.분기 && program.분기 !== filters.분기) return false;
    if (filters.월 && (program.개강.getMonth() + 1) !== filters.월) return false;
    if (filters.과정구분 && program.과정구분 !== filters.과정구분) return false;
    if (filters.진행상태 && filters.진행상태 !== '전체' && program.진행상태 !== filters.진행상태) return false;
    return true;
  });
};

// 집계 함수들
export const calculateKPI = (programs: KDTProgram[]) => {
  const completed = programs.filter(p => p.진행상태 === '완료');
  
  return {
    평균_모객율: programs.length > 0 ? 
      Math.round((programs.reduce((sum, p) => sum + p.모객율, 0) / programs.length) * 10) / 10 : 0,
    평균_취업률: completed.length > 0 ? 
      Math.round((completed.reduce((sum, p) => sum + (p.취업률 || 0), 0) / completed.length) * 10) / 10 : 0,
    평균_HRD_만족도: programs.filter(p => p.HRD_만족도 !== null).length > 0 ? 
      Math.round((programs.filter(p => p.HRD_만족도 !== null)
        .reduce((sum, p) => sum + (p.HRD_만족도 || 0), 0) / 
        programs.filter(p => p.HRD_만족도 !== null).length) * 10) / 10 : 0,
    평균_수료율: completed.length > 0 ? 
      Math.round((completed.reduce((sum, p) => sum + p.수료율, 0) / completed.length) * 10) / 10 : 0,
  };
};

// 기본 데이터 로드
export const kdtPrograms = parseKDTData();
