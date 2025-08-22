import { KDTProgram } from '@/types/kdt';
import { EditProgramInput } from '@/components/CourseEditDialog';

/**
 * 과정 데이터 관리를 위한 유틸리티 함수들
 * 추후 백엔드 API로 쉽게 변경 가능하도록 구조화
 */

export const courseDataUtils = {
  /**
   * 프로그램 키 생성 (과정코드_회차)
   */
  createProgramKey: (program: KDTProgram): string => {
    return `${program.과정코드}_${program.회차}`;
  },

  /**
   * 편집된 데이터로 프로그램 업데이트
   */
  updateProgram: (originalProgram: KDTProgram, editedData: EditProgramInput): KDTProgram => {
    // 계산된 필드 업데이트
    const 수료율 = editedData.제외_수료율 !== null && editedData.제외_수료율 !== undefined
      ? editedData.제외_수료율
      : (editedData.수료 && editedData.정원 ? Math.round((editedData.수료 / editedData.정원) * 100 * 10) / 10 : 0);

    const 모객율 = editedData.HRD_확정 && editedData.정원 && editedData.정원 > 0
      ? Math.round((editedData.HRD_확정 / editedData.정원) * 100 * 10) / 10
      : 0;

    const 진행상태: KDTProgram['진행상태'] = (
      editedData.HRD_만족도 === null || editedData.HRD_만족도 === undefined ||
      ((editedData.취업률 ?? 0) === 0 && 수료율 < 100)
    ) ? '진행중' : '완료';

    return {
      ...originalProgram,
      과정구분: editedData.과정구분,
      과정코드: editedData.과정코드,
      회차: editedData.회차,
      교육시간: editedData.교육시간,
      개강: editedData.개강,
      종강: editedData.종강,
      년도: editedData.년도,
      분기: editedData.분기,
      정원: editedData.정원,
      HRD_만족도: editedData.HRD_만족도,
      전체_지원: editedData.전체_지원,
      지원완료: editedData.지원완료,
      HRD_전환률: editedData.HRD_전환률,
      HRD_확정: editedData.HRD_확정,
      이탈: editedData.이탈,
      수료: editedData.수료,
      근로자: editedData.근로자,
      산정_제외: editedData.산정_제외,
      제외_수료율: editedData.제외_수료율,
      취창업: editedData.취창업,
      취업률: editedData.취업률,
      제외_취업률: editedData.제외_취업률,
      최소_매출: editedData.최소_매출,
      // 계산된 필드들
      진행상태,
      모객율,
      수료율,
      분기키: `${editedData.년도} ${editedData.분기}`,
    };
  },

  /**
   * 로컬 스토리지에서 사용자 프로그램 로드
   */
  loadUserPrograms: (): KDTProgram[] => {
    try {
      const raw = localStorage.getItem('kdt_user_programs');
      return raw ? (JSON.parse(raw) as KDTProgram[]).map(p => ({
        ...p,
        개강: new Date(p.개강),
        종강: p.종강 ? new Date(p.종강) : null,
      })) : [];
    } catch {
      return [];
    }
  },

  /**
   * 로컬 스토리지에 사용자 프로그램 저장
   */
  saveUserPrograms: (programs: KDTProgram[]): void => {
    try {
      localStorage.setItem('kdt_user_programs', JSON.stringify(programs));
    } catch (error) {
      console.error('프로그램 저장 실패:', error);
      throw new Error('프로그램 저장에 실패했습니다.');
    }
  },

  /**
   * 프로그램 목록에서 특정 프로그램 찾기
   */
  findProgram: (programs: KDTProgram[], programKey: string): KDTProgram | undefined => {
    return programs.find(p => courseDataUtils.createProgramKey(p) === programKey);
  },

  /**
   * 프로그램 목록에서 특정 프로그램 제거
   */
  removeProgram: (programs: KDTProgram[], programKey: string): KDTProgram[] => {
    return programs.filter(p => courseDataUtils.createProgramKey(p) !== programKey);
  },

  /**
   * 프로그램 목록에서 특정 프로그램 업데이트
   */
  replaceProgram: (programs: KDTProgram[], programKey: string, updatedProgram: KDTProgram): KDTProgram[] => {
    return programs.map(p => 
      courseDataUtils.createProgramKey(p) === programKey ? updatedProgram : p
    );
  }
};

// 추후 백엔드 연동을 위한 API 함수 placeholder
export const courseApiUtils = {
  /**
   * 서버에서 프로그램 목록 가져오기 (추후 구현)
   */
  async fetchPrograms(): Promise<KDTProgram[]> {
    // 추후 실제 API 호출로 교체
    throw new Error('API not implemented yet');
  },

  /**
   * 서버에 새 프로그램 생성 (추후 구현)
   */
  async createProgram(program: KDTProgram): Promise<KDTProgram> {
    // 추후 실제 API 호출로 교체
    throw new Error('API not implemented yet');
  },

  /**
   * 서버에서 프로그램 업데이트 (추후 구현)
   */
  async updateProgram(programId: string, program: KDTProgram): Promise<KDTProgram> {
    // 추후 실제 API 호출로 교체
    throw new Error('API not implemented yet');
  },

  /**
   * 서버에서 프로그램 삭제 (추후 구현)
   */
  async deleteProgram(programId: string): Promise<void> {
    // 추후 실제 API 호출로 교체
    throw new Error('API not implemented yet');
  }
};