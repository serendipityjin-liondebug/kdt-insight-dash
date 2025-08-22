// 스쿨별 단가표 (원)
export const SCHOOL_UNIT_PRICES: Record<string, number> = {
  'FE': 16_698_000,
  'BEBY': 16_698_000,
  'AOS': 15_972_000,
  'UXUID': 13_068_000,
  'CLOUD': 14_520_000,
  'AIW': 16_698_000,
  'DA': 13_794_000,
  'UGM': 16_698_000,
  'BEJ': 17_424_000,
  'GM': 11_035_200,
};

// 과정코드에서 스쿨명을 추출하는 함수
export function extractSchoolFromCode(courseCode: string): string {
  // 과정코드에서 스쿨 부분만 추출
  const code = courseCode.toUpperCase();
  
  // 정확한 매칭을 위한 우선순위 순서 (긴 코드부터)
  const schoolCodes = ['UXUID', 'CLOUD', 'BEBY', 'AIW', 'UGM', 'BEJ', 'AOS', 'FE', 'DA', 'GM'];
  
  for (const schoolCode of schoolCodes) {
    if (code.includes(schoolCode)) {
      return schoolCode;
    }
  }
  
  // 특별한 케이스 처리
  if (code.includes('BEPY')) return 'BEBY';
  if (code.includes('CLD')) return 'CLOUD';
  if (code.includes('BEJV')) return 'BEJ';
  
  return 'DEFAULT'; // 매칭되지 않는 경우
}

// 스쿨 단가를 가져오는 함수
export function getSchoolUnitPrice(courseCode: string): number {
  const school = extractSchoolFromCode(courseCode);
  return SCHOOL_UNIT_PRICES[school] || 0;
}

// 기본 단가 (매칭되지 않는 경우)
export const DEFAULT_UNIT_PRICE = 0;