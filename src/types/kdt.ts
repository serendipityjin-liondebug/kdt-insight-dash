// KDT 프로그램 데이터 타입 정의

export interface KDTProgram {
  // 기본 정보
  과정구분: string;
  과정코드: string;
  회차: number;
  교육시간: number;
  개강: Date;
  종강: Date | null;
  년도: number;
  분기: string;
  
  // 성과 지표
  HRD_만족도: number | null;
  정원: number;
  전체_지원: number | null;
  지원완료: number | null;
  HRD_전환률: number | null;
  HRD_확정: number | null;
  이탈: number | null;
  수료: number | null;
  근로자: number | null;
  산정_제외: number | null;
  제외_수료율: number | null;
  취창업: number | null;
  취업률: number | null;
  제외_취업률: number | null;
  최소_매출: number | null;
  
  // 계산된 필드
  진행상태: '진행중' | '완료';
  모객율: number;
  수료율: number;
  분기키: string;
}

export interface KPICard {
  title: string;
  value: number;
  target: number;
  unit: string;
  trend?: number; // 전 분기 대비 증감률
  status: 'success' | 'warning' | 'danger';
}

export interface ChartData {
  name: string;
  [key: string]: any;
}

export interface FilterState {
  년도?: number;
  분기?: string;
  월?: number;
  과정구분?: string;
  진행상태?: '진행중' | '완료' | '전체';
}

export interface DashboardTab {
  id: string;
  label: string;
  icon?: React.ComponentType;
}